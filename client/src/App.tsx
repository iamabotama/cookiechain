import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Whitepaper from "./pages/Whitepaper";
import Markets from "./pages/Markets";
import Chain from "./pages/Chain";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/whitepaper"} component={Whitepaper} />
      <Route path={"/markets"} component={Markets} />
      <Route path={"/chain"} component={Chain} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
