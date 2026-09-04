import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Shell } from "@/components/layout/Shell";

export default function NotFound() {
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

