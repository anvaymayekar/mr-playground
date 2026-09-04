import { useMemo, useState } from "react";
import { ArrowUpRight, CircleAlert, FileCode2, Search } from "lucide-react";
import { examples } from "@/examples/registry";
import { HighlightedCode } from "@/editor/syntax";
import { cx } from "@/lib/format";
import { Shell } from "@/components/layout/Shell";
import { SectionEyebrow } from "@/components/shared/SectionEyebrow";
import { PlaygroundAnchor } from "@/components/shared/PlaygroundAnchor";

export default function ExamplesPage() {
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

