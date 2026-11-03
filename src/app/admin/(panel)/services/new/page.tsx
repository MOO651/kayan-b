import { requireUser } from "@/lib/auth";
import { ServiceForm } from "@/components/admin/ServiceForm";

export const dynamic = "force-dynamic";

export default async function NewServicePage() {
  await requireUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-charcoal-900">
          إضافة مجال قانوني
        </h1>
        <p className="mt-1 text-sm text-charcoal-600">
          مجال جديد يظهر ضمن المجالات القانونية على الموقع
        </p>
      </div>
      <ServiceForm />
    </div>
  );
}
