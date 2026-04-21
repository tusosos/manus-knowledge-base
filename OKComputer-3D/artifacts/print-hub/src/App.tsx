import { Suspense, lazy } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout";
import { PageSkeleton, KanbanSkeleton } from "@/components/page-skeleton";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Tasks from "@/pages/tasks";
import Projects from "@/pages/projects";
import PrintQueue from "@/pages/print-queue";
import Calculator from "@/pages/calculator";
import Inventory from "@/pages/inventory";
import Clients from "@/pages/clients";
import Quotes from "@/pages/quotes";
import Analytics from "@/pages/analytics";
import Bestsellers from "@/pages/bestsellers";
import Competition from "@/pages/competition";
import BusinessPlan from "@/pages/business-plan";
import Multicolor from "@/pages/multicolor";
import Printer from "@/pages/printer";
import Knowledge from "@/pages/knowledge";
import FilamentDeals from "@/pages/filament-deals";
import ListingGenerator from "@/pages/listing-generator";
import Shipping from "@/pages/shipping";

const Scaling = lazy(() => import("@/pages/scaling"));
const ValueCompare = lazy(() => import("@/pages/value-compare"));
const OrderBoard = lazy(() => import("@/pages/order-board"));
const LabelGeneratorPage = lazy(() => import("@/pages/label-generator"));
const HourlyProfit = lazy(() => import("@/pages/hourly-profit"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/tasks" component={Tasks} />
        <Route path="/projects" component={Projects} />
        <Route path="/print-queue" component={PrintQueue} />
        <Route path="/calculator" component={Calculator} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/clients" component={Clients} />
        <Route path="/quotes" component={Quotes} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/bestsellers" component={Bestsellers} />
        <Route path="/competition" component={Competition} />
        <Route path="/business-plan" component={BusinessPlan} />
        <Route path="/multicolor" component={Multicolor} />
        <Route path="/printer" component={Printer} />
        <Route path="/knowledge" component={Knowledge} />
        <Route path="/filament-deals" component={FilamentDeals} />
        <Route path="/listing-generator" component={ListingGenerator} />
        <Route path="/shipping" component={Shipping} />
        <Route path="/scaling">{() => <Suspense fallback={<PageSkeleton />}><Scaling /></Suspense>}</Route>
        <Route path="/value-compare">{() => <Suspense fallback={<PageSkeleton />}><ValueCompare /></Suspense>}</Route>
        <Route path="/order-board">{() => <Suspense fallback={<KanbanSkeleton />}><OrderBoard /></Suspense>}</Route>
        <Route path="/label-generator">{() => <Suspense fallback={<PageSkeleton />}><LabelGeneratorPage /></Suspense>}</Route>
        <Route path="/hourly-profit">{() => <Suspense fallback={<PageSkeleton />}><HourlyProfit /></Suspense>}</Route>
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
