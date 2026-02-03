import { useAppStore } from "@/lib/store";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle, Search, Filter } from "lucide-react";
import { useState } from "react";

export default function Income() {
  const { incomeTransactions, tenants, units, updateIncomeTransaction } = useAppStore();
  const [filter, setFilter] = useState('');

  // Filter only deposits for this view
  const deposits = incomeTransactions.filter(t => t.amount > 0);
  
  // Filtered list
  const filteredDeposits = deposits.filter(t => 
    t.description.toLowerCase().includes(filter.toLowerCase()) ||
    t.amount.toString().includes(filter)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Ingresos (Rentas)</h1>
          <p className="text-sm text-muted-foreground">Conciliación de depósitos bancarios con inquilinos.</p>
        </div>
        
        <div className="flex items-center gap-2">
           <div className="relative">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input 
               placeholder="Buscar..." 
               className="pl-9 w-[200px] bg-white" 
               value={filter}
               onChange={(e) => setFilter(e.target.value)}
             />
           </div>
           <Button variant="outline" size="icon">
             <Filter className="h-4 w-4" />
           </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[120px]">Fecha</TableHead>
              <TableHead className="w-[300px]">Descripción Banco</TableHead>
              <TableHead className="text-right w-[120px]">Monto</TableHead>
              <TableHead className="w-[150px]">Estado</TableHead>
              <TableHead className="w-[250px]">Asignado A (Unidad/Inquilino)</TableHead>
              <TableHead>Notas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDeposits.map((tx) => (
              <TableRow key={tx.id} className={cn(
                "transition-colors",
                tx.status === 'review' ? "bg-orange-50/50 hover:bg-orange-50" : "hover:bg-muted/30"
              )}>
                <TableCell className="font-mono text-xs">{formatDate(tx.date)}</TableCell>
                <TableCell>
                  <div className="font-medium text-sm">{tx.description}</div>
                  {tx.status === 'matched' && (
                    <span className="text-[10px] text-emerald-600 flex items-center gap-1 mt-0.5">
                      <Check className="h-3 w-3" /> Coincidencia automática
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right font-mono font-medium text-emerald-700">
                  {formatCurrency(tx.amount)}
                </TableCell>
                <TableCell>
                  {tx.status === 'matched' ? (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1">
                      <Check className="h-3 w-3" /> Conciliado
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 gap-1 animate-pulse">
                      <AlertCircle className="h-3 w-3" /> Revisar
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Select 
                    value={tx.matchId} 
                    onValueChange={(val) => updateIncomeTransaction(tx.id, { matchId: val, status: 'matched' })}
                  >
                    <SelectTrigger className="h-8 bg-white border-input">
                      <SelectValue placeholder="Seleccionar Unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {tenants.map((t) => (
                        <SelectItem key={t.unitId} value={t.unitId}>
                          <span className="font-medium">{t.unitId}</span> - {t.name} ({formatCurrency(t.monthlyRent)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input 
                    className="h-8 bg-transparent border-transparent hover:border-input focus:border-input focus:bg-white transition-all" 
                    placeholder="Añadir nota..." 
                    value={tx.note || ''}
                    onChange={(e) => updateIncomeTransaction(tx.id, { note: e.target.value })}
                  />
                </TableCell>
              </TableRow>
            ))}
            
            {filteredDeposits.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No se encontraron transacciones.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
