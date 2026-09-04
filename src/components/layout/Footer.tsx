import { Link } from "wouter";
import { Mark } from "@/components/layout/Mark";

export function Footer() {
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
                        Crafted by Anvay Mayekar with Prem &amp; Pride.
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
                        <a
                            href="https://anvaymayekar.vercel.app/"
                            className="text-xs text-muted-foreground hover:text-primary"
                            target="_blank"
                            rel="noreferrer"
                            data-testid="link-footer-website"
                        >
                            Creator's Website
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
