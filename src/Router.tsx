import { Route, Switch } from "wouter";
import { RoutedErrorBoundary } from "@/components/RoutedErrorBoundary";
import Home from "@/pages/Home";
import ExamplesPage from "@/pages/ExamplesPage";
import DocsPage from "@/pages/DocsPage";
import AboutPage from "@/pages/AboutPage";
import Playground from "@/pages/Playground";
import NotFound from "@/pages/NotFound";

export function Router() {
    return (
        <RoutedErrorBoundary>
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
