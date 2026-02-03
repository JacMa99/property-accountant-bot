import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Income from "@/pages/Income";
import Expenses from "@/pages/Expenses";
import Projects from "@/pages/Projects";
import Cash from "@/pages/Cash";
import Reports from "@/pages/Reports";
import Layout from "@/components/Layout";
import { AppProvider } from "@/lib/store";

const MasterData = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="p-8 border rounded-lg bg-card shadow-sm">
      <h2 className="text-lg font-bold mb-4">Configuración de Maestros</h2>
      <p className="text-muted-foreground">Aquí podrá editar la lista de Unidades e Inquilinos.</p>
    </div>
  </div>
);

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/income" component={Income} />
        <Route path="/expenses" component={Expenses} />
        <Route path="/projects" component={Projects} />
        <Route path="/cash" component={Cash} />
        <Route path="/reports" component={Reports} />
        <Route path="/master-data" component={MasterData} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
