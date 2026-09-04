import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowUpRight, ExternalLink, Github, Menu, X } from "lucide-react";
import { cx } from "@/lib/format";
import { Mark } from "@/components/layout/Mark";
import { PlaygroundAnchor } from "@/components/shared/PlaygroundAnchor";

export function Header() {
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
                        href="https://github.com/anvaymayekar/custom-compiler"
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
