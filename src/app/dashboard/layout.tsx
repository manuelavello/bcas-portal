"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";

function SidebarContent({ onLogout }: { onLogout: () => void }) {
  return (
    <>
      <nav className="flex-1 p-3 space-y-1">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2.5 py-2">
          Acciones
        </p>
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-muted font-medium text-foreground text-[13px]"
        >
          <Users className="w-4 h-4" />
          Alta de usuarios
        </Link>
      </nav>

      <Separator />

      <div className="p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2.5 text-muted-foreground hover:bg-muted/50 text-[13px]"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </Button>
      </div>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
  }

  function handleMobileLogout() {
    setSheetOpen(false);
    handleLogout();
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col">
        {/* Topbar */}
        <header className="h-14 bg-card border-b border-border flex items-center shrink-0">
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center px-3">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[220px] p-0 flex flex-col">
                <div className="flex items-center gap-2 px-5 h-14 border-b border-border">
                  <div className="w-7 h-7 rounded-lg bg-bcas-primary flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">B</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">Bcas</span>
                </div>
                <SidebarContent onLogout={handleMobileLogout} />
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop logo */}
          <div className="hidden md:flex w-[220px] items-center gap-2 px-5 border-r border-border h-full">
            <div className="w-7 h-7 rounded-lg bg-bcas-primary flex items-center justify-center">
              <span className="text-white font-semibold text-xs">B</span>
            </div>
            <span className="text-sm font-semibold text-foreground">Bcas</span>
          </div>

          {/* Mobile logo (when no sidebar) */}
          <div className="md:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-bcas-primary flex items-center justify-center">
              <span className="text-white font-semibold text-xs">B</span>
            </div>
            <span className="text-sm font-semibold text-foreground">Bcas</span>
          </div>

          <div className="flex-1 px-4 md:px-6">
            <span className="text-sm font-medium text-foreground">
              Alta de usuarios
            </span>
          </div>
        </header>

        <div className="flex flex-1">
          {/* Desktop Sidebar */}
          <aside className="hidden md:flex w-[220px] bg-card border-r border-border flex-col shrink-0">
            <SidebarContent onLogout={handleLogout} />
          </aside>

          {/* Main content */}
          <main className="flex-1 bg-bcas-bg overflow-auto p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
