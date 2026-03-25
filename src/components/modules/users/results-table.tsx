"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, XCircle } from "lucide-react";

interface ResultEntry {
  email: string;
  success: boolean;
  userId?: number;
  contactId?: string;
  firebaseUid?: string;
  error?: string;
}

interface ResultsTableProps {
  results: ResultEntry[];
}

function formatError(error?: string): string {
  if (!error) return "Error desconocido";
  if (error.includes("cannot be processed in CRM") || error.includes("already in use")) {
    return "El usuario ya existe. Para modificar sus permisos, hazlo desde HubSpot.";
  }
  return error;
}

export function ResultsTable({ results }: ResultsTableProps) {
  if (results.length === 0) return null;

  const successCount = results.filter((r) => r.success).length;
  const errorCount = results.length - successCount;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">Resultados</span>
          <Badge
            variant="outline"
            className="bg-emerald-50 border-emerald-200 text-emerald-700 text-[11px]"
          >
            {successCount} exitosos
          </Badge>
          {errorCount > 0 && (
            <Badge
              variant="outline"
              className="bg-red-50 border-red-200 text-red-700 text-[11px]"
            >
              {errorCount} con errores
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[11px] uppercase tracking-wider">
                  Email
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider">
                  Estado
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider">
                  Detalle
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.email}>
                  <TableCell className="text-[13px] font-medium">
                    {result.email}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {result.success ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-[13px] text-emerald-700">
                            Creado
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-red-500" />
                          <span className="text-[13px] text-red-600">
                            Error
                          </span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-[13px] text-muted-foreground">
                    {result.success
                      ? `ID: ${result.userId ?? "-"}`
                      : formatError(result.error)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
