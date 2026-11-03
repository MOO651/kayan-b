import { requireAdmin } from "@/lib/auth";
import {
  getBrand,
  getContact,
  getSocial,
  getHome,
} from "@/lib/settings";
import {
  BrandSettingsForm,
  ContactSettingsForm,
  SocialSettingsForm,
  HomeSettingsForm,
} from "@/components/admin/SettingsForms";

export const dynamic = "force-dynamic";

export default async function SettingsAdminPage() {
  await requireAdmin();
  const [brand, contact, social, home] = await Promise.all([
    getBrand(),
    getContact(),
    getSocial(),
    getHome(),
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
    </div>
  );
}
