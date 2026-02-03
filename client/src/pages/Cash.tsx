import { useAppStore } from "@/lib/store";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { ArrowRightLeft, Plus, Wallet, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function Cash() {
  const { incomeTransactions, cashIntents } = useAppStore();

  // Find bank withdrawals (negative amounts, usually 'ATM' or 'RETIRO')
  const bankWithdrawals = incomeTransactions.filter(t => 
    t.type === 'withdrawal' || (t.amount < 0 && t.description.includes('RETIRO'))
  );

  const totalWithdrawn = bankWithdrawals.reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
  const totalAccounted = cashIntents.reduce((acc, curr) => acc + curr.amount, 0);
  const discrepancy = totalWithdrawn - totalAccounted;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Efectivo y Caja Chica</h1>
          <p className="text-sm text-muted-foreground">Conciliación de retiros de efectivo con gastos reales.</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" /> Registrar Nota de Retiro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Nota de Retiro</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Monto Retirado</Label>
                <Input id="amount" placeholder="5000" type="number" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="purpose">Propósito / Destino</Label>
                <Input id="purpose" placeholder="Ej: Pago Jardinero" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Fecha Estimada</Label>
                <Input id="date" type="date" />
              </div>
              <Button onClick={() => alert("Simulación: Nota guardada")} className="w-full mt-2">Guardar Nota</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reconciliation Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Retirado (Banco)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalWithdrawn)}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600">Justificado (Notas)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">{formatCurrency(totalAccounted)}</div>
          </CardContent>
        </Card>

        <Card className={cn(
          "border-2", 
          discrepancy > 0 ? "bg-orange-50 border-orange-200" : "bg-white border-slate-100"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">Pendiente de Justificar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{formatCurrency(discrepancy)}</div>
            {discrepancy > 0 && (
              <div className="flex items-center gap-1 text-xs text-orange-700 mt-1 font-medium">
                <AlertCircle className="h-3 w-3" /> Faltan recibos/notas
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Bank Withdrawals */}
        <div className="space-y-4">
          <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Wallet className="h-4 w-4 text-blue-700" />
            </div>
            Salidas de Banco
          </h3>
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bankWithdrawals.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-mono text-xs">{formatDate(tx.date)}</TableCell>
                    <TableCell className="text-sm">{tx.description}</TableCell>
                    <TableCell className="text-right font-mono font-medium text-rose-700">
                      {formatCurrency(Math.abs(tx.amount))}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                 {bankWithdrawals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground text-sm">
                      No hay retiros registrados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Right: User Intents */}
        <div className="space-y-4">
          <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <ArrowRightLeft className="h-4 w-4 text-emerald-700" />
            </div>
            Notas / Destino
          </h3>
           <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Fecha Est.</TableHead>
                  <TableHead>Propósito</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cashIntents.map((intent) => (
                  <TableRow key={intent.id}>
                    <TableCell className="font-mono text-xs">{formatDate(intent.date)}</TableCell>
                    <TableCell className="text-sm">
                      <div className="font-medium">{intent.purpose}</div>
                      <div className="text-xs text-muted-foreground">{intent.status}</div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium text-emerald-700">
                      {formatCurrency(intent.amount)}
                    </TableCell>
                  </TableRow>
                ))}
                 {cashIntents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground text-sm">
                      No hay notas registradas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
