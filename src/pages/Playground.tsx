import {
    useEffect,
    useMemo,
    useRef,
    useState,
    useLayoutEffect,
    type KeyboardEvent,
} from "react";
import { Link } from "wouter";
import {
    Check,
    ChevronDown,
    ChevronLeft,
    CircleAlert,
    CircleCheck,
    Copy,
    FileCode2,
    Menu,
    Minus,
    PanelBottom,
    Play,
    RotateCcw,
    Terminal,
    X,
} from "lucide-react";
import { examples, readyExamples, type MrExample } from "@/examples/registry";
import {
    mrCompletions,
    extractDynamicSymbols,
    formatMrCode,
    tokenDocs,
    type MrCompletion,
    type TokenDoc,
} from "@/editor/completions";
import { HighlightedCode } from "@/editor/syntax";
import { cx } from "@/lib/format";
import { Mark } from "@/components/layout/Mark";
import { createCompileClient } from "@/editor/compileClient";

type CompileState = "idle" | "running" | "success" | "error" | "unavailable";

export default function Playground() {
    const params = new URLSearchParams(window.location.search);
    const initial = params.get("example")
        ? examples.find((example) => example.slug === params.get("example"))
        : undefined;
    const [selectedSlug, setSelectedSlug] = useState<string | null>(
        initial?.slug ?? null,
    );
    const [code, setCode] = useState(initial?.code ?? "");
    const [output, setOutput] = useState("");
    const [compileState, setCompileState] = useState<CompileState>("idle");
    const [exitCode, setExitCode] = useState<number | null>(null);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [wrap, setWrap] = useState(true);
    const [fontSize, setFontSize] = useState(14);
    const [split, setSplit] = useState(58);
    const [copied, setCopied] = useState(false);
    const [cursor, setCursor] = useState({ line: 1, column: 1 });

    // Autocomplete State
    const [completionOpen, setCompletionOpen] = useState(false);
    const [completionQuery, setCompletionQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [menuPosition, setMenuPosition] = useState({
        top: 0,
        left: 0,
        showAbove: false,
    });

    // Hover Card State
    const [hoverDoc, setHoverDoc] = useState<{
        doc: TokenDoc;
        x: number;
        y: number;
    } | null>(null);

    const dragging = useRef(false);
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const preRef = useRef<HTMLPreElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);
    const lineNumbersRef = useRef<HTMLDivElement>(null);
    const idleTimerRef = useRef<number | null>(null);
    const hoverDebounceRef = useRef<number | null>(null);
    const compileClientRef = useRef(createCompileClient()).current;

    const selected = selectedSlug
        ? examples.find((example) => example.slug === selectedSlug)
        : undefined;

    const dynamicSymbols = useMemo(() => extractDynamicSymbols(code), [code]);
    const completionPool = useMemo(
        () => [...mrCompletions, ...dynamicSymbols],
        [dynamicSymbols],
    );
    const syncCursorAndCompletion = (value: string, position: number) => {
        updateCursor(value, position);
        updateCompletion(value, position);
    };

    // --- 2. Defensive scroll resync after any code/cursor change ---
    useLayoutEffect(() => {
        const ta = editorRef.current;
        if (!ta) return;
        if (preRef.current) {
            preRef.current.scrollTop = ta.scrollTop;
            preRef.current.scrollLeft = ta.scrollLeft;
        }
        if (lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = ta.scrollTop;
        }
    }, [code, cursor]);
    const activeSuggestions = useMemo(() => {
        if (!completionQuery) return [];
        return completionPool
            .filter((item) =>
                item.token
                    .toLowerCase()
                    .startsWith(completionQuery.toLowerCase()),
            )
            .slice(0, 8);
    }, [completionPool, completionQuery]);

    useEffect(() => {
        if (!pickerOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target as Node)
            ) {
                setPickerOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [pickerOpen]);

    useEffect(() => {
        const move = (event: PointerEvent) => {
            if (dragging.current)
                setSplit(
                    Math.max(
                        30,
                        Math.min(75, (event.clientX / window.innerWidth) * 100),
                    ),
                );
        };
        const up = () => {
            dragging.current = false;
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
        return () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
        };
    }, []);

    const performFormat = () => {
        const ta = editorRef.current;
        if (!ta) return;
        const currentCursor = ta.selectionStart;
        const formatted = formatMrCode(ta.value);
        if (formatted !== ta.value) {
            setCode(formatted);
            requestAnimationFrame(() => {
                ta.selectionStart = Math.min(currentCursor, formatted.length);
                ta.selectionEnd = ta.selectionStart;
            });
        }
    };

    const triggerDebouncedFormat = () => {
        if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = window.setTimeout(() => {
            performFormat();
        }, 1600);
    };

    // Spacious, uniform line-height across numbers, pre, and textarea
    const LINE_HEIGHT = 28;
    const MONO_FONT =
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

    const computeMenuCoordinates = (
        textarea: HTMLTextAreaElement,
        pos: number,
    ) => {
        const textBefore = textarea.value.slice(0, pos);
        const lines = textBefore.split("\n");
        const lineIdx = lines.length - 1;
        const colIdx = lines[lineIdx].length;

        const charWidth = fontSize * 0.602;
        const rect = textarea.getBoundingClientRect();
        const isMobile = window.innerWidth < 768;

        const cursorLineTop = lineIdx * LINE_HEIGHT - textarea.scrollTop + 56;
        const leftOffset =
            colIdx * charWidth - textarea.scrollLeft + 20 + (isMobile ? 0 : 8);

        const count = Math.max(1, Math.min(activeSuggestions.length, 8));
        const menuHeight = count * 32 + 10;

        const spaceBelow = rect.height - (cursorLineTop + LINE_HEIGHT);
        const shouldShowAbove = spaceBelow < menuHeight + 10;

        let computedTop = cursorLineTop + LINE_HEIGHT + 4;
        if (shouldShowAbove) {
            computedTop = Math.max(56, cursorLineTop - menuHeight - 4);
        }

        const menuWidth = isMobile ? Math.min(220, rect.width - 24) : 216;
        const maxLeft = Math.max(8, rect.width - menuWidth - 14);
        const clampedLeft = Math.max(8, Math.min(leftOffset, maxLeft));

        return {
            top: computedTop,
            left: clampedLeft,
            showAbove: shouldShowAbove,
        };
    };

    const updateCursor = (value: string, position: number) => {
        const before = value.slice(0, position);
        const lines = before.split("\n");
        setCursor({
            line: lines.length,
            column: lines[lines.length - 1].length + 1,
        });
    };

    const updateCompletion = (value: string, position: number) => {
        const lineStart =
            value.lastIndexOf("\n", Math.max(0, position - 1)) + 1;
        const prefix =
            value.slice(lineStart, position).match(/[A-Za-z_-]*$/)?.[0] ?? "";
        setCompletionQuery(prefix);
        setSelectedIndex(0);

        if (prefix.length > 0 && editorRef.current) {
            setMenuPosition(
                computeMenuCoordinates(editorRef.current, position),
            );
            setCompletionOpen(true);
        } else {
            setCompletionOpen(false);
        }
    };

    const chooseExample = (example: MrExample) => {
        setSelectedSlug(example.slug);
        setCode(example.code);
        setOutput("");
        setCompileState("idle");
        setExitCode(null);
        setPickerOpen(false);
        setCompletionOpen(false);
        setHoverDoc(null);
        setCursor({ line: 1, column: 1 });
    };

    const chooseCompletion = (item: MrCompletion) => {
        const target = editorRef.current;
        if (!target) return;
        const position = target.selectionStart;
        const lineStart = code.lastIndexOf("\n", Math.max(0, position - 1)) + 1;
        const prefix =
            code.slice(lineStart, position).match(/[A-Za-z_-]*$/)?.[0] ?? "";
        const next = `${code.slice(0, position - prefix.length)}${item.insertText}${code.slice(position)}`;

        setCode(next);
        setCompletionOpen(false);
        setCompletionQuery("");

        requestAnimationFrame(() => {
            target.focus();
            const targetPos =
                position -
                prefix.length +
                item.insertText.length +
                (item.cursorOffset ?? 0);
            target.selectionStart = targetPos;
            target.selectionEnd = targetPos;
            updateCursor(next, targetPos);
        });
    };

    const handleTextareaMouseMove = (
        e: React.MouseEvent<HTMLTextAreaElement>,
    ) => {
        const ta = editorRef.current;
        if (!ta || completionOpen) {
            if (hoverDoc) setHoverDoc(null);
            return;
        }

        const rect = ta.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - 20 + ta.scrollLeft;
        const offsetY = e.clientY - rect.top - 56 + ta.scrollTop;

        const charWidth = fontSize * 0.602;
        const lineIndex = Math.floor(offsetY / LINE_HEIGHT);
        const colIndex = Math.floor(offsetX / charWidth);

        const lines = ta.value.split("\n");
        if (lineIndex < 0 || lineIndex >= lines.length) {
            if (hoverDoc) setHoverDoc(null);
            return;
        }

        const line = lines[lineIndex];
        if (colIndex < 0 || colIndex >= line.length) {
            if (hoverDoc) setHoverDoc(null);
            return;
        }

        let start = colIndex;
        while (start > 0 && /[A-Za-z0-9_]/.test(line[start - 1])) start--;
        let end = colIndex;
        while (end < line.length && /[A-Za-z0-9_]/.test(line[end])) end++;

        const hoveredWord = line.slice(start, end).trim();

        if (hoverDebounceRef.current)
            window.clearTimeout(hoverDebounceRef.current);

        if (hoveredWord && tokenDocs[hoveredWord]) {
            hoverDebounceRef.current = window.setTimeout(() => {
                const doc = tokenDocs[hoveredWord];
                const cardX = Math.min(
                    Math.max(16, e.clientX - 20),
                    window.innerWidth - 330,
                );
                const cardY =
                    e.clientY + 22 + 200 > window.innerHeight
                        ? Math.max(10, e.clientY - 210)
                        : e.clientY + 18;

                setHoverDoc({ doc, x: cardX, y: cardY });
            }, 120);
        } else {
            if (hoverDoc) setHoverDoc(null);
        }
    };

    const handleTextareaMouseLeave = () => {
        if (hoverDebounceRef.current)
            window.clearTimeout(hoverDebounceRef.current);
        setHoverDoc(null);
    };

    const handleEditorScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
        const top = e.currentTarget.scrollTop;
        const left = e.currentTarget.scrollLeft;
        if (preRef.current) {
            preRef.current.scrollTop = top;
            preRef.current.scrollLeft = left;
        }
        if (lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = top;
        }
        if (completionOpen && editorRef.current) {
            setMenuPosition(
                computeMenuCoordinates(
                    editorRef.current,
                    editorRef.current.selectionStart,
                ),
            );
        }
        if (hoverDoc) setHoverDoc(null);
    };

    const run = async () => {
        if (selected?.status === "planned" || !code.trim()) return;
        setCompileState("running");
        setOutput("");
        setExitCode(null);
        setCompletionOpen(false);
        setHoverDoc(null);
        try {
            const result = await compileClientRef.run(code);
            setOutput(
                result.success
                    ? result.output
                    : (result.error ?? "Compilation failed."),
            );
            setExitCode(result.exitCode ?? 1);
            setCompileState(result.success ? "success" : "error");
        } catch (error) {
            setExitCode(1);
            setCompileState(
                error instanceof TypeError ? "unavailable" : "error",
            );
            setOutput(
                error instanceof TypeError
                    ? "Compiler unavailable — could not reach the compiler backend."
                    : `Compile error — ${error instanceof Error ? error.message : "the compiler could not process this program."}`,
            );
        }
    };

    const reset = () => {
        setCode(selected?.code ?? "");
        setOutput("");
        setCompileState("idle");
        setExitCode(null);
        setCompletionOpen(false);
        setHoverDoc(null);
        setCursor({ line: 1, column: 1 });
    };

    const copyCode = async () => {
        try {
            await navigator.clipboard?.writeText(code);
        } catch {
            return;
        }
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
    };

    const onEditorKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        triggerDebouncedFormat();
        if (hoverDoc) setHoverDoc(null);

        if (event.key === "Enter" && event.ctrlKey) {
            event.preventDefault();
            void run();
            return;
        }

        if (completionOpen && activeSuggestions.length > 0) {
            if (event.key === "ArrowDown") {
                event.preventDefault();
                setSelectedIndex(
                    (prev) => (prev + 1) % activeSuggestions.length,
                );
                return;
            }
            if (event.key === "ArrowUp") {
                event.preventDefault();
                setSelectedIndex(
                    (prev) =>
                        (prev - 1 + activeSuggestions.length) %
                        activeSuggestions.length,
                );
                return;
            }
            if (event.key === "Enter" || event.key === "Tab") {
                event.preventDefault();
                chooseCompletion(activeSuggestions[selectedIndex]);
                return;
            }
            if (event.key === "Escape") {
                event.preventDefault();
                setCompletionOpen(false);
                return;
            }
        }

        if (event.key === "Escape") {
            setCompletionOpen(false);
            setHoverDoc(null);
            return;
        }

        if (event.key === "Tab") {
            event.preventDefault();
            const target = event.currentTarget;
            const start = target.selectionStart;
            const end = target.selectionEnd;
            const next = `${code.slice(0, start)}    ${code.slice(end)}`;
            setCode(next);
            requestAnimationFrame(() => {
                target.selectionStart = start + 4;
                target.selectionEnd = start + 4;
            });
            return;
        }

        if (event.key === "Enter") {
            const target = event.currentTarget;
            const start = target.selectionStart;
            const lineStart = code.lastIndexOf("\n", start - 1) + 1;
            const currentLine = code.slice(lineStart, start);
            const indentMatch = currentLine.match(/^\s*/);
            const currentIndent = indentMatch ? indentMatch[0] : "";

            if (currentLine.trim().endsWith("{")) {
                event.preventDefault();
                const nextIndent = currentIndent + "    ";
                const hasClosing = code[start] === "}";
                const textToInsert = `\n${nextIndent}${hasClosing ? `\n${currentIndent}` : ""}`;
                const nextCode = `${code.slice(0, start)}${textToInsert}${code.slice(start)}`;
                setCode(nextCode);
                requestAnimationFrame(() => {
                    target.selectionStart = start + nextIndent.length + 1;
                    target.selectionEnd = target.selectionStart;
                    updateCursor(nextCode, target.selectionStart);
                });
            }
        }
    };

    return (
        <div className="flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden bg-transparent text-foreground">
            {/* Token Hover Explanation Card */}
            {hoverDoc && (
                <div
                    className="pointer-events-none fixed z-50 w-72 overflow-hidden p-3.5 rounded-xl frost animate-rise-in"
                    style={{
                        top: `${hoverDoc.y}px`,
                        left: `${hoverDoc.x}px`,
                    }}
                >
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                        <span className="font-mono text-xs font-bold text-primary">
                            {hoverDoc.doc.token}
                        </span>
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary">
                            {hoverDoc.doc.category}
                        </span>
                    </div>

                    <div className="mt-2.5 space-y-2 text-xs">
                        <div>
                            <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                                English
                            </div>
                            <p className="mt-0.5 text-xs leading-5 text-foreground/90">
                                {hoverDoc.doc.english}
                            </p>
                        </div>

                        <div>
                            <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                                मराठी
                            </div>
                            <p className="mt-0.5 text-xs leading-5 text-muted-foreground marathi-font">
                                {hoverDoc.doc.marathi}
                            </p>
                        </div>

                        <div className="border-t border-border/60 pt-2">
                            <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                                Syntax
                            </div>
                            <pre className="mt-1 whitespace-pre-wrap rounded bg-sidebar/80 p-1.5 font-mono text-[10px] leading-4 text-[#c3e88d]">
                                {hoverDoc.doc.syntax}
                            </pre>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Header */}
            <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-sidebar px-3 sm:px-5">
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="focus-ring flex items-center gap-2 rounded-lg text-sm text-muted-foreground hover:text-foreground"
                        data-testid="link-playground-back"
                    >
                        <ChevronLeft size={17} />{" "}
                        <span className="hidden sm:inline">Back</span>
                    </Link>
                    <span className="h-5 w-px bg-border" />
                    <Mark />
                    <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">
                        playground
                    </span>
                </div>
                <div
                    className="relative flex items-center gap-2"
                    ref={pickerRef}
                >
                    <button
                        onClick={() => setPickerOpen((open) => !open)}
                        className="focus-ring flex max-w-[180px] items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-left text-xs hover:border-primary/60 sm:max-w-none"
                        data-testid="button-example-picker"
                    >
                        <FileCode2
                            size={14}
                            className="shrink-0 text-primary"
                        />
                        <span className="truncate">
                            {selected?.title ?? "Choose example"}
                        </span>
                        <ChevronDown size={13} />
                    </button>
                    {pickerOpen && (
                        <div className="absolute right-0 top-11 z-30 w-72 overflow-hidden rounded-xl border border-border glass p-1 shadow-[var(--shadow-lg)]">
                            <div className="px-3 py-2 font-mono text-[10px] uppercase tracking-[.15em] text-muted-foreground">
                                examples / उदाहरणे
                            </div>
                            {readyExamples.map((example) => (
                                <button
                                    key={example.slug}
                                    onClick={() => chooseExample(example)}
                                    className={cx(
                                        "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs hover:bg-secondary",
                                        example.slug === selectedSlug &&
                                            "bg-primary/10 text-primary",
                                    )}
                                    data-testid={`button-pick-${example.slug}`}
                                >
                                    <span>{example.title}</span>
                                    {example.slug === selectedSlug && (
                                        <Check size={13} />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <button
                    onClick={run}
                    disabled={
                        compileState === "running" ||
                        selected?.status === "planned" ||
                        !code.trim()
                    }
                    className="focus-ring flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
                    data-testid="button-run-code"
                >
                    <Play size={14} />{" "}
                    <span className="hidden sm:inline">
                        {selected?.status === "planned"
                            ? "Planned"
                            : compileState === "running"
                              ? "Running…"
                              : "Run"}
                    </span>
                </button>
            </header>

            {/* Vertical Stack on Mobile, Resizable Horizontal Split on Desktop */}
            <main className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
                {/* Code Editor Column */}
                <section
                    className="code relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:flex-none"
                    style={{
                        flexBasis:
                            typeof window !== "undefined" &&
                            window.innerWidth >= 768
                                ? `${split}%`
                                : undefined,
                    }}
                >
                    {/* Floating Frosted Control Toolbar */}
                    <div className="absolute top-1 left-2 right-2 z-20 flex h-11 items-center justify-between border-b border-border/60 px-4 frost rounded-lg">
                        <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground truncate">
                            <span className="h-2 w-2 rounded-full bg-accent shrink-0" />
                            <span className="truncate">
                                {selected?.title ?? "untitled.mr"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            <button
                                onClick={() =>
                                    setFontSize((size) =>
                                        Math.max(11, size - 1),
                                    )
                                }
                                className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                                aria-label="Decrease font size"
                                data-testid="button-font-decrease"
                            >
                                <Minus size={14} />
                            </button>
                            <span className="w-8 text-center font-mono text-[10px] text-muted-foreground">
                                {fontSize}
                            </span>
                            <button
                                onClick={() =>
                                    setFontSize((size) =>
                                        Math.min(20, size + 1),
                                    )
                                }
                                className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                                aria-label="Increase font size"
                                data-testid="button-font-increase"
                            >
                                <PlusIcon />
                            </button>
                            <button
                                onClick={copyCode}
                                className="ml-2 rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                                aria-label="Copy code"
                                data-testid="button-copy-code"
                            >
                                {copied ? (
                                    <Check size={14} className="text-primary" />
                                ) : (
                                    <Copy size={14} />
                                )}
                            </button>
                            <button
                                onClick={reset}
                                className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                                aria-label="Reset code"
                                data-testid="button-reset-code"
                            >
                                <RotateCcw size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Dual-Layer Synced Editor Viewport */}
                    <div className="relative flex min-h-0 flex-1 overflow-hidden">
                        {/* Intelligent Completion Menu */}
                        {completionOpen && activeSuggestions.length > 0 && (
                            <div
                                className="absolute z-30 w-[calc(100%-24px)] max-w-[210px] overflow-hidden rounded-lg frost shadow-xl"
                                style={{
                                    top: `${menuPosition.top}px`,
                                    left: `${menuPosition.left}px`,
                                }}
                            >
                                <div className="max-h-48 overflow-y-auto p-1">
                                    {activeSuggestions.map((item, idx) => (
                                        <button
                                            key={item.token}
                                            type="button"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                chooseCompletion(item);
                                            }}
                                            className={cx(
                                                "flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-xs transition-colors",
                                                idx === selectedIndex
                                                    ? "bg-primary/20 text-primary"
                                                    : "text-foreground hover:bg-secondary",
                                            )}
                                        >
                                            <span className="font-mono">
                                                {item.token}
                                            </span>
                                            <span className="font-mono text-[9px] uppercase text-muted-foreground/70">
                                                {item.category}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Gutter: Strictly matching line height and dynamic font size */}
                        <div
                            ref={lineNumbersRef}
                            className="thin-scroll w-11 shrink-0 select-none overflow-hidden border-r border-border/60 pb-16 pt-14 text-right text-muted-foreground/35"
                            style={{
                                fontSize: `${fontSize}px`,
                                lineHeight: `${LINE_HEIGHT}px`,
                                fontFamily: MONO_FONT,
                                letterSpacing: "0px",
                                fontVariantLigatures: "none",
                                WebkitTextSizeAdjust: "100%",
                                boxSizing: "border-box",
                            }}
                        >
                            {code.split("\n").map((_, i) => (
                                <div
                                    key={i}
                                    className="pr-3"
                                    style={{
                                        height: `${LINE_HEIGHT}px`,
                                        lineHeight: `${LINE_HEIGHT}px`,
                                    }}
                                >
                                    {String(i + 1).padStart(2, "0")}
                                </div>
                            ))}
                        </div>

                        {/* Dual Layer: Color Syntax Mirror (<pre>) + Caret Input (<textarea>) */}
                        <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
                            <pre
                                ref={preRef}
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre px-5 pb-16 pt-14 text-[#c5d1ee] m-0 border-0 font-mono"
                                style={{
                                    fontSize: `${fontSize}px`,
                                    lineHeight: `${LINE_HEIGHT}px`,
                                    fontFamily: MONO_FONT,
                                    tabSize: 4,
                                    letterSpacing: "0px",
                                    fontKerning: "none",
                                    fontVariantLigatures: "none",
                                    WebkitTextSizeAdjust: "100%",
                                    boxSizing: "border-box",
                                }}
                            >
                                <HighlightedCode code={code} />
                            </pre>
                            <textarea
                                ref={editorRef}
                                value={code}
                                draggable={false}
                                wrap="off"
                                autoCapitalize="off"
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck={false}
                                onChange={(event) => {
                                    setCode(event.target.value);
                                    updateCursor(
                                        event.target.value,
                                        event.target.selectionStart,
                                    );
                                    updateCompletion(
                                        event.target.value,
                                        event.target.selectionStart,
                                    );
                                    if (hoverDoc) setHoverDoc(null);
                                }}
                                onKeyDown={onEditorKeyDown}
                                onSelect={(event) =>
                                    syncCursorAndCompletion(
                                        event.currentTarget.value,
                                        event.currentTarget.selectionStart,
                                    )
                                }
                                onClick={(event) => {
                                    updateCursor(
                                        event.currentTarget.value,
                                        event.currentTarget.selectionStart,
                                    );
                                    updateCompletion(
                                        event.currentTarget.value,
                                        event.currentTarget.selectionStart,
                                    );
                                }}
                                onMouseMove={handleTextareaMouseMove}
                                onMouseLeave={handleTextareaMouseLeave}
                                onScroll={handleEditorScroll}
                                onFocus={(event) =>
                                    updateCompletion(
                                        event.currentTarget.value,
                                        event.currentTarget.selectionStart,
                                    )
                                }
                                onBlur={() => {
                                    performFormat();
                                    setCompletionOpen(false);
                                    setHoverDoc(null);
                                }}
                                style={{
                                    fontSize: `${fontSize}px`,
                                    lineHeight: `${LINE_HEIGHT}px`,
                                    fontFamily: MONO_FONT,
                                    caretColor: "hsl(var(--primary))",
                                    tabSize: 4,
                                    letterSpacing: "0px",
                                    fontKerning: "none",
                                    fontVariantLigatures: "none",
                                    WebkitTextSizeAdjust: "100%",
                                    boxSizing: "border-box",
                                    whiteSpace: "pre",
                                }}
                                className="editor-scroll relative h-full w-full resize-none overflow-auto bg-transparent px-5 pb-16 pt-14 text-transparent selection:bg-primary/25 outline-none placeholder:text-muted-foreground/40 m-0 border-0"
                                placeholder="Start with an .mr thought…"
                                data-testid="textarea-code-editor"
                                aria-label="Code editor"
                            />
                        </div>
                    </div>
                </section>

                {/* Divider Handle (Desktop Only) */}
                <div
                    className="group relative hidden w-1.5 rounded-2xl h-1/2 self-center shrink-0 cursor-col-resize items-center justify-center bg-border/40 hover:bg-primary/50 md:flex"
                    onPointerDown={() => {
                        dragging.current = true;
                    }}
                    role="separator"
                    aria-label="Drag editor output divider"
                    data-testid="divider-editor-output"
                >
                    <span className="h-9 w-0.5 rounded bg-muted-foreground/40 group-hover:bg-primary" />
                </div>

                {/* Output Console Column: Fixed 38% height on mobile, fills rest of space on desktop */}
                <section className="code border-t md:border-t-0 md:border-l-0 flex h-[38%] md:h-full shrink-0 md:shrink md:min-h-0 min-w-0 md:flex-1 flex-col overflow-hidden">
                    <div className="flex h-9 md:h-11 shrink-0 items-center justify-between border-b border-border/60 px-4 frost rounded-lg mx-2 mt-1">
                        <div className="flex items-center gap-2 font-mono text-[12px] text-muted-foreground">
                            <Terminal size={14} className="text-primary" />{" "}
                            output
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="font-mono text-[10px] bg-none mr-1 ml-2 md:ml-3">
                                {compileState === "success" ? (
                                    <span className="flex items-center gap-1 text-[#9ed6c5]">
                                        <CircleCheck size={12} /> exited cleanly
                                    </span>
                                ) : compileState === "unavailable" ? (
                                    <span className="flex items-center gap-1 text-primary">
                                        <CircleAlert size={12} /> no compiler
                                    </span>
                                ) : (
                                    "ready"
                                )}
                            </span>
                            <button
                                onClick={() => setWrap((value) => !value)}
                                className={cx(
                                    "rounded px-2 py-0.5 md:py-1 font-mono text-[10px]",
                                    wrap
                                        ? "bg-secondary text-foreground"
                                        : "text-muted-foreground hover:bg-secondary",
                                )}
                                data-testid="button-toggle-wrap"
                            >
                                wrap
                            </button>
                            <button
                                onClick={() => setOutput("")}
                                className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                                aria-label="Clear output"
                                data-testid="button-clear-output"
                            >
                                <X size={13} />
                            </button>
                        </div>
                    </div>
                    <div
                        className={cx(
                            "editor-scroll min-h-0 flex-1 overflow-auto p-4 md:p-5 pb-10 font-mono text-xs md:text-sm leading-6 md:leading-7",
                            wrap
                                ? "whitespace-pre-wrap break-words"
                                : "whitespace-pre",
                        )}
                        data-testid="output-terminal"
                    >
                        {compileState === "idle" && !output ? (
                            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                                <PanelBottom
                                    size={20}
                                    className="mb-2 text-primary/70 md:size-6 md:mb-4"
                                />
                                <p className="text-xs md:text-sm">
                                    Run your program to see its output.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                                    <span
                                        className={cx(
                                            "h-1.5 w-1.5 rounded-full",
                                            compileState === "success"
                                                ? "bg-[#9ed6c5]"
                                                : compileState === "running"
                                                  ? "bg-primary"
                                                  : "bg-destructive",
                                        )}
                                    />
                                    {compileState === "running"
                                        ? "compiling…"
                                        : compileState === "success"
                                          ? "process finished"
                                          : compileState === "unavailable"
                                            ? "compiler unavailable"
                                            : "compiler error"}
                                </div>
                                <div
                                    className={cx(
                                        compileState === "error" ||
                                            compileState === "unavailable"
                                            ? "text-destructive"
                                            : "text-[#c5d1ee]",
                                    )}
                                >
                                    {output}
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </main>

            {/* Translucent Frosted Acrylic Status Bar */}
            <footer
                className="fixed bottom-0 left-0 right-0 z-30 flex h-7 shrink-0 items-center justify-between border-t border-white/[0.08] px-4 font-mono text-[10px] text-muted-foreground sm:px-5 frost backdrop-saturate-150"
                aria-label="Compiler status"
            >
                <div className="flex items-center gap-3 md:gap-4">
                    <span
                        className={cx(
                            "flex items-center gap-1.5",
                            compileState === "success"
                                ? "text-[#9ed6c5]"
                                : compileState === "error"
                                  ? "text-[#f44747]"
                                  : compileState === "unavailable"
                                    ? "text-primary"
                                    : "text-muted-foreground",
                        )}
                    >
                        <span
                            className={cx(
                                "h-1.5 w-1.5 rounded-full",
                                compileState === "success"
                                    ? "bg-[#9ed6c5]"
                                    : compileState === "error"
                                      ? "bg-[#f44747]"
                                      : compileState === "running"
                                        ? "bg-primary animate-pulse"
                                        : "bg-muted-foreground",
                            )}
                        />
                        {compileState === "running"
                            ? "Compiling…"
                            : compileState === "success"
                              ? "Executed"
                              : compileState === "error"
                                ? "Error"
                                : compileState === "unavailable"
                                  ? "Unavailable"
                                  : "Ready"}
                    </span>
                    <span>Code {exitCode ?? ""}</span>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                    <span>
                        Ln {cursor.line}, Col {cursor.column}
                    </span>

                    <span className="text-foreground/70">मराठी</span>
                    <span className="text-primary/70">.mr</span>
                </div>
            </footer>
        </div>
    );
}

function PlusIcon() {
    return (
        <span className="block h-3.5 w-3.5 text-center font-mono text-sm leading-3">
            +
        </span>
    );
}
