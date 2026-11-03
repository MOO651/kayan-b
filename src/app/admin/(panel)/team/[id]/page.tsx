import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { LawyerForm } from "@/components/admin/LawyerForm";

export const dynamic = "force-dynamic";

export default async function EditLawyerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const lawyer = await db.lawyer.findUnique({ where: { id } });
  if (!lawyer) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-charcoal-900">
          تعديل: {lawyer.nameAr}
        </h1>
      </div>
      <LawyerForm lawyer={lawyer} />
    </div>
  );
}
