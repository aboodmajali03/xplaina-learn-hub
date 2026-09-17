# XPLAINA Edu Hub

قم بإنشاء وتطوير موقع إلكتروني متكامل لمنصة تعليمية وتدريس حصص جامعية أونلاين باسم "XPLAINA".

### 1. الهوية والتصميم (UI/UX):
- اسم المنصة: XPLAINA.
- المظهر: تصميم حديث، مريح للعين، واحترافي موجه لطلاب الجامعة.
- ألوان المنصة: اعتمد اللون الأزرق (Blue) كبلتة ألوان أساسية (Primary Color)، مع ألوان متناسقة مثل الأبيض والأزرق الداكن للتباين.

### 2. المواد الدراسية المعروضة على المنصة:
أضف قسم للمواد الدراسية يحتوي على المواد التالية:
1. كالكولاس 1 (Calculus 1)
2. بحوث عمليات (Operations Research)
3. مبادئ الإحصاء والاحتمالات (Principles of Statistics & Probability)
4. تحليل حقيقي 1 (Real Analysis 1)
5. تحليل عددي 1 (Numerical Analysis 1)
6. نظرية الاحتمالات (Probability Theory)
7. الجبر الخطي (Linear Algebra)

### 3. نظام التسجيل والدخول الموحد (Unified Login System):
- صفحة تسجيل دخول موحدة للجميع (طلاب وأدمن):
  * يتكون النموذج من حقلين فقط: (اسم المستخدم / Username) و (كلمة المرور / Password).
- صلاحيات الأدمن (Admin Credential):
  * عند إدخال اسم المستخدم: XPLAINA
  * وكلمة المرور: majali2003
  * يتم توجيه المستخدم تلقائياً إلى "لوحة تحكم الأدمن" (Admin Dashboard).

### 4. لوحة تحكم الأدمن (Admin Dashboard):

 أ) إدارة المواد والفيديوهات والتنظيم:
- رفع الدروس ومقاطع الفيديو تحت كل مادة مخصصة (مثلاً: كالكولاس 1).
- ترتيب الفيديوهات تسلسلياً: إمكانية تنظيم وترتيب مقاطع الفيديو بحسب أولوية التنزيل (مثلاً: المحاضرة 1، المحاضرة 2...) مع إمكانية تعديل الترتيب (Drag & Drop أو إعادة الترقيم).
- إضافة عنوان، وصف، وملفات ملحقة (مثل PDF) لكل مقطع فيديو.

 ب) توليد وإدارة حسابات العملاء (Account Generation & Management):
- إيقاف التسجيل المباشر للزوار؛ الأدمن هو المصدر الوحيد لإصدار الحسابات.
- نموذج توليد حساب جديد (Generate New Account):
  1. يقوم الأدمن بإدخال بيانات الطالب الأساسية (الاسم، رقم الهاتف/الملاحظات).
  2. قائمة اختيار المواد (Multi-select Checkboxes): يحدد الأدمن المواد التي قام الطالب بشراؤها (مثل: كالكولاس 1 + الجبر الخطي).
  3. خيار "توليد تلقائي" (Generate): يُنشئ النظام تلقائياً رقم حساب فريد (Unique Account ID)، اسم مستخدم تلقائي، وكلمة مرور عشوائية مع خيار نسخ البيانات بنقرة زر لإرسالها للعميل.
- إضافة مواد لحساب قائم (Upgrade/Add Courses):
  * عند إدخال رقم حساب الطالب (Account ID)، يظهر ملفه الشخصي والمواد المفعّلة لديه حالياً.
  * يتيح للأدمن تحديد مواد جديدة وإضافتها لنفس الحساب فوراً.

### 6. الميزات الإضافية المطلوبة:
- ربط الأجهزة (Device Limit): تقييد فتح الحساب على جهاز واحد في نفس الوقت.
- مشغل فيديو احترافي (Video Player): يدعم التحكم بالسرعة، حفظ نقطة التوقف، وعرض نسبة إنجاز الطالب للمادة.
- التجاوب الكامل (Responsive Design): يعمل بكفاءة على جميع الشاشات.

المطلوب: قم بتقديم هيكل المشروع، الأكواد المصدريّة (Code Snippets)، والتقنيات المقترحة لبناء هذا النظام بالكامل.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1e43add9-e1a8-424a-b235-9f67e8e6e7bc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
