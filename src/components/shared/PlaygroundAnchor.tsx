import { type AnchorHTMLAttributes, type ReactNode } from "react";
import { playgroundHref } from "@/lib/format";

export function PlaygroundAnchor({
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
