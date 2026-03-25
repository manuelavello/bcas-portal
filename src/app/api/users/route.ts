import { NextRequest, NextResponse } from "next/server";
import { bulkCreateUsers } from "@/lib/bcas-client";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("bcas_token")?.value;
    const session = cookieStore.get("bcas_session")?.value;

    if (!token || !session) {
      return NextResponse.json(
        { error: "No autenticado. Inicia sesión primero." },
        { status: 401 }
      );
    }

    const { users } = await request.json();

    if (!users || !Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { error: "Se requiere un array de usuarios" },
        { status: 400 }
      );
    }

    const results = await bulkCreateUsers(token, session, users);

    return NextResponse.json(results);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al crear usuarios";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
