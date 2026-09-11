CREATE TABLE public.courses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title_ar text NOT NULL,
  title_en text NOT NULL,
  description text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.courses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "courses_public_read" ON public.courses FOR SELECT USING (true);

CREATE TABLE public.profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  account_id text NOT NULL UNIQUE,
  username text NOT NULL UNIQUE,
  full_name text NOT NULL,
  phone text,
  notes text,
  device_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE TABLE public.enrollments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (profile_id, course_id)
);
GRANT SELECT ON public.enrollments TO authenticated;
GRANT ALL ON public.enrollments TO service_role;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "enrollments_select_own" ON public.enrollments FOR SELECT TO authenticated USING (auth.uid() = profile_id);

CREATE TABLE public.lessons (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  video_url text NOT NULL,
  attachment_url text,
  attachment_name text,
  duration_seconds integer,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.lessons TO authenticated;
GRANT ALL ON public.lessons TO service_role;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lessons_select_enrolled" ON public.lessons FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.enrollments e
  WHERE e.course_id = lessons.course_id AND e.profile_id = auth.uid()
));

CREATE TABLE public.lesson_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  position_seconds integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (profile_id, lesson_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_progress TO authenticated;
GRANT ALL ON public.lesson_progress TO service_role;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "progress_manage_own" ON public.lesson_progress FOR ALL TO authenticated
USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);

INSERT INTO public.courses (slug, title_ar, title_en, description, order_index) VALUES
  ('calculus-1', 'كالكولاس 1', 'Calculus 1', 'النهايات، الاشتقاق، التكامل وتطبيقاتها بشرح مبسط وأمثلة امتحانية.', 1),
  ('operations-research', 'بحوث عمليات', 'Operations Research', 'البرمجة الخطية، طريقة السمبلكس، مسائل النقل والتخصيص.', 2),
  ('statistics-probability', 'مبادئ الإحصاء والاحتمالات', 'Principles of Statistics & Probability', 'الإحصاء الوصفي، التوزيعات، فترات الثقة واختبار الفرضيات.', 3),
  ('real-analysis-1', 'تحليل حقيقي 1', 'Real Analysis 1', 'المتتاليات، النهايات، الاتصال والاشتقاق بصياغة برهانية.', 4),
  ('numerical-analysis-1', 'تحليل عددي 1', 'Numerical Analysis 1', 'حل المعادلات عددياً، الاستقراء، التكامل العددي والأخطاء.', 5),
  ('probability-theory', 'نظرية الاحتمالات', 'Probability Theory', 'المتغيرات العشوائية، التوقع، التوزيعات المشتركة والنظريات الحدية.', 6),
  ('linear-algebra', 'الجبر الخطي', 'Linear Algebra', 'المصفوفات، المحددات، الفضاءات المتجهة والقيم الذاتية.', 7);