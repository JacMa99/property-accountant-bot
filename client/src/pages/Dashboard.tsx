import { useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { incomeTransactions, expenseTransactions } = useAppStore();

  const totalIncome = incomeTransactions.reduce((acc, curr) => acc + (curr.amount > 0 ? curr.amount : 0), 0);
  const totalExpenses = expenseTransactions.reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
  
  const pendingIncome = incomeTransactions.filter(t => t.status === 'review' || t.status === 'pending').length;
  const pendingExpenses = expenseTransactions.filter(t => t.status === 'review' || t.status === 'pending').length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ingresos Totales (Mes)
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-foreground">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gastos Totales (Mes)
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center">
              <ArrowDownRight className="h-4 w-4 text-rose-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-foreground">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Dentro del presupuesto
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/60 bg-gradient-to-br from-white to-orange-50/50 border-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900/70">
              Pendiente Revisión
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-orange-950">{pendingIncome + pendingExpenses}</div>
            <p className="text-xs text-orange-800/60 mt-1">
              Transacciones por clasificar
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Balance Neto
            </CardTitle>
            <WalletIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-foreground">{formatCurrency(totalIncome - totalExpenses)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Cash flow positivo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Items / Notifications */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Resumen de Actividad</CardTitle>
            <CardDescription>Movimientos recientes detectados en los archivos CSV.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingIncome > 0 && (
                <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50 border border-orange-100">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-orange-900">Ingresos sin identificar</h4>
                      <p className="text-xs text-orange-700">Hay {pendingIncome} depósitos que requieren asignación manual.</p>
                    </div>
                  </div>
                  <Link href="/income">
                    <a className="text-sm font-medium text-orange-600 hover:text-orange-700 hover:underline">
                      Revisar
                    </a>
                  </Link>
                </div>
              )}

              {pendingExpenses > 0 && (
                <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <CreditCardIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900">Gastos pendientes</h4>
                      <p className="text-xs text-blue-700">{pendingExpenses} transacciones de tarjeta por categorizar.</p>
                    </div>
                  </div>
                  <Link href="/expenses">
                    <a className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                      Categorizar
                    </a>
                  </Link>
                </div>
              )}
              
              {pendingIncome === 0 && pendingExpenses === 0 && (
                 <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-3 opacity-20" />
                    <p>Todo está al día. ¡Buen trabajo!</p>
                 </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm bg-sidebar text-sidebar-foreground border-sidebar-border">
          <CardHeader>
            <CardTitle className="text-white">Estado de Ocupación</CardTitle>
            <CardDescription className="text-sidebar-foreground/60">Resumen de unidades rentadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Apartamentos</span>
                <span className="text-sm font-bold text-white">7/7</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-medium">Lotes Comerciales</span>
                <span className="text-sm font-bold text-white">3/4</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              
              <div className="pt-6 mt-6 border-t border-white/10">
                 <p className="text-xs text-white/40">
                   Lote 1 (Vacante) aún está disponible para renta.
                 </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function WalletIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
      <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
      <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
    </svg>
  )
}

function CreditCardIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}
