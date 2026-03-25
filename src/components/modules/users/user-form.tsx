"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import type { UserPayload } from "@/lib/bcas-client";

interface UserFormProps {
  onSubmit: (users: UserPayload[]) => void;
  loading: boolean;
}

export function UserForm({ onSubmit, loading }: UserFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolAdmin, setSchoolAdmin] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit([{ email, password, schoolAdmin }]);
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user-email" className="text-[13px]">
                Email
              </Label>
              <Input
                id="user-email"
                type="email"
                placeholder="agente@escuela.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-password" className="text-[13px]">
                Contraseña
              </Label>
              <Input
                id="user-password"
                type="text"
                placeholder="Bcas2024!"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-school" className="text-[13px]">
                School Admin ID(s)
              </Label>
              <Input
                id="user-school"
                type="text"
                placeholder="26 o 26,289,417"
                value={schoolAdmin}
                onChange={(e) => setSchoolAdmin(e.target.value)}
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Varios IDs separados por comas, sin espacios
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-bcas-primary hover:bg-bcas-primary/90 text-white"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear usuario"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
