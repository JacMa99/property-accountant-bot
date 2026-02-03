import { useAppStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Briefcase, Layers, TrendingUp } from "lucide-react";

export default function Projects() {
  const { projects, lineItems } = useAppStore();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Proyectos Especiales</h1>
          <p className="text-sm text-muted-foreground">Seguimiento de inversiones y mejoras a gran escala.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {projects.map((project) => {
          const projectItems = lineItems.filter(li => li.projectId === project.id);
          const currentTotal = projectItems.reduce((sum, li) => sum + li.amount, 0);
          const percent = Math.min(100, (currentTotal / project.totalBudget) * 100);

          return (
            <Card key={project.id} className="shadow-sm border-border/60 overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-muted-foreground text-xs uppercase tracking-wider">Presupuesto Total</div>
                    <div className="text-xl font-bold font-heading">{formatCurrency(project.totalBudget)}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" /> Invertido: {formatCurrency(currentTotal)}
                      </span>
                      <span>{percent.toFixed(1)}%</span>
                    </div>
                    <Progress value={percent} className="h-2" />
                  </div>

                  {/* Line Items Drill-down */}
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="items" className="border-none">
                      <AccordionTrigger className="hover:no-underline py-2 bg-secondary/50 rounded-lg px-4 transition-all">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <Layers className="h-4 w-4" /> Ver desglose de partidas ({projectItems.length})
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <div className="rounded-lg border border-border overflow-hidden">
                          <Table>
                            <TableHeader className="bg-muted/50">
                              <TableRow>
                                <TableHead className="text-xs">Fecha</TableHead>
                                <TableHead className="text-xs">Descripción</TableHead>
                                <TableHead className="text-xs">Categoría</TableHead>
                                <TableHead className="text-right text-xs">Monto</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {projectItems.map((li) => (
                                <TableRow key={li.id}>
                                  <TableCell className="font-mono text-[10px]">{formatDate(li.date)}</TableCell>
                                  <TableCell className="text-sm">{li.description}</TableCell>
                                  <TableCell>
                                    <Badge variant="secondary" className="text-[10px] py-0 h-5 capitalize font-normal">
                                      {li.category}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right font-mono font-medium text-sm">
                                    {formatCurrency(li.amount)}
                                  </TableCell>
                                </TableRow>
                              ))}
                              {projectItems.length === 0 && (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground text-xs">
                                    No hay partidas registradas para este proyecto.
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
