import { requireUser } from "@/lib/auth";
import { LawyerForm } from "@/components/admin/LawyerForm";

export const dynamic = "force-dynamic";

export default async function NewLawyerPage() {
  await requireUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-charcoal-900">
          إضافة عضو للفريق
        </h1>
        <p className="mt-1 text-sm text-charcoal-600">
          أضف محامياً أو مستشاراً قانونياً لفريق العمل
        </p>
      </div>
      <LawyerForm />
    </div>
  );
}
