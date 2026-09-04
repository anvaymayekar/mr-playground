import { type ReactNode } from "react";
import { useLocation } from "wouter";
import { ErrorBoundary } from "@/components/error-boundary";

export function RoutedErrorBoundary({ children }: { children: ReactNode }) {
    const [location] = useLocation();
    return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

