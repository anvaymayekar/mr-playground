import {
    useEffect,
    useMemo,
    useRef,
    useState,
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
    return (
        <span
            className="inline-flex items-center gap-2"
            data-testid="brand-mark"
        >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-mono text-lg font-bold text-primary-foreground shadow-[0_0_0_4px_hsl(var(--primary)/.1)]">
                m
            </span>
            <span className="font-mono text-[17px] font-semibold tracking-[-.06em]">
                .mr
            </span>
        </span>
    );
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
        <p className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.18em] text-primary">
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
    const lines = example.code.split("\n");
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
                    <FileCode2 size={13} className="text-primary" />{" "}
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

            {/* Code and gutter */}
            <div
                className={cx(
                    "grid grid-cols-[32px_1fr] overflow-x-auto p-4 leading-6 code-font",
                    compact ? "max-h-[180px]" : "max-h-[280px]",
                )}
            >
                <div className="select-none pr-3 text-right text-muted-foreground/30 font-mono text-[11px]">
                    {lines.map((_, i) => (
                        <div key={i}>{String(i + 1).padStart(2, "0")}</div>
                    ))}
                </div>
                <pre className="text-[#c5d1ee] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                    <HighlightedCode code={example.code} />
                </pre>
            </div>
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
                            <h1 className="max-w-[700px] text-[clamp(3.1rem,7vw,6.9rem)] font-semibold leading-[.9] tracking-[-.075em] text-foreground">
                                Marathi,
                                <br />
                                <span className="text-primary">
                                    understood by machines.
                                </span>
                            </h1>
                            <p className="hero-marathi marathi-font mt-6 text-lg font-medium text-foreground/90 sm:text-xl">
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
            <main className="mx-auto max-w-[1240px] px-5 py-16 lg:px-8 lg:py-24">
                <div className="max-w-2xl animate-rise-in">
                    <SectionEyebrow>Examples / उदाहरणे</SectionEyebrow>
                    <h1 className="text-5xl font-semibold tracking-[-.065em] sm:text-6xl">
                        Learn by making
                        <br />
                        <span className="text-primary">
                            the machine answer.
                        </span>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        A small library of programs that show how .mr thinks.
                        Every ready example opens directly in the playground.
                    </p>
                </div>

                <div className="mt-12 flex flex-col gap-4 border-y border-border py-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative max-w-md flex-1">
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
                    <div className="thin-scroll flex gap-1.5 overflow-x-auto pb-1">
                        {categories.map((item) => (
                            <button
                                key={item}
                                onClick={() => setCategory(item)}
                                className={cx(
                                    "whitespace-nowrap rounded-lg px-3 py-2 text-xs font-mono transition-colors",
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

                <div className="mb-6 mt-8 flex items-center justify-between">
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
                    <div className="grid gap-6 md:grid-cols-2">
                        {filtered.map((example, index) => (
                            <article
                                key={example.slug}
                                className={cx(
                                    "group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-lg",
                                    `animate-rise-in-delay-${Math.min((index % 4) + 1, 3)}`,
                                )}
                                data-testid={`card-example-${example.slug}`}
                            >
                                <div>
                                    <div className="flex items-center justify-between border-b border-border/50 pb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="rounded-md bg-secondary px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
                                                {example.category}
                                            </span>
                                            {example.status === "planned" ? (
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
                                        <span className="font-mono text-[11px] text-muted-foreground/40">
                                            #
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                    </div>

                                    <div className="mt-4">
                                        <h2 className="text-xl font-semibold tracking-[-.03em] text-foreground group-hover:text-primary transition-colors">
                                            {example.title}
                                        </h2>
                                        <p className="mt-0.5 font-mono text-sm text-primary/80">
                                            {example.marathiTitle}
                                        </p>
                                        <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
                                            {example.description}{" "}
                                            <span className="text-foreground/40 font-serif">
                                                {example.marathiDescription}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <CodeBlock example={example} compact />
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </Shell>
    );
}

const docsSections = [
    { id: "what-is-mr", title: "What is .mr?", marathi: " .mr म्हणजे काय?" },
    {
        id: "first-program",
        title: "Your first program",
        marathi: "पहिला प्रोग्राम",
    },
    { id: "values", title: "Values & types", marathi: "मूल्ये आणि प्रकार" },
    { id: "control-flow", title: "Control flow", marathi: "नियंत्रण प्रवाह" },
    { id: "functions", title: "Functions", marathi: "कार्ये" },
    {
        id: "compiler",
        title: "The compiler path",
        marathi: "Compiler चा प्रवास",
    },
];

function DocsPage() {
    const [marathi, setMarathi] = useState(false);
    const first = getExample("types-and-variables");
    return (
        <Shell>
            <main className="mx-auto grid max-w-[1240px] gap-12 px-5 py-14 lg:grid-cols-[230px_1fr] lg:px-8 lg:py-20">
                <aside className="lg:sticky lg:top-28 lg:h-fit">
                    <SectionEyebrow>Docs / दस्तऐवज</SectionEyebrow>
                    <div className="mb-6 flex rounded-lg border border-border bg-card p-1">
                        <button
                            onClick={() => setMarathi(false)}
                            className={cx(
                                "flex-1 rounded-md px-3 py-2 text-xs",
                                !marathi
                                    ? "bg-secondary text-foreground"
                                    : "text-muted-foreground",
                            )}
                            data-testid="button-docs-english"
                        >
                            English
                        </button>
                        <button
                            onClick={() => setMarathi(true)}
                            className={cx(
                                "flex-1 rounded-md px-3 py-2 text-xs",
                                !marathi
                                    ? "text-muted-foreground"
                                    : "bg-secondary text-foreground",
                            )}
                            data-testid="button-docs-marathi"
                        >
                            मराठी
                        </button>
                    </div>
                    <nav className="hidden space-y-1 lg:block">
                        {docsSections.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                                data-testid={`link-docs-${section.id}`}
                            >
                                {marathi ? section.marathi : section.title}
                            </a>
                        ))}
                    </nav>
                </aside>
                <article className="max-w-3xl">
                    <div className="mb-12 border-b border-border pb-10">
                        <div className="mb-4 flex items-center gap-2 font-mono text-xs text-primary">
                            <BookOpen size={14} /> language notes / 01
                        </div>
                        <h1 className="text-5xl font-semibold tracking-[-.065em]">
                            {marathi
                                ? "मशीनला समजणारी मराठी."
                                : "A language with a point of view."}
                        </h1>
                        <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
                            {marathi
                                ? "हे दस्तऐवज .mr च्या मूलभूत कल्पना, रचना आणि compiler पर्यंतचा प्रवास समजावतात."
                                : "These notes introduce the shape of .mr, from the first binding to the compiler path beneath it."}
                        </p>
                    </div>
                    <DocSection
                        id="what-is-mr"
                        title={marathi ? " .mr म्हणजे काय?" : "What is .mr?"}
                    >
                        <p>
                            {marathi
                                ? ".mr ही Marathi programming language आहे जी native machine code मध्ये compile होते. Source code Roman-script Marathi मध्ये राहतो, जेणेकरून तो लिहिणे आणि वाचणे दोन्ही सहज वाटेल."
                                : ".mr is a Marathi programming language that compiles to native machine code. Its source stays in Roman-script Marathi: approachable to read, but never abstracted away from the machine."}
                        </p>
                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            {[
                                ["Lexer", "words into tokens"],
                                ["Parser", "tokens into structure"],
                                ["Codegen", "structure into x86-64"],
                            ].map(([title, copy]) => (
                                <div
                                    key={title}
                                    className="rounded-xl border border-border bg-card p-4"
                                >
                                    <span className="font-mono text-[10px] text-primary">
                                        {title}
                                    </span>
                                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                        {copy}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </DocSection>
                    <DocSection
                        id="first-program"
                        title={
                            marathi ? "पहिला प्रोग्राम" : "Your first program"
                        }
                    >
                        <p>
                            {marathi
                                ? "leeh हे .mr मधील output साठीचे मूलभूत विधान आहे."
                                : "Start with the smallest useful conversation. `leeh` is the output statement in .mr."}
                        </p>
                        <CodeBlock example={first} />
                        <p className="mt-4 text-sm text-muted-foreground">
                            {marathi
                                ? "उदाहरण बदलून लगेच चालवून पाहा."
                                : "Change the example and run it in a new playground tab."}{" "}
                            <PlaygroundAnchor
                                slug={first.slug}
                                className="text-primary hover:underline"
                                data-testid="link-docs-run-first"
                            >
                                Open in Playground{" "}
                                <ArrowUpRight size={12} className="inline" />
                            </PlaygroundAnchor>
                        </p>
                    </DocSection>
                    <DocSection
                        id="values"
                        title={marathi ? "मूल्ये आणि प्रकार" : "Values & types"}
                    >
                        <p>
                            {marathi
                                ? "चलांना मूल्ये द्या आणि compiler ला त्यांचा अर्थ तपासू द्या."
                                : "Bind values, let the compiler check their meaning, and keep the source close to the problem."}
                        </p>
                        <CodeBlock
                            example={getExample("arithmetic-operators")}
                        />
                    </DocSection>
                    <DocSection
                        id="control-flow"
                        title={marathi ? "नियंत्रण प्रवाह" : "Control flow"}
                    >
                        <p>
                            {marathi
                                ? "jar, nahitar, pratyek आणि jovar या शब्दांनी program चा प्रवाह लिहा."
                                : "Use `jar`, `nahitar`, `pratyek`, and `jovar` to describe the flow of a program."}
                        </p>
                        <CodeBlock example={getExample("for-loop")} />
                    </DocSection>
                    <DocSection
                        id="functions"
                        title={marathi ? "कार्ये" : "Functions"}
                    >
                        <p>
                            {marathi
                                ? "कार्ये पुन्हा वापरता येणाऱ्या कल्पनांना नाव देतात. Return value नसलेले function देखील उपयुक्त असते."
                                : "Functions give reusable ideas a name. A function without a return value is useful too."}
                        </p>
                        <CodeBlock example={getExample("void-functions")} />
                    </DocSection>
                    <DocSection
                        id="compiler"
                        title={
                            marathi ? "Compiler चा प्रवास" : "The compiler path"
                        }
                    >
                        <p>
                            {marathi
                                ? ".mr चा compiler custom lexer, parser, AST, semantic analysis आणि native code generation या थरांतून काम करतो."
                                : "The compiler is built from scratch in C++20: a custom lexer, parser, AST, semantic analysis, native code generation, x86-64 assembly, and testing."}
                        </p>
                        <div className="mt-6 rounded-xl border border-primary/25 bg-primary/5 p-5">
                            <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                <Info size={15} />A note on the edge
                            </div>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                Switch Statement is planned and intentionally
                                not executable in the examples library yet.
                            </p>
                        </div>
                    </DocSection>
                </article>
            </main>
        </Shell>
    );
}

function DocSection({
    id,
    title,
    children,
}: {
    id: string;
    title: string;
    children: ReactNode;
}) {
    return (
        <section
            id={id}
            className="scroll-mt-28 border-b border-border py-10 first:pt-0 last:border-0"
        >
            <h2 className="mb-5 text-2xl font-medium tracking-[-.04em]">
                {title}
            </h2>
            <div className="prose prose-invert prose-sm max-w-none prose-p:leading-7 prose-p:text-muted-foreground prose-code:font-mono prose-code:text-primary">
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
                        <p className="font-mono text-sm leading-7 text-foreground/80">
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
    const [mobileTab, setMobileTab] = useState<"code" | "output">("code");
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

    const computeMenuCoordinates = (
        textarea: HTMLTextAreaElement,
        pos: number,
    ) => {
        const textBefore = textarea.value.slice(0, pos);
        const lines = textBefore.split("\n");
        const lineIdx = lines.length - 1;
        const colIdx = lines[lineIdx].length;

        const lineHeight = 28;
        const charWidth = fontSize * 0.6;
        const rect = textarea.getBoundingClientRect();

        const topOffset = lineIdx * lineHeight - textarea.scrollTop + 20;
        const leftOffset = colIdx * charWidth - textarea.scrollLeft + 20;

        const showAbove = topOffset + 180 > rect.height;
        return {
            top: showAbove
                ? Math.max(8, topOffset - 175)
                : topOffset + lineHeight,
            left: Math.min(Math.max(12, leftOffset), rect.width - 240),
            showAbove,
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
        const offsetY = e.clientY - rect.top - 20 + ta.scrollTop;

        const lineHeight = 28;
        const charWidth = fontSize * 0.6;

        const lineIndex = Math.floor(offsetY / lineHeight);
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
            setMobileTab("output");
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
            setMobileTab("output");
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

            <div className="flex shrink-0 items-center justify-between border-b border-border bg-card px-3 py-2 md:hidden">
                <div className="flex rounded-md bg-secondary p-0.5">
                    <button
                        onClick={() => setMobileTab("code")}
                        className={cx(
                            "rounded px-3 py-1.5 text-xs",
                            mobileTab === "code" &&
                                "bg-sidebar text-foreground",
                        )}
                        data-testid="button-mobile-code"
                    >
                        Code
                    </button>
                    <button
                        onClick={() => setMobileTab("output")}
                        className={cx(
                            "rounded px-3 py-1.5 text-xs",
                            mobileTab === "output" &&
                                "bg-sidebar text-foreground",
                        )}
                        data-testid="button-mobile-output"
                    >
                        Output
                    </button>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                    Ctrl + Enter to run
                </span>
            </div>

            <main className="flex min-h-0 flex-1 overflow-hidden md:flex-row">
                {/* Code Editor Column */}
                <section
                    className={cx(
                        "code flex h-full min-h-0 min-w-0 flex-col overflow-hidden",
                        mobileTab === "output" && "hidden md:flex",
                    )}
                    style={{ flexBasis: `${split}%` }}
                >
                    {/* Control Toolbar */}
                    <div className="flex h-11 shrink-0 items-center justify-between border-b border-border/60 px-4 glass">
                        <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                            <span className="h-2 w-2 rounded-full bg-accent" />
                            {selected?.title ?? "untitled.mr"}
                        </div>
                        <div className="flex items-center gap-1">
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
                    {/* Unboxed Full-Bleed Editor Surface */}
                    <div className="relative flex min-h-0 flex-1 overflow-hidden">
                        {/* Intelligent Completion Menu */}
                        {completionOpen && activeSuggestions.length > 0 && (
                            <div
                                className="absolute z-30 w-52 overflow-hidden rounded-lg frost"
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

                        {/* Line Numbers Gutter */}
                        <div
                            ref={lineNumbersRef}
                            className="thin-scroll w-11 shrink-0 select-none overflow-hidden border-r border-border/60 pb-12 pt-5 text-right font-mono text-xs leading-7 text-muted-foreground/35"
                        >
                            {code.split("\n").map((_, i) => (
                                <div key={i} className="pr-3">
                                    {String(i + 1).padStart(2, "0")}
                                </div>
                            ))}
                        </div>

                        {/* Code Layer */}
                        <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
                            <pre
                                ref={preRef}
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre px-5 pb-12 pt-5 font-mono leading-7 text-[#c5d1ee]"
                                style={{ fontSize }}
                            >
                                <HighlightedCode code={code} />
                            </pre>
                            <textarea
                                ref={editorRef}
                                value={code}
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
                                spellCheck={false}
                                style={{
                                    fontSize,
                                    caretColor: "hsl(var(--primary))",
                                }}
                                className="editor-scroll relative h-full w-full resize-none overflow-auto bg-transparent px-5 pb-12 pt-5 font-mono leading-7 text-transparent selection:bg-primary/25 outline-none placeholder:text-muted-foreground/40"
                                placeholder="Start with an .mr thought…"
                                data-testid="textarea-code-editor"
                                aria-label="Code editor"
                            />
                        </div>
                    </div>
                </section>

                {/* Divider Handle */}
                <div
                    className="group relative hidden w-2 shrink-0 cursor-col-resize items-center justify-center bg-border/40 hover:bg-primary/50 md:flex"
                    onPointerDown={() => {
                        dragging.current = true;
                    }}
                    role="separator"
                    aria-label="Drag editor output divider"
                    data-testid="divider-editor-output"
                >
                    <span className="h-9 w-0.5 rounded bg-muted-foreground/40 group-hover:bg-primary" />
                </div>

                {/* Output Console Column */}
                <section
                    className={cx(
                        "code flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
                        mobileTab === "code" && "hidden md:flex",
                    )}
                >
                    <div className="flex h-11 shrink-0 items-center justify-between border-b border-border/60 px-4 glass">
                        <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                            <Terminal size={14} className="text-primary" />{" "}
                            output
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setWrap((value) => !value)}
                                className={cx(
                                    "rounded px-2 py-1 font-mono text-[10px]",
                                    wrap
                                        ? "bg-secondary text-foreground"
                                        : "text-muted-foreground hover:bg-secondary",
                                )}
                                data-testid="button-toggle-wrap"
                            >
                                wrap
                            </button>
                            <span className="font-mono text-[10px] bg-none mr-1 ml-3">
                                {compileState === "success" ? (
                                    <span className="flex items-center gap-1 text-[#9ed6c5]">
                                        <CircleCheck size={12} /> exited cleanly
                                    </span>
                                ) : compileState === "unavailable" ? (
                                    <span className="flex items-center gap-1 text-primary">
                                        <CircleAlert size={12} /> no compiler
                                        connection
                                    </span>
                                ) : (
                                    "ready"
                                )}
                            </span>
                            <button
                                onClick={() => setOutput("")}
                                className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                                aria-label="Clear output"
                                data-testid="button-clear-output"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                    <div
                        className={cx(
                            "editor-scroll min-h-0 flex-1 overflow-auto p-5 pb-12 font-mono text-sm leading-7",
                            wrap
                                ? "whitespace-pre-wrap break-words"
                                : "whitespace-pre",
                        )}
                        data-testid="output-terminal"
                    >
                        {compileState === "idle" && !output ? (
                            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                                <PanelBottom
                                    size={24}
                                    className="mb-4 text-primary/70"
                                />
                                <p className="text-sm">
                                    Run your program to see its output.
                                </p>
                                <p className="mt-1 text-xs">
                                    The terminal never guesses.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-3 flex items-center gap-2 text-[10px] text-muted-foreground">
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

            {/* Floating Frost Glass Status Bar with Background Pass-Through */}
            <footer
                className="workspace-status fixed bottom-0 left-0 right-0 z-30 flex h-7 shrink-0 items-center justify-between border-t px-8 font-mono text-[10px] text-muted-foreground sm:px-5 frost backdrop-blur-md"
                aria-label="Compiler status"
            >
                <div className="flex items-center gap-4">
                    <span
                        className={cx(
                            "flex items-center gap-2",
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
                                  ? "Compiler unavailable"
                                  : "Ready"}
                    </span>
                    <span>Code {exitCode ?? ""}</span>
                </div>
                <div className="flex items-center gap-4">
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
