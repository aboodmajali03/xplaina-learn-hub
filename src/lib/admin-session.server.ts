import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

export type AdminSession = { admin?: boolean };

function config() {
  return {
    password: process.env["ADMIN_SESSION_SECRET"]!,
    name: "xplaina-admin",
    maxAge: 60 * 60 * 12,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

export function getAdminSession() {
  return useSession<AdminSession>(config());
}

export function matches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

export async function assertAdmin() {
  const session = await getAdminSession();
  if (!session.data.admin) throw new Error("UNAUTHORIZED_ADMIN");
  return session;
}
