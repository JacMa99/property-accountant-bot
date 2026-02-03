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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Home, Building } from "lucide-react";
import { useState } from "react";

export default function Expenses() {
  const { expenseTransactions, units, updateExpenseTransaction } = useAppStore();
  const [filter, setFilter] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'house' | 'properties'>('all');

  // Filter transactions
  const expenses = expenseTransactions;
  
  const filteredExpenses = expenses.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(filter.toLowerCase()) || 
                          t.amount.toString().includes(filter);
    
    // In a real app, we'd store the "Category" field in the transaction. 
    // For this mockup, we'll assume note contains category or we add a field.
    // Let's use 'matchId' as a proxy for Category Group for now (HOUSE vs PROP).
    // Or we can just filter by ID if we had that structure.
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Gastos (Tarjeta)</h1>
          <p className="text-sm text-muted-foreground">Clasificación de gastos: Casa (Abuela) vs Propiedades.</p>
        </div>
        
        <div className="flex items-center gap-2">
           <Tabs defaultValue="all" className="w-[300px]" onValueChange={(v) => setViewMode(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="house">Casa</TabsTrigger>
              <TabsTrigger value="properties">Prop.</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[120px]">Fecha</TableHead>
              <TableHead className="w-[300px]">Descripción Tarjeta</TableHead>
              <TableHead className="text-right w-[120px]">Monto</TableHead>
              <TableHead className="w-[200px]">Categoría Principal</TableHead>
              <TableHead className="w-[250px]">Unidad (Si aplica)</TableHead>
              <TableHead>Detalle / Nota</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map((tx) => (
              <TableRow key={tx.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-mono text-xs">{formatDate(tx.date)}</TableCell>
                <TableCell className="font-medium text-sm">{tx.description}</TableCell>
                <TableCell className="text-right font-mono font-medium text-rose-700">
                  {formatCurrency(tx.amount)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant={tx.matchId === 'HOUSE' ? "default" : "outline"} 
                      size="sm"
                      className={cn(
                        "h-7 px-2 text-xs gap-1",
                        tx.matchId === 'HOUSE' ? "bg-indigo-600 hover:bg-indigo-700" : ""
                      )}
                      onClick={() => updateExpenseTransaction(tx.id, { matchId: 'HOUSE', status: 'matched' })}
                    >
                      <Home className="h-3 w-3" /> Casa
                    </Button>
                    <Button 
                      variant={tx.matchId === 'PROP' ? "default" : "outline"} 
                      size="sm"
                      className={cn(
                        "h-7 px-2 text-xs gap-1",
                        tx.matchId === 'PROP' ? "bg-emerald-600 hover:bg-emerald-700" : ""
                      )}
                      onClick={() => updateExpenseTransaction(tx.id, { matchId: 'PROP', status: 'matched' })}
                    >
                      <Building className="h-3 w-3" /> Prop.
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  {tx.matchId === 'PROP' ? (
                     <Select 
                       onValueChange={(val) => updateExpenseTransaction(tx.id, { note: `Unidad: ${val}` })}
                     >
                      <SelectTrigger className="h-8 bg-white border-input">
                        <SelectValue placeholder="Asignar Unidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GENERAL">General / Común</SelectItem>
                        {units.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.id} - {u.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-xs text-muted-foreground italic pl-2">
                      {tx.matchId === 'HOUSE' ? 'N/A' : '-'}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Input 
                    className="h-8 bg-transparent border-transparent hover:border-input focus:border-input focus:bg-white transition-all" 
                    placeholder="Detalle..." 
                    value={tx.note || ''}
                    onChange={(e) => updateExpenseTransaction(tx.id, { note: e.target.value })}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
