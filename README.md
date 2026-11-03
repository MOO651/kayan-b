# كيان باشميل — Kayan Bashmeel Law Firm

موقع مكتب محاماة واستشارات قانونية — ثنائي اللغة (عربي RTL / إنجليزي LTR) مع لوحة تحكم إدارية كاملة.

A premium bilingual (Arabic RTL / English LTR) law firm website with a full admin dashboard, built with Next.js App Router, TypeScript, Tailwind CSS v4, Prisma (SQLite), and next-intl.

## التشغيل — Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set up the database (creates SQLite file + seeds services & admin)
npm run db:setup

# 3. Run the development server
npm run dev
```

- الموقع: http://localhost:3000 (العربية) — http://localhost:3000/en (English)
- لوحة التحكم: http://localhost:3000/admin

### بيانات الدخول الافتراضية للوحة التحكم

```
Email:    admin@kayanbashmeel.com
Password: Admin@12345
```

> **مهم:** غيّر كلمة المرور فوراً بعد أول تسجيل دخول من صفحة «المستخدمون».
> يمكن ضبط بيانات الدخول الأولى عبر `ADMIN_EMAIL` و `ADMIN_PASSWORD` قبل تشغيل `db:seed`.

## Environment Variables

انسخ `.env.example` إلى `.env`:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Local: `file:./dev.db` (SQLite) — Production: Postgres connection string |
| `AUTH_SECRET` | Long random string used to sign admin sessions |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for SEO/canonical/sitemap (production) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token for image uploads (production only) |

## النشر على Vercel — Deployment

1. اربط الـ repository بمشروع Vercel جديد.
2. أضف **Vercel Postgres** (أو Neon) من تبويب Storage — سيضيف `DATABASE_URL` تلقائياً.
3. أضف **Vercel Blob** من تبويب Storage — سيضيف `BLOB_READ_WRITE_TOKEN` تلقائياً.
4. أضف `AUTH_SECRET` و `NEXT_PUBLIC_SITE_URL` من إعدادات Environment Variables.
5. النشر يشغّل `npm run db:deploy` تلقائياً (db push + seed) قبل `next build`.

> ملاحظة: `prisma/schema.prisma` مضبوط على PostgreSQL للإنتاج. للتطوير المحلي بـ SQLite، بدّل `provider` إلى `"sqlite"` مؤقتاً وشغّل `npm run db:setup`.

## Structure

```
src/
  app/
    [locale]/          # Public bilingual site (home, about, services, team,
                       # articles, consultation, contact, privacy, terms, 404)
    admin/             # Admin dashboard (login + protected panel)
    api/admin/upload/  # Authenticated image upload (sharp-optimized → WebP)
    sitemap.ts robots.ts
  components/          # layout / home / ui / forms / admin components
  i18n/                # next-intl routing, request config, navigation
  lib/                 # db (Prisma), auth (JWT session + scrypt), settings,
                       # validations (zod), server actions
  proxy.ts             # Locale routing + admin session guard
prisma/
  schema.prisma        # User, Service, Lawyer, Article, Category,
                       # ConsultationRequest, Setting, Media
  seed.ts              # 8 legal practice areas + default settings + admin
messages/              # ar.json / en.json UI translations
```

## Admin Dashboard

لوحة التحكم (`/admin`) تتيح:

- **لوحة معلومات**: إحصائيات وأحدث الطلبات
- **طلبات الاستشارة**: عرض وبحث وإدارة الحالة (جديد / قيد المتابعة / مغلق) وملاحظات داخلية
- **المجالات القانونية**: إضافة/تعديل/حذف/ترتيب/إخفاء — بمحتوى عربي وإنجليزي
- **فريق العمل**: إدارة المحامين والصور والسير والتخصصات
- **المقالات**: إنشاء وتحرير ونشر مع تصنيفات وإعدادات SEO
- **مكتبة الوسائط**: رفع الصور مع تحسين تلقائي (WebP)
- **إعدادات الموقع**: الهوية والشعار وبيانات التواصل ووسائل التواصل ومحتوى الرئيسية
- **المستخدمون** (للمدير فقط): حسابات وصلاحيات (مدير / محرر)

## Security

- Session JWT في cookie بـ `httpOnly` + `sameSite=lax` (8 ساعات)
- كلمات المرور مشفرة بـ scrypt
- حماية `/admin` عبر proxy + تحقق من الجلسة داخل كل server action
- تحديد معدل محاولات تسجيل الدخول (5 محاولات / 10 دقائق)
- تحقق من المدخلات بـ zod + honeypot ضد السبام في النماذج العامة
- طلبات الاستشارة لا تظهر إلا داخل لوحة التحكم المحمية

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm run db:push` | Sync Prisma schema to SQLite |
| `npm run db:seed` | Seed services, settings, admin user |
| `npm run db:setup` | db:push + db:seed |
