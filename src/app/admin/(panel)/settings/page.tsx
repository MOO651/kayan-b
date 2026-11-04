import { requireAdmin } from "@/lib/auth";
import {
  getBrand,
  getContact,
  getSocial,
  getHome,
  getAbout,
} from "@/lib/settings";
import {
  BrandSettingsForm,
  ContactSettingsForm,
  SocialSettingsForm,
  HomeSettingsForm,
  AboutSettingsForm,
} from "@/components/admin/SettingsForms";
import { OwnAccountForm } from "@/components/admin/OwnAccountForm";
import { PasswordForm } from "@/components/admin/UserForms";

export const dynamic = "force-dynamic";

export default async function SettingsAdminPage() {
  const user = await requireAdmin();
  const [brand, contact, social, home, about] = await Promise.all([
    getBrand(),
    getContact(),
    getSocial(),
    getHome(),
    getAbout(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-charcoal-900">
          إعدادات الموقع
        </h1>
        <p className="mt-1 text-sm text-charcoal-600">
          الهوية وبيانات التواصل ومحتوى الصفحة الرئيسية
        </p>
      </div>

      <section className="border border-charcoal-900/10 bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-charcoal-900">
          حسابي
        </h2>
        <p className="mt-1 text-sm text-charcoal-600">
          بيانات حسابك الشخصي وكلمة المرور الخاصة بك
        </p>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <OwnAccountForm user={{ id: user.id, name: user.name, email: user.email }} />
          <div className="border-t border-charcoal-900/10 pt-6 lg:border-t-0 lg:border-s lg:border-charcoal-900/10 lg:ps-8 lg:pt-0">
            <h3 className="text-sm font-semibold text-charcoal-900">
              تغيير كلمة المرور
            </h3>
            <p className="mt-1 text-xs text-charcoal-600">
              8 أحرف على الأقل. ننصح باستخدام كلمة مرور قوية.
            </p>
            <div className="mt-4">
              <PasswordForm userId={user.id} />
            </div>
          </div>
        </div>
      </section>

      <section className="border border-charcoal-900/10 bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-charcoal-900">
          الهوية والعلامة التجارية
        </h2>
        <p className="mt-1 text-sm text-charcoal-600">
          اسم العلامة والشعار كما يظهران في الترويسة والتذييل
        </p>
        <div className="mt-6">
          <BrandSettingsForm brand={brand} />
        </div>
      </section>

      <section className="border border-charcoal-900/10 bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-charcoal-900">
          بيانات التواصل
        </h2>
        <p className="mt-1 text-sm text-charcoal-600">
          تظهر في صفحة التواصل والتذييل. الحقول الفارغة لا تظهر على الموقع.
        </p>
        <div className="mt-6">
          <ContactSettingsForm contact={contact} />
        </div>
      </section>

      <section className="border border-charcoal-900/10 bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-charcoal-900">
          وسائل التواصل الاجتماعي
        </h2>
        <div className="mt-6">
          <SocialSettingsForm social={social} />
        </div>
      </section>

      <section className="border border-charcoal-900/10 bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-charcoal-900">
          الصفحة الرئيسية
        </h2>
        <p className="mt-1 text-sm text-charcoal-600">
          صورة ونصوص الواجهة الرئيسية والتحكم في ظهور الأقسام
        </p>
        <div className="mt-6">
          <HomeSettingsForm home={home} />
        </div>
      </section>

      <section className="border border-charcoal-900/10 bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-charcoal-900">
          صفحة «عن المكتب»
        </h2>
        <p className="mt-1 text-sm text-charcoal-600">
          نصوص وأرقام صفحة /about — الحقول الفارغة تستخدم النصوص الافتراضية
        </p>
        <div className="mt-6">
          <AboutSettingsForm about={about} />
        </div>
      </section>
    </div>
  );
}
