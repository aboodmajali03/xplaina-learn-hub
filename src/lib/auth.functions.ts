import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().trim().min(1).max(60),
  password: z.string().min(1).max(200),
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data) => loginSchema.parse(data))
  .handler(async ({ data }) => {
    const { getAdminSession, matches } = await import("./admin-session.server");
    const user = process.env["ADMIN_USERNAME"] ?? "";
    const pass = process.env["ADMIN_PASSWORD"] ?? "";
    if (!user || !pass) return { ok: false as const };
    if (!matches(data.username, user) || !matches(data.password, pass)) {
      return { ok: false as const };
    }
    const session = await getAdminSession();
    await session.update({ admin: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { getAdminSession } = await import("./admin-session.server");
  const session = await getAdminSession();
  await session.clear();
  return { ok: true as const };
});

export const adminSessionStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { getAdminSession } = await import("./admin-session.server");
  const session = await getAdminSession();
  return { admin: session.data.admin === true };
});

/** Binds the account to a single device. Returns ok:false when it is already bound elsewhere. */
export const claimDevice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ deviceId: z.string().min(4).max(80) }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("device_id")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;
    if (!profile) return { ok: false as const, reason: "no_profile" as const };

    if (!profile.device_id) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ device_id: data.deviceId })
        .eq("id", userId);
      if (updateError) throw updateError;
      return { ok: true as const };
    }
    if (profile.device_id !== data.deviceId) {
      return { ok: false as const, reason: "other_device" as const };
    }
    return { ok: true as const };
  });
