import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/bcas-client";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y password son requeridos" },
        { status: 400 }
      );
    }

    const { token, session } = await authenticate(email, password);

    const cookieStore = cookies();
    cookieStore.set("bcas_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    });
    cookieStore.set("bcas_session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error de autenticación";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete("bcas_token");
  cookieStore.delete("bcas_session");
  return NextResponse.json({ success: true });
}
