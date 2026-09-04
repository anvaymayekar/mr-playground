import { ArrowUpRight, FileCode2 } from "lucide-react";
import { type MrExample } from "@/examples/registry";
import { HighlightedCode } from "@/editor/syntax";
import { cx } from "@/lib/format";
import { PlaygroundAnchor } from "@/components/shared/PlaygroundAnchor";

export function CodeBlock({
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
