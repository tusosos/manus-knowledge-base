import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Printer,
  Calculator,
  Wallet,
  Users,
  Package,
  LineChart,
  Trophy,
  Activity,
  FileText,
  Ship,
  TrendingUp,
  Palette,
  Settings,
  BookOpen,
  Columns3,
  Scale,
  ShieldCheck,
  Tag,
  Clock
} from "lucide-react";

const navigation = [
  {
    title: "Główne",
    items: [
      { title: "Dashboard", href: "/", icon: LayoutDashboard },
      { title: "Zadania", href: "/tasks", icon: CheckSquare },
      { title: "Projekty", href: "/projects", icon: FolderKanban },
      { title: "Kolejka Druku", href: "/print-queue", icon: Printer, badge: 3 },
      { title: "Tablica Zamowien", href: "/order-board", icon: Columns3 },
    ]
  },
  {
    title: "Biznes",
    items: [
      { title: "Kalkulator", href: "/calculator", icon: Calculator },
      { title: "Wyceny", href: "/quotes", icon: Wallet },
      { title: "Klienci", href: "/clients", icon: Users },
      { title: "Wysyłka", href: "/shipping", icon: Ship },
      { title: "Ty vs AliExpress", href: "/value-compare", icon: ShieldCheck },
    ]
  },
  {
    title: "Magazyn",
    items: [
      { title: "Magazyn", href: "/inventory", icon: Package },
      { title: "Okazje Filamentów", href: "/filament-deals", icon: TrendingUp },
      { title: "Multicolor", href: "/multicolor", icon: Palette },
    ]
  },
  {
    title: "Analizy",
    items: [
      { title: "Analizy", href: "/analytics", icon: LineChart },
      { title: "Bestsellery", href: "/bestsellers", icon: Trophy },
      { title: "Konkurencja", href: "/competition", icon: Activity },
      { title: "Skalowanie", href: "/scaling", icon: Scale },
      { title: "Zysk / Godzine", href: "/hourly-profit", icon: Clock },
    ]
  },
  {
    title: "Narzędzia",
    items: [
      { title: "Generator Listingów", href: "/listing-generator", icon: FileText },
      { title: "Generator Etykiet", href: "/label-generator", icon: Tag },
      { title: "Biznes Plan", href: "/business-plan", icon: LineChart },
      { title: "Drukarka", href: "/printer", icon: Settings },
      { title: "Baza Wiedzy", href: "/knowledge", icon: BookOpen },
    ]
  }
];

export function AppSidebar() {
  const [location] = useLocation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <nav
      className="flex h-screen w-64 flex-col border-r border-border bg-sidebar text-sidebar-foreground flex-shrink-0"
      aria-label="Nawigacja główna"
    >
      <div className="flex h-14 items-center px-4 border-b border-border">
        <div className="flex items-center gap-2.5 font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>
          <Printer className="h-5 w-5" aria-hidden="true" />
          <span className="text-lg tracking-tight">3D Print Hub</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        {navigation.map((group, i) => (
          <div key={i} className="mb-6 px-3">
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.title}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative flex items-center justify-between rounded-md px-2 py-2.5 min-h-[44px] text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isActive ? "text-primary" : "text-sidebar-foreground/80"
                    )}
                    data-testid={`nav-link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active-indicator"
                        className="absolute inset-0 rounded-md bg-sidebar-accent"
                        transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <div className="relative flex items-center gap-3 z-10">
                      <item.icon
                        className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")}
                        aria-hidden="true"
                      />
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <span className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}
