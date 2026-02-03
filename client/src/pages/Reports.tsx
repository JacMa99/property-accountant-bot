import { useAppStore } from "@/lib/store";
import { formatCurrency, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function Reports() {
  const { incomeTransactions, expenseTransactions, units } = useAppStore();

  // Aggregate Data Logic
  const reportData = units.map(unit => {
    // 1. Calculate Income for this unit
    const unitIncome = incomeTransactions
      .filter(t => t.matchId === unit.id && t.status === 'matched')
      .reduce((sum, t) => sum + t.amount, 0);

    // 2. Calculate Direct Expenses for this unit
    // Note: We are storing "Unidad: ID" in the note field for expenses in our mockup logic
    const unitExpenses = expenseTransactions
      .filter(t => t.note?.includes(unit.id))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      unitId: unit.id,
      unitName: unit.name,
      income: unitIncome,
      expenses: unitExpenses,
      net: unitIncome - unitExpenses
    };
  });

  const totalIncome = reportData.reduce((sum, r) => sum + r.income, 0);
  const totalExpenses = reportData.reduce((sum, r) => sum + r.expenses, 0);
  const totalNet = totalIncome - totalExpenses;

  // Separate "House" expenses (not attached to a unit)
  const houseExpenses = expenseTransactions
    .filter(t => t.matchId === 'HOUSE')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Reportes Mensuales</h1>
          <p className="text-sm text-muted-foreground">Resumen financiero consolidado.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Exportar a Excel
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-heading font-semibold text-lg">Estado de Resultados por Propiedad</h3>
        </div>
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Propiedad</TableHead>
              <TableHead className="text-right">Ingresos (Rentas)</TableHead>
              <TableHead className="text-right">Gastos Directos</TableHead>
              <TableHead className="text-right">Neto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportData.map((row) => (
              <TableRow key={row.unitId}>
                <TableCell className="font-mono text-xs font-medium text-muted-foreground">{row.unitId}</TableCell>
                <TableCell className="font-medium">{row.unitName}</TableCell>
                <TableCell className="text-right font-mono text-emerald-700">
                  {row.income > 0 ? formatCurrency(row.income) : '-'}
                </TableCell>
                <TableCell className="text-right font-mono text-rose-700">
                  {row.expenses > 0 ? formatCurrency(row.expenses) : '-'}
                </TableCell>
                <TableCell className={cn(
                  "text-right font-mono font-bold",
                  row.net >= 0 ? "text-foreground" : "text-rose-600"
                )}>
                  {formatCurrency(row.net)}
                </TableCell>
              </TableRow>
            ))}
            
            {/* House Expenses Row */}
            <TableRow className="bg-slate-50/50">
              <TableCell className="font-mono text-xs font-medium text-muted-foreground">CASA</TableCell>
              <TableCell className="font-medium text-indigo-900">Gastos Casa (Abuela)</TableCell>
              <TableCell className="text-right font-mono text-emerald-700">-</TableCell>
              <TableCell className="text-right font-mono text-rose-700 font-bold">
                {formatCurrency(houseExpenses)}
              </TableCell>
              <TableCell className="text-right font-mono font-bold text-rose-700">
                {formatCurrency(-houseExpenses)}
              </TableCell>
            </TableRow>

            {/* Totals */}
            <TableRow className="bg-slate-100/80 font-bold border-t-2 border-slate-200">
              <TableCell colSpan={2} className="text-right pr-8">TOTAL GENERAL</TableCell>
              <TableCell className="text-right text-emerald-700">{formatCurrency(totalIncome)}</TableCell>
              <TableCell className="text-right text-rose-700">{formatCurrency(totalExpenses + houseExpenses)}</TableCell>
              <TableCell className="text-right text-slate-900">{formatCurrency(totalNet - houseExpenses)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-emerald-900">Reporte de Ingresos (CSV)</h4>
            <p className="text-xs text-emerald-700 mt-1">Listo para copiar a Excel</p>
          </div>
          <Button variant="ghost" size="icon" className="text-emerald-700 hover:bg-emerald-200/50">
            <FileSpreadsheet className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 bg-rose-50 rounded-xl border border-rose-100 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-rose-900">Reporte de Gastos (CSV)</h4>
            <p className="text-xs text-rose-700 mt-1">Categorizado por Casa vs Propiedades</p>
          </div>
          <Button variant="ghost" size="icon" className="text-rose-700 hover:bg-rose-200/50">
            <FileSpreadsheet className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
