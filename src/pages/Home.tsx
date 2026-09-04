import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
    ArrowRight,
    ArrowUpRight,
    BookOpen,
    Braces,
    CircleDashed,
    Cpu,
    Languages,
    Zap,
} from "lucide-react";
import { examples, getExample } from "@/examples/registry";
import { HighlightedCode } from "@/editor/syntax";
import { cx } from "@/lib/format";
import { Shell } from "@/components/layout/Shell";
import { SectionEyebrow } from "@/components/shared/SectionEyebrow";
import { PlaygroundAnchor } from "@/components/shared/PlaygroundAnchor";
import { CodeBlock } from "@/components/shared/CodeBlock";

export default function Home() {
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

