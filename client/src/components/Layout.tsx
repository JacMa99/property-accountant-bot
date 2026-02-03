import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  ArrowDownToLine, 
  CreditCard, 
  Wallet, 
  FileBarChart, 
  Settings,
  Building2,
  Briefcase,
  Upload
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { label: 'Cargar CSV', icon: Upload, href: '/upload' },
  { label: 'Ingresos (Banco)', icon: ArrowDownToLine, href: '/income' },
  { label: 'Gastos (Tarjeta)', icon: CreditCard, href: '/expenses' },
  { label: 'Proyectos', icon: Briefcase, href: '/projects' },
  { label: 'Efectivo / Caja', icon: Wallet, href: '/cash' },
  { label: 'Reportes', icon: FileBarChart, href: '/reports' },
  { label: 'Maestros', icon: Settings, href: '/master-data' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 transition-all duration-300">
        <div className="p-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Building2 className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-sidebar-foreground text-lg leading-tight tracking-tight">Propiedades</h1>
            <p className="text-xs text-sidebar-foreground/60 font-medium">Asistente Contable</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                  isActive 
                    ? "bg-sidebar-primary text-white shadow-md" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white"
                )}>
                  <item.icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-white" : "text-sidebar-foreground/50 group-hover:text-white"
                  )} />
                  {item.label}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
                  )}
                </a>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-sidebar-accent/50 rounded-lg p-4 border border-sidebar-border">
            <p className="text-xs text-sidebar-foreground/50 font-medium mb-1">Periodo Actual</p>
            <p className="text-sm font-bold text-white">Febrero 2024</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            {NAV_ITEMS.find(n => n.href === location)?.label || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full border border-border">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground">Sistemas Operativos</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
