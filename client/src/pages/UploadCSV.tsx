import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileType, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UploadCSV() {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<{ bank?: File; card?: File }>({});

  const handleFileChange = (type: 'bank' | 'card', file?: File) => {
    setFiles(prev => ({ ...prev, [type]: file }));
  };

  const handleProcess = async () => {
    if (!files.bank && !files.card) {
      toast({
        title: "Archivos faltantes",
        description: "Por favor selecciona al menos un archivo CSV para procesar.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    // Simulating processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUploading(false);

    toast({
      title: "Procesamiento completado",
      description: "Los datos han sido cargados y conciliados automáticamente.",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Cargar Nuevos Datos</h1>
        <p className="text-sm text-muted-foreground">Sube tus estados de cuenta para iniciar la conciliación del mes.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Bank Statement Upload */}
        <Card className="border-2 border-dashed border-muted hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mb-2">
              <FileType className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle>Estado Bancario (Ingresos)</CardTitle>
            <CardDescription>Archivo CSV del banco para rastrear rentas y retiros.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input 
                type="file" 
                accept=".csv" 
                onChange={(e) => handleFileChange('bank', e.target.files?.[0])}
                className="cursor-pointer"
              />
              {files.bank && (
                <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                  <CheckCircle2 className="h-4 w-4" /> Archivo seleccionado: {files.bank.name}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card Statement Upload */}
        <Card className="border-2 border-dashed border-muted hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center mb-2">
              <FileType className="h-5 w-5 text-purple-600" />
            </div>
            <CardTitle>Estado de Tarjeta (Gastos)</CardTitle>
            <CardDescription>Archivo CSV de la tarjeta para rastrear gastos de casa y propiedades.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input 
                type="file" 
                accept=".csv" 
                onChange={(e) => handleFileChange('card', e.target.files?.[0])}
                className="cursor-pointer"
              />
              {files.card && (
                <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                  <CheckCircle2 className="h-4 w-4" /> Archivo seleccionado: {files.card.name}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-4">
        <Button 
          size="lg" 
          className="w-full max-w-md gap-2 h-12 text-lg" 
          disabled={uploading || (!files.bank && !files.card)}
          onClick={handleProcess}
        >
          {uploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Procesando datos...
            </>
          ) : (
            <>
              <Upload className="h-5 w-5" /> Iniciar Conciliación del Mes
            </>
          )}
        </Button>
      </div>

      <Card className="bg-amber-50 border-amber-100">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-amber-900">Nota sobre el formato</p>
              <p className="text-xs text-amber-800 leading-relaxed">
                Asegúrate de que los archivos CSV tengan las columnas de Fecha, Descripción y Monto. 
                El sistema detectará automáticamente los patrones de pago para Edwin, Jochi y los demás inquilinos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
