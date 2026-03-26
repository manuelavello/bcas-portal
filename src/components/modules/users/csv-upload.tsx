"use client";

import { useState, useCallback } from "react";
import { Upload, X, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { UserPayload } from "@/lib/bcas-client";

interface CsvUploadProps {
  onSubmit: (users: UserPayload[]) => void;
  loading: boolean;
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if ((char === "," || char === ";") && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

function parseCSV(text: string): UserPayload[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const header = lines[0].toLowerCase().replace(/\r/g, "");
  const cols = parseCsvLine(header);

  const emailIdx = cols.findIndex(
    (c) => c === "email" || c === "correo" || c === "mail"
  );
  const passIdx = cols.findIndex(
    (c) => c === "password" || c === "contraseña" || c === "pass"
  );
  const schoolIdx = cols.findIndex(
    (c) =>
      c === "schooladmin" ||
      c === "school_admin" ||
      c === "school" ||
      c === "schooladminids"
  );

  if (emailIdx === -1 || passIdx === -1 || schoolIdx === -1) {
    throw new Error(
      "El CSV debe tener columnas: email, password, schoolAdmin"
    );
  }

  const users: UserPayload[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].replace(/\r/g, "").trim();
    if (!line) continue;

    const values = parseCsvLine(line);
    const email = values[emailIdx];
    const password = values[passIdx];
    const schoolAdmin = values[schoolIdx];

    if (email && password && schoolAdmin) {
      users.push({ email, password, schoolAdmin });
    }
  }

  return users;
}

export function CsvUpload({ onSubmit, loading }: CsvUploadProps) {
  const [users, setUsers] = useState<UserPayload[]>([]);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((file: File) => {
    setError("");
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = parseCSV(text);
        if (parsed.length === 0) {
          setError("No se encontraron usuarios válidos en el CSV");
          return;
        }
        setUsers(parsed);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al leer CSV");
      }
    };
    reader.readAsText(file);
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDownloadTemplate() {
    const csv = "email,password,schoolAdmin\nagente1@escuela.com,Bcas2024!,26\nagente2@escuela.com,Bcas2024!,\"26,289\"\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla_usuarios.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleClear() {
    setUsers([]);
    setFileName("");
    setError("");
  }

  return (
    <div className="space-y-4">
      {users.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragOver
                  ? "border-bcas-primary bg-bcas-primary/5"
                  : "border-border"
              }`}
            >
              <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-[13px] text-muted-foreground mb-2">
                Arrastra un archivo CSV aquí o haz clic para seleccionar
              </p>
              <p className="text-[11px] text-muted-foreground mb-4">
                Columnas requeridas: email, password, schoolAdmin
              </p>
              <Button
                type="button"
                variant="link"
                size="sm"
                className="text-[13px] text-bcas-secondary gap-1.5 mb-3"
                onClick={handleDownloadTemplate}
              >
                <Download className="w-3.5 h-3.5" />
                Descargar plantilla CSV
              </Button>
              <br />
              <label>
                <input
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={handleFileInput}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-[13px]"
                  asChild
                >
                  <span>Seleccionar archivo</span>
                </Button>
              </label>
            </div>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription className="text-[13px]">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-[13px] font-medium">{fileName}</span>
                <span className="text-[11px] text-muted-foreground">
                  ({users.length} usuarios)
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="rounded-lg border border-border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[11px] uppercase tracking-wider">
                      Email
                    </TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider">
                      Password
                    </TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider">
                      School Admin
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-[13px]">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-[13px]">
                        {user.password}
                      </TableCell>
                      <TableCell className="text-[13px]">
                        {user.schoolAdmin}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                className="bg-bcas-primary hover:bg-bcas-primary/90 text-white"
                onClick={() => onSubmit(users)}
                disabled={loading}
              >
                {loading
                  ? "Creando..."
                  : `Crear ${users.length} usuario${users.length > 1 ? "s" : ""}`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
