import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Gauge, MonitorSmartphone, PlayCircle, ShieldCheck, Timer } from "lucide-react";

import heroImage from "@/assets/hero.jpg";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCoursesQuery } from "./courses";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "XPLAINA | شرح المواد الجامعية أونلاين" },
      {
        name: "description",
        content:
          "منصة XPLAINA لتدريس كالكولاس 1، بحوث عمليات، الإحصاء والاحتمالات، التحليل الحقيقي والعددي والجبر الخطي بمحاضرات مسجلة ومرتبة.",
      },
      { property: "og:title", content: "XPLAINA | شرح المواد الجامعية أونلاين" },
      {
        property: "og:description",
        content: "محاضرات مسجلة مرتبة تسلسلياً، ملفات مرفقة، ومتابعة نسبة إنجازك في كل مادة.",
      },
    ],
  }),
  component: Index,
});

const features = [
  {
    icon: PlayCircle,
    title: "محاضرات مرتبة تسلسلياً",
    body: "كل مادة مقسّمة إلى محاضرات بترتيب منطقي من الأساسيات حتى المسائل الامتحانية.",
  },
  {
    icon: Timer,
    title: "حفظ نقطة التوقف",
    body: "المشغّل يتذكر أين توقفت ويعيدك لنفس اللحظة، مع تحكم كامل بسرعة العرض.",
  },
  {
    icon: Gauge,
    title: "نسبة إنجاز واضحة",
    body: "تابع تقدمك في كل مادة بنسبة مئوية وعلامة إتمام لكل محاضرة.",
  },
  {
    icon: ShieldCheck,
    title: "حساب موثّق",
    body: "الحسابات تُصدر من الإدارة فقط، فلا مشاركة عشوائية ولا محتوى مسروق.",
  },
  {
    icon: MonitorSmartphone,
    title: "جهاز واحد لكل حساب",
    body: "يتم ربط الحساب بجهاز واحد للحفاظ على حقوق المحتوى وحقك كمشترك.",
  },
  {
    icon: BookOpen,
    title: "ملفات ومرفقات",
    body: "ملفات PDF وملخصات وأوراق عمل مرفقة مع كل محاضرة عند الحاجة.",
  },
];

function Index() {
  const { data: courses } = useCoursesQuery();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden gradient-hero text-primary-foreground">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
            <div>
              <Badge className="bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/20">
                منصة تعليمية جامعية
              </Badge>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
                افهم مواد الرياضيات والإحصاء
                <br />
                بأسلوب واضح ومباشر
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-primary-foreground/85">
                XPLAINA منصة متخصصة بشرح المواد الجامعية الصعبة: محاضرات مسجلة بجودة عالية، ترتيب
                تسلسلي للدروس، وملفات مرفقة تساعدك على النجاح بثقة.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="secondary">
                  <Link to="/login">دخول الطلاب</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link to="/courses">استعرض المواد</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="شاشة تعرض رسومات ومعادلات رياضية على منصة XPLAINA"
                className="w-full rounded-3xl shadow-float"
                loading="eager"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold">المواد المتوفرة</h2>
              <p className="mt-2 text-muted-foreground">سبع مواد أساسية يحتاجها طلبة الرياضيات والهندسة والإدارة.</p>
            </div>
            <Button asChild variant="ghost">
              <Link to="/courses">كل التفاصيل</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses?.map((course) => (
              <Card key={course.id} className="shadow-card">
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold">{course.title_ar}</h3>
                  <p className="mt-1 text-sm font-medium text-primary">{course.title_en}</p>
                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                    {course.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-card py-16">
          <div className="mx-auto w-full max-w-6xl px-4">
            <h2 className="text-3xl font-extrabold">لماذا XPLAINA؟</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-border/70 p-5">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                    <feature.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16">
          <div className="rounded-3xl gradient-hero px-6 py-12 text-center text-primary-foreground shadow-float sm:px-12">
            <h2 className="text-3xl font-extrabold">جاهز تبدأ؟</h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
              تواصل مع إدارة المنصة للحصول على حسابك مع المواد التي تحتاجها، ثم سجّل الدخول باسم
              المستخدم وكلمة المرور.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-6">
              <Link to="/login">تسجيل الدخول</Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
