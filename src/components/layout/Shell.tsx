import { type ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function Shell({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-[100dvh] bg-background text-foreground">
            <Header />
            {children}
            <Footer />
        </div>
    );
}
