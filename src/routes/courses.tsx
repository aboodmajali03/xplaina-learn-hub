import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "المواد الدراسية | XPLAINA" },
      {
        name: "description",
        content:
          "كالكولاس 1، بحوث عمليات، مبادئ الإحصاء والاحتمالات، تحليل حقيقي، تحليل عددي، نظرية الاحتمالات والجبر الخطي.",
      },
      { property: "og:title", content: "المواد الدراسية | XPLAINA" },
      {
        property: "og:description",
        content: "سبع مواد جامعية بشرح مبسط ومحاضرات مرتبة تسلسلياً على منصة XPLAINA.",
      },
    ],
  }),
  component: CoursesPage,
});

export function useCoursesQuery() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, slug, title_ar, title_en, description, order_index")
        .order("order_index");
      if (error) throw error;
      return data;
    },
  });
}

function CoursesPage() {
  const { data, isLoading } = useCoursesQuery();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-extrabold sm:text-4xl">المواد الدراسية</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          كل مادة تحتوي على محاضرات مرتبة تسلسلياً مع ملفات مرفقة وتمارين محلولة. للوصول إلى
          المحاضرات يلزم حساب مُفعّل من إدارة المنصة.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
          {data?.map((course, index) => (
            <Card key={course.id} className="shadow-card transition-shadow hover:shadow-float">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                    <BookOpen className="size-5" />
                  </span>
                  <Badge variant="secondary">مادة {index + 1}</Badge>
                </div>
                <CardTitle className="mt-4 text-xl">{course.title_ar}</CardTitle>
                <CardDescription className="font-medium text-primary">
                  {course.title_en}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-muted-foreground">{course.description}</p>
                <Button asChild variant="secondary" size="sm">
                  <Link to="/login">ابدأ الدراسة</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
