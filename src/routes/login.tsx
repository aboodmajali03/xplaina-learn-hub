import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { GraduationCap, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { adminLogin, claimDevice } from "@/lib/auth.functions";
import { getDeviceId } from "@/lib/device";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const EMAIL_DOMAIN = "xplaina.app";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | XPLAINA" },
      {
        name: "description",
        content: "صفحة الدخول الموحدة لمنصة XPLAINA للطلاب وإدارة المنصة.",
      },
      { property: "og:title", content: "تسجيل الدخول | XPLAINA" },
      { property: "og:description", content: "أدخل اسم المستخدم وكلمة المرور للوصول إلى محاضراتك." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const doAdminLogin = useServerFn(adminLogin);
  const doClaimDevice = useServerFn(claimDevice);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const user = username.trim();
    if (!user || !password) {
      toast.error("يرجى إدخال اسم المستخدم وكلمة المرور.");
      return;
    }
    setLoading(true);
    try {
      // Admin path first: unified form, admin credentials are verified server-side.
      const admin = await doAdminLogin({ data: { username: user, password } });
      if (admin.ok) {
        toast.success("مرحباً بك في لوحة التحكم.");
        await navigate({ to: "/admin" });
        return;
      }

      const email = user.includes("@") ? user : `${user.toLowerCase()}@${EMAIL_DOMAIN}`;
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error("اسم المستخدم أو كلمة المرور غير صحيحة.");
        return;
      }

      const device = await doClaimDevice({ data: { deviceId: getDeviceId() } });
      if (!device.ok) {
        await supabase.auth.signOut();
        toast.error(
          device.reason === "other_device"
            ? "هذا الحساب مرتبط بجهاز آخر. تواصل مع الإدارة لفك الارتباط."
            : "لا يوجد ملف طالب مرتبط بهذا الحساب.",
        );
        return;
      }

      toast.success("تم تسجيل الدخول بنجاح.");
      await navigate({ to: "/my" });
    } catch (error) {
      console.error(error);
      toast.error("تعذر إكمال تسجيل الدخول، حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between gradient-hero p-12 text-primary-foreground lg:flex">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold">
          <span className="grid size-9 place-items-center rounded-xl bg-primary-foreground/15">
            <GraduationCap className="size-5" />
          </span>
          XPLAINA
        </Link>
        <div>
          <h2 className="text-4xl font-extrabold leading-snug">
            محاضراتك الجامعية
            <br />
            في مكان واحد
          </h2>
          <p className="mt-4 max-w-md text-primary-foreground/85">
            سجّل الدخول لمتابعة المواد المفعّلة على حسابك، والاستمرار من نقطة توقفك بالضبط.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/70">الحسابات تُصدر من إدارة المنصة فقط.</p>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
            <CardDescription>
              الدخول الموحد للطلاب والإدارة باسم المستخدم وكلمة المرور.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  maxLength={60}
                  dir="ltr"
                  placeholder="xp123456"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  maxLength={200}
                  dir="ltr"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="me-2 size-4 animate-spin" />}
                دخول
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                لا تملك حساباً؟ التسجيل الذاتي غير متاح — تواصل مع الإدارة لإصدار حسابك.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
