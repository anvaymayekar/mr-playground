import {
    useEffect,
    useMemo,
    useRef,
    useState,
    useLayoutEffect,
    type AnchorHTMLAttributes,
    type KeyboardEvent,
    type ReactNode,
} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    BookOpen,
    Braces,
    Check,
    ChevronDown,
    ChevronLeft,
    CircleAlert,
    CircleCheck,
    CircleDashed,
    Copy,
    Cpu,
    ExternalLink,
    FileCode2,
    Github,
    Info,
    Languages,
    Menu,
    Minus,
    PanelBottom,
    Play,
    RotateCcw,
    Search,
    Terminal,
    X,
    Zap,
} from "lucide-react";
import {
    Link,
    Route,
    Switch,
    useLocation,
    Router as WouterRouter,
} from "wouter";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
    examples,
    getExample,
    readyExamples,
    type MrExample,
} from "@/examples/registry";
import {
    mrCompletions,
    extractDynamicSymbols,
    formatMrCode,
    tokenDocs,
    type MrCompletion,
    type TokenDoc,
} from "@/editor/completions";
import { HighlightedCode } from "@/editor/syntax";

const queryClient = new QueryClient();

const cx = (...classes: Array<string | false | undefined>) =>
    classes.filter(Boolean).join(" ");
const playgroundHref = (slug: string) =>
    `/playground?example=${encodeURIComponent(slug)}`;

