import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import RitualDiario from "./pages/RitualDiario";
import SistemaOperador from "./pages/SistemaOperador";
import AgentesIA from "./pages/AgentesIA";
import BibliotecaGuias from "./pages/BibliotecaGuias";
import Autonomia from "./pages/Autonomia";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"\\"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/ritual-diario"} component={RitualDiario} />
      <Route path={"/sistema-operador"} component={SistemaOperador} />
      <Route path={"/agentes-ia"} component={AgentesIA} />
      <Route path={"/guias"} component={BibliotecaGuias} />
      <Route path={"/autonomia"} component={Autonomia} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
