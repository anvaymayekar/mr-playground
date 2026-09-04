import { type ReactNode } from "react";

export function SectionEyebrow({ children }: { children: ReactNode }) {
    return (
        <p className="mb-4 flex items-center gap-2 font-mono text-[12px] uppercase tracking-[.18em] text-primary">
            <span className="h-px w-5 bg-primary" />
            {children}
        </p>
    );
}
