import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { RoutedErrorBoundary } from "@/components/RoutedErrorBoundary";
import Home from "@/pages/Home";
import ExamplesPage from "@/pages/ExamplesPage";
import DocsPage from "@/pages/DocsPage";
import AboutPage from "@/pages/AboutPage";
import Playground from "@/pages/Playground";
import NotFound from "@/pages/NotFound";

function ScrollToTop() {
    const [location] = useLocation();

    useEffect(() => {
        // Reset window scroll
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });

        // If you have a specific scrollable root container (common in full-height dashboards/layouts)
        const rootContainer =
            document.querySelector("main") || document.getElementById("root");
        if (rootContainer) {
            rootContainer.scrollTop = 0;
        }
    }, [location]);

    return null;
}

export function Router() {
    return (
        <RoutedErrorBoundary>
            <ScrollToTop />
            <Switch>
                <Route path="/" component={Home} />
                <Route path="/examples" component={ExamplesPage} />
                <Route path="/docs" component={DocsPage} />
                <Route path="/about" component={AboutPage} />
                <Route path="/playground" component={Playground} />
                <Route component={NotFound} />
            </Switch>
        </RoutedErrorBoundary>
    );
}
