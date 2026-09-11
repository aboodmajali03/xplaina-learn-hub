import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const EMAIL_DOMAIN = "xplaina.app";

async function admin() {
  const { assertAdmin } = await import("./admin-session.server");
  await assertAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

function randomDigits(n: number) {
  let out = "";
  for (let i = 0; i < n; i++) out += Math.floor(Math.random() * 10).toString();
  return out;
}

function randomPassword(len = 10) {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

/* ------------------------------- courses ------------------------------- */

export const adminListCourses = createServerFn({ method: "GET" }).handler(async () => {
  const db = await admin();
  const { data, error } = await db
    .from("courses")
    .select("id, slug, title_ar, title_en, order_index")
    .order("order_index");
  if (error) throw error;
  return data ?? [];
});

/* ------------------------------- lessons ------------------------------- */

export const adminListLessons = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ courseId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: rows, error } = await db
      .from("lessons")
      .select("*")
      .eq("course_id", data.courseId)
      .order("order_index");
    if (error) throw error;
    return rows ?? [];
  });

const lessonInput = z.object({
  courseId: z.string().uuid(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional().nullable(),
  videoUrl: z.string().trim().url().max(1000),
  attachmentUrl: z.string().trim().url().max(1000).optional().nullable().or(z.literal("")),
  attachmentName: z.string().trim().max(200).optional().nullable(),
  durationSeconds: z.number().int().min(0).max(200000).optional().nullable(),
});

export const adminCreateLesson = createServerFn({ method: "POST" })
  .inputValidator((d) => lessonInput.parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: last } = await db
      .from("lessons")
      .select("order_index")
      .eq("course_id", data.courseId)
      .order("order_index", { ascending: false })
      .limit(1);
    const nextIndex = (last?.[0]?.order_index ?? 0) + 1;
    const { error } = await db.from("lessons").insert({
      course_id: data.courseId,
      title: data.title,
      description: data.description || null,
      video_url: data.videoUrl,
      attachment_url: data.attachmentUrl || null,
      attachment_name: data.attachmentName || null,
      duration_seconds: data.durationSeconds ?? null,
      order_index: nextIndex,
    });
    if (error) throw error;
    return { ok: true as const };
  });

export const adminUpdateLesson = createServerFn({ method: "POST" })
  .inputValidator((d) => lessonInput.extend({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { error } = await db
      .from("lessons")
      .update({
        title: data.title,
        description: data.description || null,
        video_url: data.videoUrl,
        attachment_url: data.attachmentUrl || null,
        attachment_name: data.attachmentName || null,
        duration_seconds: data.durationSeconds ?? null,
      })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true as const };
  });

export const adminDeleteLesson = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { error } = await db.from("lessons").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true as const };
  });

export const adminReorderLessons = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ ids: z.array(z.string().uuid()).min(1).max(500) }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    for (let i = 0; i < data.ids.length; i++) {
      const { error } = await db
        .from("lessons")
        .update({ order_index: i + 1 })
        .eq("id", data.ids[i]!);
      if (error) throw error;
    }
    return { ok: true as const };
  });

/* ------------------------------- accounts ------------------------------ */

export const adminGenerateAccount = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        fullName: z.string().trim().min(2).max(120),
        phone: z.string().trim().max(40).optional().nullable(),
        notes: z.string().trim().max(1000).optional().nullable(),
        courseIds: z.array(z.string().uuid()).min(1).max(50),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const db = await admin();

    let accountId = "";
    for (let attempt = 0; attempt < 12; attempt++) {
      const candidate = `XP-${randomDigits(6)}`;
      const { data: existing } = await db
        .from("profiles")
        .select("id")
        .eq("account_id", candidate)
        .maybeSingle();
      if (!existing) {
        accountId = candidate;
        break;
      }
    }
    if (!accountId) throw new Error("تعذر توليد رقم حساب فريد، حاول مرة أخرى.");

    const username = accountId.replace("XP-", "xp").toLowerCase();
    const password = randomPassword(10);

    const { data: created, error: createError } = await db.auth.admin.createUser({
      email: `${username}@${EMAIL_DOMAIN}`,
      password,
      email_confirm: true,
      user_metadata: { full_name: data.fullName, username },
    });
    if (createError) throw createError;
    const userId = created.user!.id;

    const { error: profileError } = await db.from("profiles").insert({
      id: userId,
      account_id: accountId,
      username,
      full_name: data.fullName,
      phone: data.phone || null,
      notes: data.notes || null,
    });
    if (profileError) throw profileError;

    const { error: enrollError } = await db
      .from("enrollments")
      .insert(data.courseIds.map((c) => ({ profile_id: userId, course_id: c })));
    if (enrollError) throw enrollError;

    return { accountId, username, password };
  });

export const adminLookupAccount = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ accountId: z.string().trim().min(3).max(40) }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: profile, error } = await db
      .from("profiles")
      .select("id, account_id, username, full_name, phone, notes, device_id, created_at")
      .or(`account_id.eq.${data.accountId.toUpperCase()},username.eq.${data.accountId.toLowerCase()}`)
      .maybeSingle();
    if (error) throw error;
    if (!profile) return { found: false as const };

    const { data: enrollments } = await db
      .from("enrollments")
      .select("course_id, courses(title_ar)")
      .eq("profile_id", profile.id);

    return {
      found: true as const,
      profile,
      courses: (enrollments ?? []).map((e) => ({
        courseId: e.course_id,
        title: (e.courses as { title_ar: string } | null)?.title_ar ?? "",
      })),
    };
  });

export const adminAddCourses = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        profileId: z.string().uuid(),
        courseIds: z.array(z.string().uuid()).min(1).max(50),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const db = await admin();
    const { error } = await db
      .from("enrollments")
      .upsert(
        data.courseIds.map((c) => ({ profile_id: data.profileId, course_id: c })),
        { onConflict: "profile_id,course_id", ignoreDuplicates: true },
      );
    if (error) throw error;
    return { ok: true as const };
  });

export const adminRemoveCourse = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ profileId: z.string().uuid(), courseId: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data }) => {
    const db = await admin();
    const { error } = await db
      .from("enrollments")
      .delete()
      .eq("profile_id", data.profileId)
      .eq("course_id", data.courseId);
    if (error) throw error;
    return { ok: true as const };
  });

export const adminResetDevice = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ profileId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { error } = await db
      .from("profiles")
      .update({ device_id: null })
      .eq("id", data.profileId);
    if (error) throw error;
    return { ok: true as const };
  });

export const adminResetPassword = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ profileId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const password = randomPassword(10);
    const { error } = await db.auth.admin.updateUserById(data.profileId, { password });
    if (error) throw error;
    return { password };
  });

export const adminListStudents = createServerFn({ method: "GET" }).handler(async () => {
  const db = await admin();
  const { data, error } = await db
    .from("profiles")
    .select("id, account_id, username, full_name, phone, device_id, created_at, enrollments(course_id)")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw error;
  return (data ?? []).map((p) => ({
    id: p.id,
    accountId: p.account_id,
    username: p.username,
    fullName: p.full_name,
    phone: p.phone,
    deviceBound: Boolean(p.device_id),
    coursesCount: (p.enrollments as { course_id: string }[] | null)?.length ?? 0,
    createdAt: p.created_at,
  }));
});
