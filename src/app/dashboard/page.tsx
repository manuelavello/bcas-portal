"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserForm } from "@/components/modules/users/user-form";
import { CsvUpload } from "@/components/modules/users/csv-upload";
import { ResultsTable } from "@/components/modules/users/results-table";
import type { UserPayload } from "@/lib/bcas-client";
import { toast } from "sonner";

interface ResultEntry {
  email: string;
  success: boolean;
  userId?: number;
  contactId?: string;
  firebaseUid?: string;
  error?: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [error, setError] = useState("");
  const [pendingUsers, setPendingUsers] = useState<UserPayload[] | null>(null);

  function handleSubmitRequest(users: UserPayload[]) {
    setPendingUsers(users);
  }

  async function handleConfirm() {
    if (!pendingUsers) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users: pendingUsers }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear usuarios");
      }

      const data = await res.json();
      const entries: ResultEntry[] = data.results;

      setResults(entries);

      const successCount = entries.filter((r) => r.success).length;

      toast.success(
        `${successCount} de ${entries.length} usuarios creados correctamente`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear usuarios");
      toast.error("Error al crear usuarios");
    } finally {
      setLoading(false);
      setPendingUsers(null);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-sm font-semibold text-foreground">
          Alta de usuarios
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          Crea agentes de escuelas de forma individual o masiva mediante CSV.
        </p>
      </div>

      <Tabs defaultValue="individual" className="space-y-4">
        <TabsList>
          <TabsTrigger value="individual" className="text-[13px]">
            Individual
          </TabsTrigger>
          <TabsTrigger value="csv" className="text-[13px]">
            CSV masivo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual">
          <UserForm onSubmit={handleSubmitRequest} loading={loading} />
        </TabsContent>

        <TabsContent value="csv">
          <CsvUpload onSubmit={handleSubmitRequest} loading={loading} />
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant="destructive">
          <AlertDescription className="text-[13px]">{error}</AlertDescription>
        </Alert>
      )}

      <ResultsTable results={results} />

      {/* Confirmation dialog */}
      <AlertDialog
        open={pendingUsers !== null}
        onOpenChange={(open) => {
          if (!open) setPendingUsers(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar creación de usuarios</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>
                  Se van a crear{" "}
                  <strong>{pendingUsers?.length ?? 0} usuario(s)</strong> en
                  HubSpot y Firebase.
                </p>
                <div className="max-h-40 overflow-auto rounded-lg border border-border p-3 mt-2">
                  {pendingUsers?.map((u) => (
                    <p key={u.email} className="text-[13px] py-0.5">
                      {u.email}{" "}
                      <span className="text-muted-foreground">
                        (school: {u.schoolAdmin})
                      </span>
                    </p>
                  ))}
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-bcas-primary hover:bg-bcas-primary/90 text-white"
              onClick={handleConfirm}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