function Mark() {
    return <img src="/icon.svg" className="scale-80" />;
}

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [location] = useLocation();
    const items = [
        { href: "/examples", label: "Examples" },
        { href: "/docs", label: "Docs" },
        { href: "/about", label: "About" },
    ];
    return (
        <header className="sticky top-0 z-40 border-b border-border/80 bg-[hsl(var(--background)/.88)] backdrop-blur-xl">
            <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
                <Link
                    href="/"
                    className="focus-ring rounded-lg"
                    data-testid="link-home"
                >
                    <Mark />
                </Link>
                <nav
                    className="hidden items-center gap-1 md:flex"
                    aria-label="Main navigation"
                >
                    {items.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            data-testid={`link-nav-${item.label.toLowerCase()}`}
                            className={cx(
                                "rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                                location === item.href &&
                                    "bg-secondary text-foreground",
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="hidden items-center gap-3 md:flex">
                    <a
                        className="focus-ring flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        href="https://github.com/anvaymayekar"
                        target="_blank"
                        rel="noreferrer"
                        data-testid="link-github"
                    >
                        <Github size={16} /> GitHub <ExternalLink size={12} />
                    </a>
                    <PlaygroundAnchor
                        className="focus-ring flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                        data-testid="link-header-playground"
                    >
                        Open Playground <ArrowUpRight size={15} />
                    </PlaygroundAnchor>
                </div>
                <button
                    className="focus-ring rounded-lg p-2 text-muted-foreground md:hidden"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-label="Toggle menu"
                    data-testid="button-toggle-menu"
                >
                    {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>
            {menuOpen && (
                <div className="border-t border-border bg-sidebar px-5 py-4 md:hidden">
                    <nav className="flex flex-col gap-1">
                        {items.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                                onClick={() => setMenuOpen(false)}
                                data-testid={`link-mobile-${item.label.toLowerCase()}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <PlaygroundAnchor
                            className="mt-2 flex items-center justify-between rounded-lg bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground"
                            data-testid="link-mobile-playground"
                        >
                            Open Playground <ArrowUpRight size={15} />
                        </PlaygroundAnchor>
                    </nav>
                </div>
            )}
        </header>
    );
}

function Footer() {
    return (
        <footer className="border-t border-border/80 bg-sidebar">
            <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-5 py-10 sm:flex-row sm:items-end sm:justify-between lg:px-8">
                <div>
                    <Mark />
                    <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
                        मराठी, संगणकासाठी.
                        <br />A native language project for curious machines and
                        the people who build them.
                    </p>
                </div>
                <div className="text-left sm:text-right">
                    <p className="font-mono text-xs text-muted-foreground">
                        Created by Anvay Mayekar with Prem &amp; Pride.
                    </p>
                    <div className="mt-3 flex gap-4 sm:justify-end">
                        <Link
                            href="/docs"
                            className="text-xs text-muted-foreground hover:text-primary"
                            data-testid="link-footer-docs"
                        >
                            Documentation
                        </Link>
                        <a
                            href="https://github.com/anvaymayekar"
                            className="text-xs text-muted-foreground hover:text-primary"
                            target="_blank"
                            rel="noreferrer"
                            data-testid="link-footer-github"
                        >
                            GitHub
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function Shell({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-[100dvh] bg-background text-foreground">
            <Header />
            {children}
            <Footer />
        </div>
    );
}

function SectionEyebrow({ children }: { children: ReactNode }) {
    return (
        <p className="mb-4 flex items-center gap-2 font-mono text-[12px] uppercase tracking-[.18em] text-primary">
            <span className="h-px w-5 bg-primary" />
            {children}
        </p>
    );
}

function PlaygroundAnchor({
    slug,
    children,
    className,
    ...props
}: {
    slug?: string;
    children: ReactNode;
    className?: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
    return (
        <a
            href={slug ? playgroundHref(slug) : "/playground"}
            target="_blank"
            rel="noreferrer"
            className={className}
            {...props}
        >
            {children}
        </a>
    );
}

function CodeBlock({
    example,
    compact = false,
}: {
    example: MrExample;
    compact?: boolean;
}) {
    let lines = example.code.split("\n");
    if (example.output.length > 0) {
        lines.push("\n");
        lines.push("\n");
    }
    return (
        <div
            className={cx(
                "group relative overflow-hidden rounded-xl code transition-all duration-300 hover:border-white/[0.14]",
                compact ? "text-[11px]" : "text-xs",
            )}
        >
            {/* Top specular edge highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

            {/* Header tab */}
            <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
                <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground/80">
                    <FileCode2 size={13} className="text-primary" />
                    <span className="text-foreground/80">{example.title}</span>
                </div>
                {example.status === "ready" ? (
                    <PlaygroundAnchor
                        slug={example.slug}
                        className="flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 font-mono text-[10px] text-primary transition-all hover:border-primary/40 hover:bg-primary/20"
                        data-testid={`link-run-code-${example.slug}`}
                    >
                        Run <ArrowUpRight size={12} />
                    </PlaygroundAnchor>
                ) : (
                    <span className="font-mono text-[10px] text-accent">
                        planned
                    </span>
                )}
            </div>

            {/* Code and Gutter Area */}
            <div
                className={cx(
                    "flex overflow-x-auto p-4 code-font",
                    compact ? "max-h-[220px]" : "max-h-[340px]",
                )}
            >
                <div className="w-10 shrink-0 select-none border-r border-white/[0.08] pr-3 text-right font-mono text-xs leading-6 text-muted-foreground/35">
                    {lines.map((_, i) => (
                        <div key={i}>{String(i + 1).padStart(2, "0")}</div>
                    ))}
                </div>
                <pre className="!m-0 min-w-0 flex-1 !bg-transparent pl-4 font-mono text-xs leading-6 text-[#c5d1ee] whitespace-pre drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                    <HighlightedCode code={example.code} />
                </pre>
            </div>

            {/* Fluid Execution Output */}
            {example.output && example.output.trim().length > 0 && (
                <div className="absolute bottom-0 right-0 border-t rounded-tl-xl border-white/[0.06] glass px-4 py-2.5">
                    <div className="flex items-baseline gap-2 font-mono text-xs">
                        <span className="shrink-0 select-none text-[10px] text-primary/70">
                            stdout ❯
                        </span>
                        <pre className="!m-0 min-w-0 flex-1 overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs leading-5 text-[#cad1cf] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                            {example.output}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}

function Home() {
    const featured = getExample("functions-and-arguments");
    const [typedCode, setTypedCode] = useState("");

    useEffect(() => {
        const fullText = featured.code;
        let position = 0;
        let isDeleting = false;
        let timer: ReturnType<typeof setTimeout>;

        const tick = () => {
            if (!isDeleting) {
                // Natural forward typing (1 char per tick)
                position += 1;
                setTypedCode(fullText.slice(0, position));

                if (position >= fullText.length) {
                    // Fully typed: wait 3 seconds before backspacing
                    isDeleting = true;
                    timer = setTimeout(tick, 3000);
                    return;
                }
                timer = setTimeout(tick, 32);
            } else {
                // Natural backspacing (1 char per tick at controlled speed)
                position -= 1;
                setTypedCode(fullText.slice(0, Math.max(0, position)));

                if (position <= 0) {
                    // Fully deleted: pause 800ms before re-typing
                    isDeleting = false;
                    timer = setTimeout(tick, 800);
                    return;
                }
                timer = setTimeout(tick, 28);
            }
        };

        timer = setTimeout(tick, 300);

        return () => clearTimeout(timer);
    }, [featured.code]);

    const activeLines = useMemo(() => {
        return typedCode ? typedCode.split("\n") : [""];
    }, [typedCode]);

    return (
        <Shell>
            <main>
                <section className="relative overflow-hidden border-b border-border/70">
                    <div className="absolute inset-0 dot-grid opacity-40" />
                    <div className="absolute -right-20 top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
                    <div className="relative mx-auto grid max-w-[1240px] gap-12 px-5 pb-20 pt-20 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-28">
                        <div className="animate-rise-in">
                            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 font-mono text-[11px] text-primary">
                                <CircleDashed
                                    size={13}
                                    className="animate-spin [animation-duration:8s]"
                                />{" "}
                                Created by Anvay with Prem &amp; Pride.
                            </div>
                            <h1 className="max-w-[700px] text-[clamp(3.1rem,7vw,6.6rem)] font-semibold leading-[.96] tracking-[-.075em] text-foreground">
                                Marathi,
                                <br />
                                <span className="text-primary">
                                    understood by machines.
                                </span>
                            </h1>
                            <p className="hero-marathi marathi-font mt-10 text-lg font-medium text-foreground/90 sm:text-xl">
                                मराठी, संगणकासाठी.
                            </p>
                            <p className="mt-5 max-w-[490px] text-lg leading-8 text-muted-foreground">
                                .mr is a real Marathi programming language
                                compiled to native machine code. Readable enough
                                to invite you in. Close enough to the metal to
                                keep you curious.
                            </p>
                            <div className="mt-9 flex flex-wrap items-center gap-3">
                                <PlaygroundAnchor
                                    slug="types-and-variables"
                                    className="focus-ring flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                                    data-testid="link-hero-playground"
                                >
                                    Try .mr <ArrowRight size={16} />
                                </PlaygroundAnchor>
                                <Link
                                    href="/docs"
                                    className="focus-ring flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/60 hover:bg-secondary"
                                    data-testid="link-hero-docs"
                                >
                                    Read the docs <BookOpen size={15} />
                                </Link>
                            </div>
                            <div className="mt-12 flex items-center gap-5 font-mono text-[11px] text-muted-foreground">
                                <span>BUILT FROM SCRATCH</span>
                                <span className="h-1 w-1 rounded-full bg-primary" />
                                <span>C++20</span>
                                <span className="h-1 w-1 rounded-full bg-primary" />
                                <span>X86-64</span>
                            </div>
                        </div>
                        <div className="animate-rise-in animate-rise-in-delay-2">
                            <div className="relative rounded-2xl border code p-2 shadow-[var(--shadow-lg)] -z-10">
                                <div className="flex items-center justify-between rounded-xl px-4 py-2.5">
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-primary" />
                                        <span className="h-2 w-2 rounded-full bg-primary" />
                                        <span className="h-2 w-2 rounded-full bg-primary" />
                                    </div>
                                    <span className="font-mono text-[11px] text-muted-foreground">
                                        source.mr
                                    </span>
                                </div>
                                <div className="hero-terminal relative overflow-hidden rounded-xl px-4 py-4 font-mono text-[13px] leading-6 backdrop-blur-xl transition-all duration-150">
                                    <div className="grid grid-cols-[32px_1fr]">
                                        <div className="select-none pr-3 text-right text-xs leading-6 text-muted-foreground/35">
                                            {activeLines.map((_, index) => (
                                                <div key={index}>
                                                    {String(index + 1).padStart(
                                                        2,
                                                        "0",
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <pre className="overflow-x-auto text-[#c5d1ee] leading-6">
                                            <HighlightedCode code={typedCode} />
                                            <span className="cursor-blink ml-0.5 inline-block h-3.5 w-[1px] translate-y-[2px] bg-primary align-middle" />
                                        </pre>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 font-mono text-[10px] text-muted-foreground">
                                        <span>native compiler surface</span>
                                        <span className="text-primary/80">
                                            .mr / x86-64
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8 lg:py-28">
                    <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
                        <div>
                            <SectionEyebrow>Why .mr</SectionEyebrow>
                            <h2 className="max-w-sm text-4xl font-semibold leading-tight tracking-[-.045em]">
                                The distance between a thought and a process.
                            </h2>
                        </div>
                        <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
                            {[
                                [
                                    Cpu,
                                    "Native by nature",
                                    "Compiled to machine code. No runtime theatre between your idea and the processor.",
                                ],
                                [
                                    Braces,
                                    "Readable, not watered down",
                                    "Roman-script Marathi source with the directness of a language made for learning.",
                                ],
                                [
                                    Zap,
                                    "A language project",
                                    "Lexer, parser, AST, semantic analysis, code generation — every layer is part of the work.",
                                ],
                                [
                                    Languages,
                                    "Marathi at the core",
                                    "मराठी is not a skin on top. It is the reason this language exists.",
                                ],
                            ].map(([Icon, title, copy], i) => {
                                const IconComponent = Icon as typeof Cpu;
                                return (
                                    <div
                                        key={String(title)}
                                        className="bg-card p-6 transition-colors hover:bg-secondary/70 sm:p-7"
                                    >
                                        <IconComponent
                                            size={20}
                                            className={cx(
                                                "mb-8",
                                                i % 2
                                                    ? "text-accent"
                                                    : "text-primary",
                                            )}
                                        />
                                        <h3 className="font-medium">
                                            {String(title)}
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                            {String(copy)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="border-y border-border/70 bg-sidebar">
                    <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-20 lg:grid-cols-[.72fr_1.28fr] lg:items-center lg:px-8 lg:py-24">
                        <div>
                            <SectionEyebrow>
                                Start here / इथून सुरू करा
                            </SectionEyebrow>
                            <h2 className="text-4xl font-semibold tracking-[-.05em]">
                                Small programs.
                                <br />
                                Big questions.
                            </h2>
                            <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
                                Pick an example, change a line, and run it. The
                                fastest way to understand a language is to make
                                it answer back.
                            </p>
                            <Link
                                href="/examples"
                                className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3"
                                data-testid="link-home-examples"
                            >
                                Browse all examples <ArrowRight size={15} />
                            </Link>
                        </div>
                        <CodeBlock
                            example={getExample("conditional-statements")}
                        />
                    </div>
                </section>

                <section className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8 lg:py-28">
                    <div className="flex flex-col justify-between gap-8 border-b border-border pb-10 sm:flex-row sm:items-end">
                        <div>
                            <SectionEyebrow>Made in layers</SectionEyebrow>
                            <h2 className="max-w-lg text-4xl font-semibold tracking-[-.05em]">
                                From Marathi words
                                <br />
                                to native instructions.
                            </h2>
                        </div>
                        <Link
                            href="/about"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                            data-testid="link-home-story"
                        >
                            Read the story <ArrowUpRight size={15} />
                        </Link>
                    </div>
                    <div className="grid gap-0 divide-y divide-border pt-2 md:grid-cols-4 md:divide-x md:divide-y-0">
                        {[
                            "Source",
                            "Lexer + Parser",
                            "Semantic analysis",
                            "Native output",
                        ].map((label, i) => (
                            <div
                                key={label}
                                className="py-6 md:px-6 md:first:pl-0"
                            >
                                <span className="font-mono text-xs text-primary">
                                    0{i + 1}
                                </span>
                                <h3 className="mt-5 font-medium">{label}</h3>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    {
                                        [
                                            "You write a thought in Roman-script Marathi.",
                                            "Tokens become a shape the compiler can understand.",
                                            "Meaning and types are checked before anything runs.",
                                            "x86-64 assembly meets the machine.",
                                        ][i]
                                    }
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </Shell>
    );
}

function ExamplesPage() {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All");
    const categories = [
        "All",
        "Foundations",
        "Control flow",
        "Functions",
        "Machine level",
        "Runtime",
        "Planned",
    ];

    const filtered = useMemo(
        () =>
            examples.filter((example) => {
                const matchesQuery =
                    `${example.title} ${example.marathiTitle} ${example.description} ${example.code}`
                        .toLowerCase()
                        .includes(query.toLowerCase());
                return (
                    matchesQuery &&
                    (category === "All" || example.category === category)
                );
            }),
        [query, category],
    );

    return (
        <Shell>
            <main className="mx-auto max-w-[1240px] px-4 sm:px-6 py-12 lg:px-8 lg:py-20">
                <div className="max-w-2xl animate-rise-in">
                    <SectionEyebrow>Examples / उदाहरणे</SectionEyebrow>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-.065em]">
                        Learn by making
                        <br />
                        <span className="text-primary">
                            the machine answer.
                        </span>
                    </h1>
                    <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-muted-foreground">
                        A small library of programs that show how .mr thinks.
                        Every ready example opens directly in the playground.
                    </p>
                </div>

                <div className="mt-10 sm:mt-12 flex flex-col gap-4 border-y border-border py-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative w-full lg:max-w-md">
                        <Search
                            size={16}
                            className="absolute left-3.5 top-3.5 text-muted-foreground"
                        />
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search examples by topic or keyword…"
                            className="focus-ring h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/70"
                            data-testid="input-search-examples"
                        />
                    </div>
                    <div className="thin-scroll flex gap-1.5 overflow-x-auto pb-1 max-w-full">
                        {categories.map((item) => (
                            <button
                                key={item}
                                onClick={() => setCategory(item)}
                                className={cx(
                                    "whitespace-nowrap rounded-lg px-3 py-2 text-xs font-mono transition-colors shrink-0",
                                    category === item
                                        ? "bg-primary text-primary-foreground font-semibold"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                                )}
                                data-testid={`button-category-${item.toLowerCase().replace(" ", "-")}`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6 mt-6 sm:mt-8 flex items-center justify-between">
                    <p
                        className="font-mono text-xs text-muted-foreground"
                        data-testid="text-example-count"
                    >
                        {filtered.length}{" "}
                        {filtered.length === 1 ? "example" : "examples"}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">
                        Roman-script Marathi
                    </p>
                </div>

                {filtered.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-20 text-center">
                        <CircleAlert
                            className="mx-auto text-primary"
                            size={23}
                        />
                        <h2 className="mt-4 text-lg font-medium">
                            Nothing in this notebook.
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Try a different word or clear the filter.
                        </p>
                        <button
                            onClick={() => {
                                setQuery("");
                                setCategory("All");
                            }}
                            className="mt-5 text-sm text-primary hover:underline"
                            data-testid="button-clear-example-search"
                        >
                            Clear search
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8 sm:space-y-10">
                        {filtered.map((example, index) => {
                            const isFlipped = index % 2 !== 0;
                            return (
                                <article
                                    key={example.slug}
                                    className={cx(
                                        "group rounded-2xl border border-border/80 bg-card/50 p-5 sm:p-7 lg:p-8 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-2xl overflow-hidden",
                                        `animate-rise-in-delay-${Math.min((index % 4) + 1, 3)}`,
                                    )}
                                    data-testid={`card-example-${example.slug}`}
                                >
                                    <div className="grid gap-6 sm:gap-8 lg:grid-cols-12 lg:items-start min-w-0">
                                        {/* Description / Text Column */}
                                        <div
                                            className={cx(
                                                "flex flex-col justify-between lg:col-span-5 h-full min-w-0",
                                                isFlipped && "lg:order-2",
                                            )}
                                        >
                                            <div>
                                                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="rounded-md bg-secondary px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
                                                            {example.category}
                                                        </span>
                                                        {example.status ===
                                                        "planned" ? (
                                                            <span className="rounded-md border border-accent/30 px-2 py-0.5 font-mono text-[10px] text-accent">
                                                                planned
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#9ed6c5]">
                                                                <span className="h-1.5 w-1.5 rounded-full bg-[#9ed6c5]" />
                                                                runnable
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="font-mono text-xs text-muted-foreground/40 font-semibold">
                                                        #
                                                        {String(
                                                            index + 1,
                                                        ).padStart(2, "0")}
                                                    </span>
                                                </div>

                                                <div className="mt-4 sm:mt-5">
                                                    <h2 className="text-xl sm:text-2xl font-semibold tracking-[-.03em] text-foreground transition-colors group-hover:text-primary">
                                                        {example.title}
                                                    </h2>
                                                    <p className="mt-1 font-mono text-sm font-medium text-primary/85">
                                                        {example.marathiTitle}
                                                    </p>
                                                    <div className="mt-3 sm:mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                                                        <p>
                                                            {
                                                                example.description
                                                            }
                                                        </p>
                                                        <p className="marathi-font text-xs text-foreground/60 border-l-2 border-primary/30 pl-3 leading-6">
                                                            {
                                                                example.marathiDescription
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="mt-5 sm:mt-7 pt-4 border-t border-border/40">
                                                {example.status === "ready" ? (
                                                    <PlaygroundAnchor
                                                        slug={example.slug}
                                                        className="inline-flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-3.5 py-2 text-xs font-mono font-medium text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary"
                                                    >
                                                        Open in Playground{" "}
                                                        <ArrowUpRight
                                                            size={14}
                                                        />
                                                    </PlaygroundAnchor>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-accent">
                                                        Planned implementation
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Code Column (Properly Constrained on Mobile) */}
                                        <div
                                            className={cx(
                                                "w-full min-w-0 lg:col-span-7",
                                                isFlipped && "lg:order-1",
                                            )}
                                        >
                                            <div className="relative w-full max-w-full overflow-hidden rounded-xl code border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.45)]">
                                                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

                                                {/* Window Title Header */}
                                                <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-3.5 sm:px-4 py-2 sm:py-2.5">
                                                    <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground/80 truncate">
                                                        <FileCode2
                                                            size={13}
                                                            className="text-primary shrink-0"
                                                        />
                                                        <span className="text-foreground/85 font-mono truncate">
                                                            {example.slug}.mr
                                                        </span>
                                                    </div>
                                                    <span className="font-mono text-[10px] text-muted-foreground/50 shrink-0 ml-2">
                                                        {
                                                            example.code.split(
                                                                "\n",
                                                            ).length
                                                        }{" "}
                                                        lines
                                                    </span>
                                                </div>

                                                {/* Code View with Horizontal Scroll Container */}
                                                <div className="w-full overflow-x-auto p-3.5 sm:p-4 text-xs leading-6 code-font">
                                                    <div className="flex min-w-fit">
                                                        {/* Line Numbers */}
                                                        <div className="w-8 sm:w-9 shrink-0 select-none pr-2.5 sm:pr-3 text-right text-muted-foreground/35 font-mono text-xs leading-6 border-r border-white/[0.06]">
                                                            {example.code
                                                                .split("\n")
                                                                .map((_, i) => (
                                                                    <div
                                                                        key={i}
                                                                    >
                                                                        {String(
                                                                            i +
                                                                                1,
                                                                        ).padStart(
                                                                            2,
                                                                            "0",
                                                                        )}
                                                                    </div>
                                                                ))}
                                                        </div>

                                                        {/* Code Body */}
                                                        <pre className="!m-0 pl-3 sm:pl-4 !bg-transparent text-xs leading-6 text-[#c5d1ee] font-mono whitespace-pre drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                                                            <HighlightedCode
                                                                code={
                                                                    example.code
                                                                }
                                                            />
                                                        </pre>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </main>
        </Shell>
    );
}

interface DocSectionItem {
    id: string;
    index: string;
    englishTitle: string;
    marathiTitle: string;
    token: string;
    subtitle: string;
    marathiSubtitle: string;
}

const docsSections: DocSectionItem[] = [
    {
        id: "what-is-mr",
        index: "01",
        englishTitle: "What is .mr?",
        marathiTitle: ".mr म्हणजे काय?",
        token: ".mr",
        subtitle: "A language with a point of view",
        marathiSubtitle: "मशीनला समजणारी मराठी",
    },
    {
        id: "first-program",
        index: "02",
        englishTitle: "Your first program",
        marathiTitle: "पहिला प्रोग्राम",
        token: "leeh",
        subtitle: "Speaking directly to stdout",
        marathiSubtitle: "पडद्यावर आउटपुट दाखवणे",
    },
    {
        id: "scalars-collections",
        index: "03",
        englishTitle: "Singular and plural bindings",
        marathiTitle: "एकवचन आणि अनेकवचन",
        token: "he & te",
        subtitle: "Scalars vs collections",
        marathiSubtitle: "एक मूल्य विरुद्ध संग्रह",
    },
    {
        id: "immutability-ahe",
        index: "04",
        englishTitle: "Truths that do not change",
        marathiTitle: "अपरिवर्तनीय मूल्ये",
        token: "ahe",
        subtitle: "Immutable constant bindings",
        marathiSubtitle: "स्थिर चलांची निर्मिती",
    },
    {
        id: "access-maze",
        index: "05",
        englishTitle: "Keeping things quiet",
        marathiTitle: "मर्यादित ॲक्सेस",
        token: "maze",
        subtitle: "Private, restricted scope",
        marathiSubtitle: "स्कोप मर्यादा आणि सुरक्षा",
    },
    {
        id: "size-modifiers",
        index: "06",
        englishTitle: "Scale and capacity",
        marathiTitle: "आकार आणि क्षमता",
        token: "lahan, maha, uch",
        subtitle: "Small, large, and ultra scaling",
        marathiSubtitle: "लहान, मोठे आणि अतिविशाल",
    },
    {
        id: "scope-sarve",
        index: "07",
        englishTitle: "A rule for the whole room",
        marathiTitle: "संपूर्ण स्कोपचा नियम",
        token: "sarve",
        subtitle: "Block-wide scope directives",
        marathiSubtitle: "ब्लॉकसाठी स्वतंत्र नियम",
    },
    {
        id: "type-ank",
        index: "08",
        englishTitle: "Signed integers",
        marathiTitle: "पूर्णांक संख्या",
        token: "ank",
        subtitle: "Whole numbers, positive or negative",
        marathiSubtitle: "धन आणि ऋण पूर्णांक",
    },
    {
        id: "type-akshar",
        index: "09",
        englishTitle: "Characters and words",
        marathiTitle: "अक्षर आणि शब्द",
        token: "akshar",
        subtitle: "Letters, phrases, and strings",
        marathiSubtitle: "वर्ण आणि मजकूर रचना",
    },
    {
        id: "type-bhagank",
        index: "10",
        englishTitle: "Fractions and precision",
        marathiTitle: "अपूर्णांक आणि दशांश",
        token: "bhagank",
        subtitle: "Floating-point numbers",
        marathiSubtitle: "दशांश अपूर्णांक मूल्ये",
    },
    {
        id: "type-purnank",
        index: "11",
        englishTitle: "Non-negative counting",
        marathiTitle: "ऋण नसलेली गणना",
        token: "purnank",
        subtitle: "Unsigned whole integers",
        marathiSubtitle: "केवळ धन पूर्णांक",
    },
    {
        id: "type-vidhan",
        index: "12",
        englishTitle: "Pure boolean truths",
        marathiTitle: "सत्य आणि असत्य",
        token: "vidhan",
        subtitle: "khare (true) and khote (false)",
        marathiSubtitle: "खरे किंवा खोटे तर्क",
    },
    {
        id: "type-nirank",
        index: "13",
        englishTitle: "Working without returning",
        marathiTitle: "शून्य रिटर्न प्रकार",
        token: "nirank",
        subtitle: "Void procedures and side effects",
        marathiSubtitle: "मूल्य परत न करणारी कार्ये",
    },
    {
        id: "operators-arithmetic",
        index: "14",
        englishTitle: "Arithmetic and changing state",
        marathiTitle: "अंकगणित आणि बदल",
        token: "+, -, *, /, %",
        subtitle: "Math and compound assignments",
        marathiSubtitle: "गणितीय संकारक व असाइनमेंट",
    },
    {
        id: "operators-relational",
        index: "15",
        englishTitle: "Asking questions of values",
        marathiTitle: "मूल्यांची तुलना आणि बिट्स",
        token: "==, !=, &, |",
        subtitle: "Relational checks and bitwise math",
        marathiSubtitle: "तुलना आणि बिट्सवरील प्रक्रिया",
    },
    {
        id: "words-ani-va",
        index: "16",
        englishTitle: "Words for logic",
        marathiTitle: "तार्किक जोडशब्द",
        token: "ani & va",
        subtitle: "Native logical AND & OR",
        marathiSubtitle: "मराठीतील AND आणि OR",
    },
    {
        id: "control-jar",
        index: "17",
        englishTitle: "Choosing a path",
        marathiTitle: "सशर्त मार्ग निवड",
        token: "jar",
        subtitle: "Primary if conditional",
        marathiSubtitle: "प्राथमिक अट तपासणी",
    },
    {
        id: "control-nahitar",
        index: "18",
        englishTitle: "Another possibility",
        marathiTitle: "पर्यायी अट",
        token: "nahitar",
        subtitle: "Mandatory condition else-if",
        marathiSubtitle: "कंसातील अनिवार्य पर्यायी अट",
    },
    {
        id: "control-anyatha",
        index: "19",
        englishTitle: "When nothing else matches",
        marathiTitle: "अंतिम पर्याय",
        token: "anyatha",
        subtitle: "Unconditional fallback else",
        marathiSubtitle: "बिनशर्त शेवटचा पर्याय",
    },
    {
        id: "loops-pratyek",
        index: "20",
        englishTitle: "Known iterations",
        marathiTitle: "ठरविक फेऱ्यांचे लूप",
        token: "pratyek",
        subtitle: "Traditional 3-part for loop",
        marathiSubtitle: "सुरूवात, अट आणि वाढ",
    },
    {
        id: "loops-jovar",
        index: "21",
        englishTitle: "Going as long as it holds",
        marathiTitle: "अट असेपर्यंत लूप",
        token: "jovar",
        subtitle: "Repeating while condition is khare",
        marathiSubtitle: "व्हाइल लूप पुनरावृत्ती",
    },
    {
        id: "jumps-thamba-pudhe",
        index: "22",
        englishTitle: "Breaking and stepping forward",
        marathiTitle: "थांबणे आणि पुढे जाणे",
        token: "thamba & pudhe",
        subtitle: "Loop break and continue",
        marathiSubtitle: "लूप थांबवणे व पुढची फेरी",
    },
    {
        id: "functions-karya",
        index: "23",
        englishTitle: "Giving ideas a name",
        marathiTitle: "कार्ये आणि परतावा",
        token: "karya & partav",
        subtitle: "Type-first functions and return",
        marathiSubtitle: "प्रकार आधी येणारी रचना",
    },
    {
        id: "exit-shevti",
        index: "24",
        englishTitle: "Leaving the machine",
        marathiTitle: "प्रक्रिया समाप्ती",
        token: "shevti",
        subtitle: "Explicit process exit status",
        marathiSubtitle: "थेट प्रोग्राम समाप्ती",
    },
    {
        id: "paryay-switch",
        index: "25",
        englishTitle: "Matching options",
        marathiTitle: "पर्यायांची निवड",
        token: "paryay",
        subtitle: "Multi-branch switch structure",
        marathiSubtitle: "केस मॅचिंग व anyatha: डीफॉल्ट",
    },
    {
        id: "planned-specs",
        index: "26",
        englishTitle: "On the horizon",
        marathiTitle: "नियोजित रचना",
        token: "rachna, varg, prakar",
        subtitle: "Upcoming structs, classes & enums",
        marathiSubtitle: "कम्पायलरच्या पुढच्या पायऱ्या",
    },
];

function DocsPage() {
    const [marathi, setMarathi] = useState(false);
    const [activeSection, setActiveSection] = useState("what-is-mr");

    // Scroll spy: tracks which chapter header is currently visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                rootMargin: "-12% 0px -75% 0px",
                threshold: 0,
            },
        );

        docsSections.forEach((s) => {
            const el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (
        e: React.MouseEvent<HTMLAnchorElement>,
        id: string,
    ) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const y =
                element.getBoundingClientRect().top + window.pageYOffset - 96;
            window.scrollTo({ top: y, behavior: "smooth" });
            setActiveSection(id);
        }
    };

    return (
        <Shell>
            <main className="mx-auto grid max-w-[1280px] min-w-0 w-full gap-8 px-4 sm:px-6 py-12 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-12 lg:px-8 lg:py-20">
                {/* Sticky Left Sidebar Navigation */}
                {/* Clean, Non-Glitched Sidebar */}
                <aside className="w-full min-w-0 lg:sticky lg:top-24 lg:h-[calc(100vh-7.5rem)] lg:flex lg:flex-col">
                    <div className="shrink-0 mb-4">
                        <SectionEyebrow>Docs / प्रलेखन</SectionEyebrow>
                        {/* Language Switcher */}
                        <div className="flex w-full rounded-lg border border-border bg-card p-1 shadow-sm">
                            <button
                                onClick={() => setMarathi(false)}
                                className={cx(
                                    "flex-1 rounded-md px-3 py-1.5 text-xs transition-colors",
                                    !marathi
                                        ? "bg-secondary text-foreground font-medium shadow-sm"
                                        : "text-muted-foreground hover:text-foreground",
                                )}
                                data-testid="button-docs-english"
                            >
                                English
                            </button>
                            <button
                                onClick={() => setMarathi(true)}
                                className={cx(
                                    "flex-1 rounded-md px-3 py-1.5 text-xs transition-colors",
                                    marathi
                                        ? "bg-secondary text-foreground font-medium shadow-sm"
                                        : "text-muted-foreground hover:text-foreground",
                                )}
                                data-testid="button-docs-marathi"
                            >
                                मराठी
                            </button>
                        </div>
                    </div>

                    {/* Desktop Sidebar with Native Isolation */}
                    <nav
                        className="hidden flex-1 overflow-y-auto pr-2 space-y-1 thin-scroll lg:block"
                        style={{ overscrollBehavior: "contain" }}
                    >
                        {docsSections.map((sec) => {
                            const isActive = activeSection === sec.id;
                            return (
                                <a
                                    key={sec.id}
                                    id={`nav-link-${sec.id}`}
                                    href={`#${sec.id}`}
                                    onClick={(e) => scrollToSection(e, sec.id)}
                                    className={cx(
                                        "group relative flex items-start gap-2.5 rounded-lg px-3 py-2 transition-all text-left",
                                        isActive
                                            ? "bg-primary/10 border border-primary/25 shadow-sm"
                                            : "hover:bg-secondary/60 border border-transparent",
                                    )}
                                    data-testid={`link-docs-${sec.id}`}
                                >
                                    {/* Number Tag */}
                                    <span
                                        className={cx(
                                            "mt-0.5 font-mono text-[10px] select-none",
                                            isActive
                                                ? "text-primary font-bold"
                                                : "text-muted-foreground/45 group-hover:text-muted-foreground",
                                        )}
                                    >
                                        {sec.index}
                                    </span>

                                    {/* Two-Line Title/Subtitle Hierarchy */}
                                    <div className="min-w-0 flex-1">
                                        <div
                                            className={cx(
                                                "font-mono text-xs font-semibold leading-4 truncate transition-colors",
                                                isActive
                                                    ? "text-primary"
                                                    : "text-foreground/90 group-hover:text-foreground",
                                            )}
                                        >
                                            {sec.token}
                                        </div>
                                        <div
                                            className={cx(
                                                "text-[10px] leading-tight truncate mt-0.5 transition-colors",
                                                isActive
                                                    ? "text-primary/75"
                                                    : "text-muted-foreground/70 group-hover:text-muted-foreground",
                                            )}
                                        >
                                            {marathi
                                                ? sec.marathiSubtitle
                                                : sec.subtitle}
                                        </div>
                                    </div>

                                    {/* Active Refraction Dot */}
                                    {isActive && (
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 self-center" />
                                    )}
                                </a>
                            );
                        })}
                    </nav>

                    {/* Mobile Horizontal Quick-Rail */}
                    <nav className="thin-scroll flex gap-2 overflow-x-auto pb-2 lg:hidden">
                        {docsSections.map((sec) => {
                            const isActive = activeSection === sec.id;
                            return (
                                <a
                                    key={sec.id}
                                    href={`#${sec.id}`}
                                    onClick={(e) => scrollToSection(e, sec.id)}
                                    className={cx(
                                        "shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors",
                                        isActive
                                            ? "border-primary/80 bg-primary/15 text-primary font-semibold"
                                            : "border-border/70 bg-card text-muted-foreground hover:text-foreground",
                                    )}
                                >
                                    {sec.token}
                                </a>
                            );
                        })}
                    </nav>
                </aside>

                {/* Article Content Column */}
                {/* Article Content Column */}
                <article className="min-w-0 w-full max-w-3xl overflow-hidden">
                    {/* Header Banner */}
                    <div className="mb-10 border-b border-border pb-8">
                        <div className="mb-3 flex items-center gap-2 font-mono text-xs text-primary">
                            <BookOpen size={14} /> language notes / master
                            specification
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-.065em] break-words">
                            {marathi
                                ? "मशीनला समजणारी मराठी."
                                : "A language with a point of view."}
                        </h1>
                        <p className="mt-4 max-w-xl text-base sm:text-lg leading-7 text-muted-foreground">
                            {marathi
                                ? ".mr भाषेचे अधिकृत नियम, टोकन्स, प्रत्येक डेटा प्रकार आणि Linux x86-64 NASM असेंब्लीपर्यंतचा सविस्तर अभ्यास."
                                : "The exhaustive specification for .mr — individual token grammar, primitive numeric representations, storage qualifiers, and native compilation."}
                        </p>
                    </div>

                    {/* 1. What is .mr? */}
                    <DocSection
                        id="what-is-mr"
                        index="01"
                        token=".mr"
                        englishTitle="What is .mr?"
                        marathiTitle=".mr म्हणजे काय?"
                    >
                        <p>
                            {marathi
                                ? ".mr ही एक मूळ, सिस्टीम-स्तरीय प्रोग्रामिंग भाषा आहे जी थेट Linux x86-64 मशीन कोडमध्ये compile होते. ती केवळ वरवरचे भाषांतर नाही. स्त्रोत कोड आंतरराष्ट्रीय कीबोर्डवर सहज लिहिता यावा म्हणून Roman-script Marathi मध्ये ठेवला आहे."
                                : ".mr is a serious native programming language compiled directly to Linux x86-64 NASM assembly. Its design goal is Marathi as an authentic programming language vocabulary with coherent grammar, structured syntax, and direct hardware mapping."}
                        </p>
                        <div className="my-5 grid grid-cols-1 sm:grid-cols-3 gap-3 min-w-0 w-full">
                            {[
                                [
                                    "Tokenizer / Lexer",
                                    marathi
                                        ? "शब्दांचे टोकन्स"
                                        : "source into tokens",
                                ],
                                [
                                    "Parser & AST",
                                    marathi
                                        ? "रचना आणि झाड"
                                        : "tokens into typed AST",
                                ],
                                [
                                    "NASM Codegen",
                                    marathi
                                        ? "थेट x86-64 कोड"
                                        : "AST into assembly",
                                ],
                            ].map(([title, copy]) => (
                                <div
                                    key={title}
                                    className="rounded-xl border border-border bg-card p-4 min-w-0"
                                >
                                    <span className="font-mono text-[10px] text-primary font-semibold">
                                        {title}
                                    </span>
                                    <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                                        {copy}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </DocSection>

                    {/* 2. Your first program */}
                    <DocSection
                        id="first-program"
                        index="02"
                        token="leeh"
                        englishTitle="Your first program"
                        marathiTitle="पहिला प्रोग्राम"
                    >
                        <p>
                            {marathi
                                ? "leeh हे .mr मधील आउटपुटसाठीचे मूलभूत विधान आहे. मजकूर, चल किंवा थेट गणिती मांडणी पडद्यावर दाखवण्यासाठी leeh वापरले जाते."
                                : "Start with the simplest interaction. `leeh` is the language's built-in output statement, accepting strings, variable bindings, or compound arithmetic expressions."}
                        </p>
                        <CodeBlock
                            example={{
                                slug: "types-and-variables",
                                title: "first_program.mr",
                                marathiTitle: "पहिला प्रोग्राम",
                                category: "Foundations",
                                description:
                                    "Hello world and basic output statement in .mr",
                                marathiDescription:
                                    "पहिला leeh आउटपुट प्रोग्राम",
                                code: `leeh("Namaskar, .mr!");\n\nhe ank year = 2026;\nleeh(year);`,
                                output: "Namaskar, .mr!\n2026",
                                status: "ready",
                            }}
                        />
                    </DocSection>

                    {/* 3. he & te */}
                    <DocSection
                        id="scalars-collections"
                        index="03"
                        token="he & te"
                        englishTitle="Singular and plural bindings"
                        marathiTitle="एकवचन आणि अनेकवचन"
                    >
                        <p>
                            {marathi
                                ? ".mr मध्ये चलांची घोषणा करताना मूल्याच्या स्वरूपावर आधारलेला मूलभूत फरक केला जातो. 'he' हा एका सुट्या मूल्यासाठी (Scalar) वापरला जातो, तर 'te' हा मूल्यांच्या संग्रहासाठी (Collection/Array) वापरला जातो. (te चा अर्थ immutable असा होत नाही)."
                                : ".mr differentiates storage multiplicity at declaration time. `he` denotes an individual scalar value, while `te` denotes an array or collection binding. Crucially, `te` does NOT mean constant or immutable."}
                        </p>
                        <CodeBlock example={getExample("array-declaration")} />
                    </DocSection>

                    {/* 4. ahe */}
                    <DocSection
                        id="immutability-ahe"
                        index="04"
                        token="ahe"
                        englishTitle="Truths that do not change"
                        marathiTitle="अपरिवर्तनीय मूल्ये"
                    >
                        <p>
                            {marathi
                                ? "'ahe' हा कीवर्ड अपरिवर्तनीय (constant / immutable) चलांसाठी वापरला जातो. एकदा मूल्य नियुक्त केल्यानंतर ते पुन्हा बदलता येत नाही. 'ahe' आणि 'te' मध्ये गल्लत करू नये."
                                : "`ahe` represents an immutable / constant declaration in .mr. Once assigned, its value cannot subsequently be overwritten or reassigned. Never confuse `ahe` with `te`."}
                        </p>
                        <CodeBlock
                            example={getExample("types-and-variables")}
                        />
                    </DocSection>

                    {/* 5. maze */}
                    <DocSection
                        id="access-maze"
                        index="05"
                        token="maze"
                        englishTitle="Keeping things quiet"
                        marathiTitle="मर्यादित ॲक्सेस"
                    >
                        <p>
                            {marathi
                                ? "'maze' हा प्रायव्हेट किंवा प्रतिबंधित स्कोपचा ॲक्सेस मॉडिफायर आहे. हा डेटा प्रकार नसून केवळ ॲक्सेस लेव्हल नियंत्रित करतो."
                                : "`maze` represents private / access-restricted scope modifier. It is an access modifier analogous to private visibility, never a data type."}
                        </p>
                        <CodeBlock
                            example={getExample("functions-and-arguments")}
                        />
                    </DocSection>

                    {/* 6. lahan, maha, uch */}
                    <DocSection
                        id="size-modifiers"
                        index="06"
                        token="lahan, maha, uch"
                        englishTitle="Scale and capacity"
                        marathiTitle="आकार आणि क्षमता"
                    >
                        <p>
                            {marathi
                                ? "डेटा प्रकाराच्या आकाराचे प्रमाण दर्शवण्यासाठी .mr मध्ये तीन स्वतंत्र मॉडिफायर्स आहेत: 'lahan' (लहान/small), 'maha' (मोठे/large), आणि 'uch' (अतिविशाल/ultra scale)."
                                : "The language provides dedicated scale modifiers to adjust the storage capacity of types: `lahan` (small), `maha` (large), and `uch` (ultra scale)."}
                        </p>
                        <CodeBlock example={getExample("type-sizes")} />
                    </DocSection>

                    {/* 7. sarve */}
                    <DocSection
                        id="scope-sarve"
                        index="07"
                        token="sarve"
                        englishTitle="A rule for the whole room"
                        marathiTitle="संपूर्ण स्कोपचा नियम"
                    >
                        <p>
                            {marathi
                                ? "'sarve' हा सामान्य चल मॉडिफायर नसून संपूर्ण स्कोपसाठीचा स्वतंत्र नियम आहे. तो ब्लॉकच्या वर लिहिला जातो आणि पुढील संपूर्ण ब्लॉकला लागू होतो. कंसात लिहू नये."
                                : "`sarve` is a standalone scope-level directive. It is written directly above a block without parentheses and applies uniformly across the entire following scope."}
                        </p>
                        <CodeBlock example={getExample("scope-size-levels")} />
                    </DocSection>

                    {/* 8. ank */}
                    <DocSection
                        id="type-ank"
                        index="08"
                        token="ank"
                        englishTitle="Signed integers"
                        marathiTitle="पूर्णांक संख्या"
                    >
                        <p>
                            {marathi
                                ? "'ank' हा .mr मधील मूलभूत स्वाक्षरीयुक्त पूर्णांक प्रकार (Signed Integer) आहे. तो धन व ऋण दोन्ही संख्या साठवू शकतो."
                                : "`ank` represents the standard signed integer numeric type in .mr, backed by machine registers for integer arithmetic."}
                        </p>
                        <CodeBlock
                            example={getExample("arithmetic-operators")}
                        />
                    </DocSection>

                    {/* 9. akshar */}
                    <DocSection
                        id="type-akshar"
                        index="09"
                        token="akshar"
                        englishTitle="Characters and words"
                        marathiTitle="अक्षर आणि शब्द"
                    >
                        <p>
                            {marathi
                                ? "'akshar' हा एकल वर्ण (Character) तसेच मजकूर (Text / String) साठवण्यासाठीचा मूलभूत डेटा प्रकार आहे."
                                : "`akshar` is the character and text-oriented type. It handles individual character literals ('A') as well as complete string literals (\"Anvay\")."}
                        </p>
                        <CodeBlock example={getExample("void-functions")} />
                    </DocSection>

                    {/* 10. bhagank */}
                    <DocSection
                        id="type-bhagank"
                        index="10"
                        token="bhagank"
                        englishTitle="Fractions and precision"
                        marathiTitle="अपूर्णांक आणि दशांश"
                    >
                        <p>
                            {marathi
                                ? "'bhagank' हा दशांश चिन्हांकित अपूर्णांक संख्यांसाठीचा (Floating-point) प्रकार आहे."
                                : "`bhagank` denotes the fractional / floating-point numeric type, designed for values with decimal components."}
                        </p>
                        <CodeBlock
                            example={getExample("conditional-statements")}
                        />
                    </DocSection>

                    {/* 11. purnank */}
                    <DocSection
                        id="type-purnank"
                        index="11"
                        token="purnank"
                        englishTitle="Non-negative counting"
                        marathiTitle="ऋण नसलेली गणना"
                    >
                        <p>
                            {marathi
                                ? "'purnank' हा केवळ ऋण नसलेल्या धन पूर्णांक संख्यांसाठी (Unsigned integer) वापरला जाणारा डेटा प्रकार आहे."
                                : "`purnank` represents the non-negative / unsigned whole-number integer type, intended for non-negative indices and memory measurements."}
                        </p>
                        <CodeBlock
                            example={getExample("types-and-variables")}
                        />
                    </DocSection>

                    {/* 12. vidhan */}
                    <DocSection
                        id="type-vidhan"
                        index="12"
                        token="vidhan"
                        englishTitle="Pure boolean truths"
                        marathiTitle="सत्य आणि असत्य"
                    >
                        <p>
                            {marathi
                                ? "'vidhan' हा बुलियन डेटा प्रकार आहे. या प्रकारामध्ये केवळ दोनच लिटरल्स वैध असतात: 'khare' (true) आणि 'khote' (false)."
                                : "`vidhan` is the boolean type. It accepts strictly two boolean literals: `khare` (true) and `khote` (false)."}
                        </p>
                        <CodeBlock example={getExample("logical-operators")} />
                    </DocSection>

                    {/* 13. nirank */}
                    <DocSection
                        id="type-nirank"
                        index="13"
                        token="nirank"
                        englishTitle="Working without returning"
                        marathiTitle="शून्य रिटर्न प्रकार"
                    >
                        <p>
                            {marathi
                                ? "'nirank' हा मूल्य नसलेला (Void) प्रकार आहे. ज्या कार्यांमधून (functions) कोणतेही मूल्य परत पाठवायचे नसते, तिथे nirank वापरला जातो."
                                : "`nirank` represents the void / no-return-value type. It is designated for functions that execute side effects without returning data to the caller."}
                        </p>
                        <CodeBlock example={getExample("void-functions")} />
                    </DocSection>

                    {/* 14. Arithmetic */}
                    <DocSection
                        id="operators-arithmetic"
                        index="14"
                        token="+,-,*,/,%"
                        englishTitle="Arithmetic and changing state"
                        marathiTitle="अंकगणित आणि बदल"
                    >
                        <p>
                            {marathi
                                ? "मूलभूत अंकगणिती संकारक (+, -, *, /, %) तसेच चक्रवाढ असाइनमेंट (+=, -=, *=, /=, %=) पूर्णपणे समर्थित आहेत."
                                : ".mr supports full mathematical operator precedence alongside standard compound assignments."}
                        </p>
                        <CodeBlock
                            example={getExample("arithmetic-operators")}
                        />
                    </DocSection>

                    {/* 15. Relational & Bitwise */}
                    <DocSection
                        id="operators-relational"
                        index="15"
                        token="==,!=,&,|"
                        englishTitle="Asking questions of values"
                        marathiTitle="मूल्यांची तुलना आणि बिट्स"
                    >
                        <p>
                            {marathi
                                ? "मूल्यांची तुलना करण्यासाठी (==, !=, <, >, <=, >=) आणि थेट बिट्सवर प्रक्रिया करण्यासाठी (&, |, ^, ~, <<, >>) ऑपरेटर्स उपलब्ध आहेत."
                                : "Comparison and low-level bitwise operations are distinct expressions inside the compiler pipeline."}
                        </p>
                        <CodeBlock
                            example={getExample("relational-operators")}
                        />
                        <div className="mt-4">
                            <CodeBlock
                                example={getExample("bitwise-operators")}
                            />
                        </div>
                    </DocSection>

                    {/* 16. ani & va */}
                    <DocSection
                        id="words-ani-va"
                        index="16"
                        token="ani & va"
                        englishTitle="Words for logic"
                        marathiTitle="तार्किक जोडशब्द"
                    >
                        <p>
                            {marathi
                                ? "तार्किक संबंधांसाठी .mr मध्ये इंग्रजी प्रतीकांऐवजी अस्सल मराठी शब्द वापरले जातात: 'ani' म्हणजे Logical AND, आणि 'va' म्हणजे Logical OR."
                                : "Boolean conjunction and disjunction use dedicated Marathi words: `ani` stands for logical AND (`&&`), and `va` stands for logical OR (`||`)."}
                        </p>
                        <CodeBlock example={getExample("logical-operators")} />
                    </DocSection>

                    {/* 17. jar */}
                    <DocSection
                        id="control-jar"
                        index="17"
                        token="jar"
                        englishTitle="Choosing a path"
                        marathiTitle="सशर्त मार्ग निवड"
                    >
                        <p>
                            {marathi
                                ? "'jar' म्हणजे 'if'. अट नेहमी कंसात असावी लागते. कंसाशिवाय jar लिहू नये."
                                : "`jar` defines the initial conditional branch (`if`). The condition must strictly reside inside parentheses."}
                        </p>
                        <CodeBlock
                            example={getExample("conditional-statements")}
                        />
                    </DocSection>

                    {/* 18. nahitar */}
                    <DocSection
                        id="control-nahitar"
                        index="18"
                        token="nahitar"
                        englishTitle="Another possibility"
                        marathiTitle="पर्यायी अट"
                    >
                        <p>
                            {marathi
                                ? "'nahitar' म्हणजे 'else if'. यासाठी अट असणे बंधनकारक आहे. हे अंतिम else नसून पर्यायी अट तपासणीसाठी आहे."
                                : "`nahitar` represents `else if`. It is NOT unconditional else; it MUST always take a parenthesized condition."}
                        </p>
                        <CodeBlock
                            example={getExample("conditional-statements")}
                        />
                    </DocSection>

                    {/* 19. anyatha */}
                    <DocSection
                        id="control-anyatha"
                        index="19"
                        token="anyatha"
                        englishTitle="When nothing else matches"
                        marathiTitle="अंतिम पर्याय"
                    >
                        <p>
                            {marathi
                                ? "'anyatha' म्हणजे बिनशर्त 'else'. याच्यासमोर कोणतीही अट किंवा कंस लिहू नयेत."
                                : "`anyatha` represents unconditional fallback (`else`). It NEVER takes a condition or parentheses."}
                        </p>
                        <CodeBlock
                            example={getExample("conditional-statements")}
                        />
                    </DocSection>

                    {/* 20. pratyek */}
                    <DocSection
                        id="loops-pratyek"
                        index="20"
                        token="pratyek"
                        englishTitle="Known iterations"
                        marathiTitle="ठरविक फेऱ्यांचे लूप"
                    >
                        <p>
                            {marathi
                                ? "'pratyek' हा पारंपारिक तीन-भागांचा फॉर लूप दर्शवतो: सुरूवात; अट; आणि वाढ किंवा घट."
                                : "`pratyek` defines the traditional 3-part loop: initialization, condition, and step increment/decrement."}
                        </p>
                        <CodeBlock example={getExample("for-loop")} />
                    </DocSection>

                    {/* 21. jovar */}
                    <DocSection
                        id="loops-jovar"
                        index="21"
                        token="jovar"
                        englishTitle="Going as long as it holds"
                        marathiTitle="अट असेपर्यंत लूप"
                    >
                        <p>
                            {marathi
                                ? "'jovar' हा व्हाइल लूप आहे. जोपर्यंत कंसामधील अट सत्य (khare) असते, तोपर्यंत हा लूप चालतो."
                                : "`jovar` defines a while loop that continues iterating as long as its condition evaluates to `khare`."}
                        </p>
                        <CodeBlock example={getExample("while-loop")} />
                    </DocSection>

                    {/* 22. thamba & pudhe */}
                    <DocSection
                        id="jumps-thamba-pudhe"
                        index="22"
                        token="thamba & pudhe"
                        englishTitle="Breaking and stepping forward"
                        marathiTitle="थांबणे आणि पुढे जाणे"
                    >
                        <p>
                            {marathi
                                ? "लूपमधून तात्काळ बाहेर पडण्यासाठी 'thamba' (break) आणि उर्वरित कोड वगळून पुढील फेरीत जाण्यासाठी 'pudhe' (continue) वापरतात."
                                : "Loop flow is intercepted using `thamba` (break early from loop) and `pudhe` (skip to next iteration)."}
                        </p>
                        <CodeBlock example={getExample("while-loop")} />
                    </DocSection>

                    {/* 23. karya & partav */}
                    <DocSection
                        id="functions-karya"
                        index="23"
                        token="karya & partav"
                        englishTitle="Giving ideas a name"
                        marathiTitle="कार्ये आणि परतावा"
                    >
                        <p>
                            {marathi
                                ? ".mr मध्ये फंक्शन तयार करताना return प्रकार नेहमी 'karya' शब्दाच्या आधी येतो. फंक्शनमधून मूल्य परत पाठवण्यासाठी 'partav' वापरतात."
                                : "In .mr, the return type is placed strictly BEFORE the `karya` declaration keyword. Return expressions use `partav`."}
                        </p>
                        <CodeBlock
                            example={getExample("functions-and-arguments")}
                        />
                    </DocSection>

                    {/* 24. shevti */}
                    <DocSection
                        id="exit-shevti"
                        index="24"
                        token="shevti"
                        englishTitle="Leaving the machine"
                        marathiTitle="प्रक्रिया समाप्ती"
                    >
                        <p>
                            {marathi
                                ? "'shevti' हा फंक्शनमधून परत येण्यासाठी नसून संपूर्ण प्रोग्राम व प्रक्रिया (Exit process) बंद करण्यासाठी वापरला जातो. partav आणि shevti वेगळे आहेत."
                                : "`shevti` explicitly terminates the executable process with an exit status. Never confuse `partav` (return from function) with `shevti` (program termination)."}
                        </p>
                        <CodeBlock example={getExample("exit-code")} />
                    </DocSection>

                    {/* 25. paryay */}
                    <DocSection
                        id="paryay-switch"
                        index="25"
                        token="paryay"
                        englishTitle="Matching options"
                        marathiTitle="पर्यायांची निवड"
                    >
                        <p>
                            {marathi
                                ? "मल्टी-केस मॅचिंगसाठी 'paryay' वापरले जाते. यामध्ये डीफॉल्ट पर्यायासाठी 'anyatha:' हे लेबल वापरले जाते."
                                : "`paryay` provides multi-case matching where `anyatha:` serves as the fallback default label."}
                        </p>
                        <CodeBlock example={getExample("switch-statement")} />
                    </DocSection>

                    {/* 26. Planned Specifications */}
                    <DocSection
                        id="planned-specs"
                        index="26"
                        token="rachna, varg, prakar"
                        englishTitle="On the horizon"
                        marathiTitle="नियोजित रचना"
                    >
                        <p>
                            {marathi
                                ? "खालील कीवर्ड्स .mr भाषेच्या व्याकरण शब्दकोशात राखीव आहेत आणि आगामी आवृत्तीत उपलब्ध केले जातील:"
                                : "The following structures are formally reserved in the language grammar and scheduled for implementation:"}
                        </p>
                        <div className="mt-4 space-y-4">
                            <div>
                                <h4 className="font-mono text-xs text-primary font-bold mb-1">
                                    rachna (Structures)
                                </h4>
                                <CodeBlock
                                    example={getExample("struct-rachna")}
                                />
                            </div>
                            <div>
                                <h4 className="font-mono text-xs text-primary font-bold mb-1">
                                    varg (Classes)
                                </h4>
                                <CodeBlock example={getExample("class-varg")} />
                            </div>
                            <div>
                                <h4 className="font-mono text-xs text-primary font-bold mb-1">
                                    prakar (Enumerations)
                                </h4>
                                <CodeBlock
                                    example={getExample("enum-prakar")}
                                />
                            </div>
                            <div>
                                <h4 className="font-mono text-xs text-primary font-bold mb-1">
                                    Pointers
                                </h4>
                                <CodeBlock example={getExample("pointers")} />
                            </div>
                        </div>
                    </DocSection>
                </article>
            </main>
        </Shell>
    );
}

function DocSection({
    id,
    index,
    englishTitle,
    marathiTitle,
    token,
    children,
}: {
    id: string;
    index: string;
    englishTitle: string;
    marathiTitle: string;
    token: string;
    children: ReactNode;
}) {
    return (
        <section
            id={id}
            className="scroll-mt-24 border-b border-border/80 py-10 sm:py-12 first:pt-0 last:border-0 min-w-0 w-full overflow-hidden"
        >
            {/* Metadata Pill */}
            <div className="mb-3 flex items-center gap-2">
                <span className="font-mono text-[11px] font-semibold text-primary">
                    {index}
                </span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span className="rounded border border-primary/25 bg-primary/5 px-2 py-0.5 font-mono text-[11px] font-medium text-primary">
                    {token}
                </span>
            </div>

            {/* Bilingual Header */}
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-.04em] text-foreground flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span>{englishTitle}</span>
                <span className="text-muted-foreground/40 font-light select-none">
                    /
                </span>
                <span className="marathi-font text-xl sm:text-2xl font-semibold text-muted-foreground">
                    {marathiTitle}
                </span>
            </h2>

            {/* Content Body */}
            <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground min-w-0 w-full">
                {children}
            </div>
        </section>
    );
}

function AboutPage() {
    return (
        <Shell>
            <main className="mx-auto max-w-[1240px] px-5 py-16 lg:px-8 lg:py-24">
                <div className="grid gap-16 lg:grid-cols-[.75fr_1.25fr]">
                    <div className="animate-rise-in">
                        <SectionEyebrow>About / आमच्याबद्दल</SectionEyebrow>
                        <h1 className="text-5xl font-semibold leading-[.95] tracking-[-.07em] sm:text-7xl">
                            A language
                            <br />
                            <span className="text-primary">with a home.</span>
                        </h1>
                        <p className="mt-7 max-w-sm text-lg leading-8 text-muted-foreground">
                            .mr is an invitation: bring Marathi closer to the
                            computer, one careful layer at a time.
                        </p>
                    </div>
                    <div className="border-l border-primary/40 pl-7 lg:mt-16 lg:pl-10">
                        <p className="font-devanagari text-xl leading-7 text-foreground/80 text-primary">
                            मराठी, संगणकासाठी.
                        </p>
                        <p className="mt-4 max-w-lg text-2xl leading-9 tracking-[-.02em]">
                            “A language is not only a tool for saying what we
                            know. It is a way of making new things thinkable.”
                        </p>
                    </div>
                </div>
                <section className="mt-24 grid gap-8 border-t border-border pt-10 lg:grid-cols-[.7fr_1.3fr]">
                    <div>
                        <SectionEyebrow>The project</SectionEyebrow>
                        <h2 className="text-3xl font-medium tracking-[-.05em]">
                            Marathi, Understood by Machines
                        </h2>
                    </div>
                    <div className="grid gap-5 text-sm leading-7 text-muted-foreground md:grid-cols-2">
                        <p>
                            Featured project .mr is built from scratch in C++20
                            with a custom lexer, parser, AST, semantic analysis,
                            native code generation, x86-64 assembly, and
                            testing.
                        </p>
                        <p>
                            It is a language project made by someone who cares
                            about computers, language, and craft — and wants
                            curious programmers to see Marathi become a language
                            for machines.
                        </p>
                    </div>
                </section>
                <section className="mt-20 grid gap-8 border-t border-border pt-10 lg:grid-cols-[.82fr_1.18fr]">
                    <div>
                        <SectionEyebrow>The maker</SectionEyebrow>
                        <h2 className="text-3xl font-medium tracking-[-.05em]">
                            Anvay Mayekar
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            Electronics and computer science student.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2">
                            <a
                                href="https://anvaymayekar.vercel.app/"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground"
                                data-testid="link-anvay-portfolio"
                            >
                                Portfolio <ExternalLink size={12} />
                            </a>
                            <a
                                href="https://github.com/anvaymayekar"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground"
                                data-testid="link-anvay-github"
                            >
                                <Github size={13} /> GitHub{" "}
                                <ExternalLink size={12} />
                            </a>
                        </div>
                    </div>
                    <div className="space-y-7">
                        <p className="max-w-2xl text-lg leading-8 text-foreground/90">
                            Anvay Mayekar is an electronics and computer science
                            student who likes understanding things from the
                            inside out. His work moves naturally between
                            programming, systems, compilers, robotics,
                            electronics, and mathematics — from building things,
                            to understanding the systems beneath them, to
                            building the systems themselves.
                        </p>
                        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                            His portfolio follows that same curiosity: .mr is a
                            Marathi programming language built from scratch;
                            Project SIRA explores a six-legged robotic
                            architecture; ASCII Cam, an AVL Tree Visualizer, and
                            a UR5 simulation turn ideas into working
                            experiments. This is not a résumé in disguise. It is
                            a record of questions pursued carefully.
                        </p>
                        <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
                            <div className="flex items-center justify-between border-b border-border pb-5">
                                <span className="font-mono text-xs text-primary">
                                    student / 2024—2028
                                </span>
                                <span className="rounded-full bg-primary/10 px-2 py-1 font-mono text-[10px] text-primary">
                                    9.0 CGPA
                                </span>
                            </div>
                            <dl className="grid gap-5 pt-6 sm:grid-cols-2">
                                <div>
                                    <dt className="text-xs text-muted-foreground">
                                        Institution
                                    </dt>
                                    <dd className="mt-1 text-sm">
                                        Shah &amp; Anchor Kutchhi Engineering
                                        College
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-muted-foreground">
                                        Degree
                                    </dt>
                                    <dd className="mt-1 text-sm">
                                        B.Tech Electronics &amp; Computer
                                        Science
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-muted-foreground">
                                        Minor
                                    </dt>
                                    <dd className="mt-1 text-sm">
                                        Robotics and Drone Technology
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-muted-foreground">
                                        Featured project
                                    </dt>
                                    <dd className="mt-1 text-sm">
                                        .mr — Marathi, Understood by Machines
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </section>
                <section className="mt-20 border-t border-border pt-10">
                    <SectionEyebrow>Other projects</SectionEyebrow>
                    <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
                        {[
                            [
                                "Project SIRA",
                                "Hexapod, six legs, 18 DOF, 3D-printed structure, locomotion, robotics, AICTE IDEA Lab / SAKEC.",
                            ],
                            ["ASCII Cam", ""],
                            ["AVL Tree Visualizer", ""],
                            ["UR5 Simulation", ""],
                        ].map(([name, copy], i) => (
                            <div key={name} className="bg-card p-6">
                                <span className="font-mono text-[10px] text-primary">
                                    0{i + 1}
                                </span>
                                <h3 className="mt-5 font-medium">{name}</h3>
                                {copy && (
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        {copy}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </Shell>
    );
}

type CompileState = "idle" | "running" | "success" | "error" | "unavailable";

function Playground() {
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
    const lineNumbersRef = useRef<HTMLDivElement>(null);
    const idleTimerRef = useRef<number | null>(null);
    const hoverDebounceRef = useRef<number | null>(null);

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
            const response = await fetch("/api/compile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok)
                throw new Error(
                    payload?.message ||
                        `Compiler responded with ${response.status}`,
                );
            const result =
                payload?.output ?? payload?.stdout ?? payload?.result ?? "";
            setOutput(
                typeof result === "string"
                    ? result
                    : JSON.stringify(result, null, 2),
            );
            setExitCode(
                typeof payload?.exitCode === "number" ? payload.exitCode : 0,
            );
            setCompileState("success");
        } catch (error) {
            setExitCode(1);
            setCompileState(
                error instanceof TypeError ? "unavailable" : "error",
            );
            setOutput(
                error instanceof TypeError
                    ? "Compiler unavailable — /api/compile could not be reached."
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
                <div className="relative flex items-center gap-2">
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
                                className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre px-5 pb-16 pt-14 text-[#c5d1ee] m-0 border-0"
                                style={{
                                    fontSize: `${fontSize}px`,
                                    fontFamily: MONO_FONT,
                                    tabSize: 4,
                                    letterSpacing: "0px",
                                    fontVariantLigatures: "none",
                                    WebkitTextSizeAdjust: "100%",
                                    boxSizing: "border-box",
                                }}
                            >
                                {code.split("\n").map((line, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            height: `${LINE_HEIGHT}px`,
                                            lineHeight: `${LINE_HEIGHT}px`,
                                            overflow: "hidden",
                                        }}
                                    >
                                        <HighlightedCode code={line || " "} />
                                    </div>
                                ))}
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

function NotFound() {
    return (
        <Shell>
            <main className="mx-auto flex min-h-[65vh] max-w-[1240px] flex-col justify-center px-5 lg:px-8">
                <p className="font-mono text-sm text-primary">
                    404 / सापडले नाही
                </p>
                <h1 className="mt-5 text-6xl font-semibold tracking-[-.07em]">
                    Wrong branch.
                </h1>
                <p className="mt-4 text-muted-foreground">
                    This page does not exist in the current tree.
                </p>
                <Link
                    href="/"
                    className="mt-8 flex w-fit items-center gap-2 text-sm text-primary hover:gap-3"
                    data-testid="link-not-found-home"
                >
                    <ArrowLeft size={15} /> Return home
                </Link>
            </main>
        </Shell>
    );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
    const [location] = useLocation();
    return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
    return (
        <RoutedErrorBoundary>
            <Switch>
                <Route path="/" component={Home} />
                <Route path="/examples" component={ExamplesPage} />
                <Route path="/docs" component={DocsPage} />
                <Route path="/about" component={AboutPage} />
                <Route path="/playground" component={Playground} />
                <Route component={NotFound} />
            </Switch>
        </RoutedErrorBoundary>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <WouterRouter
                    base={import.meta.env.BASE_URL.replace(/\/$/, "")}
                >
                    <Router />
                </WouterRouter>
                <Toaster />
            </TooltipProvider>
        </QueryClientProvider>
    );
}

export default App;
