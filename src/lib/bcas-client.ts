const BCAS_API_URL = "https://s.bcasapp.com";

interface AuthResponse {
  token: string;
  session: string;
}

interface UserPayload {
  email: string;
  password: string;
  schoolAdmin: string;
}

interface UserResult {
  email: string;
  success: boolean;
  userId?: number;
  contactId?: string;
  firebaseUid?: string;
  error?: string;
}

interface BulkCreateResponse {
  results: UserResult[];
}

export async function authenticate(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${BCAS_API_URL}/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error de autenticación: ${text}`);
  }

  const data = await res.json();

  return {
    token: data.accessToken || "",
    session: data.sessionCookie || "",
  };
}

export async function bulkCreateUsers(
  token: string,
  session: string,
  users: UserPayload[]
): Promise<BulkCreateResponse> {
  const res = await fetch(`${BCAS_API_URL}/users/bulk-create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      Cookie: `session=${session}`,
    },
    body: JSON.stringify({
      users: users.map((u) => ({
        email: u.email,
        password: u.password,
        schoolAdminIds: u.schoolAdmin.split(",").map((id) => Number(id)),
      })),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error al crear usuarios: ${text}`);
  }

  return res.json();
}

export type { AuthResponse, UserPayload, UserResult, BulkCreateResponse };
