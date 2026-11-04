import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * Authenticated attachment download — consultation attachments live in the
 * database and are only ever served to logged-in admin users.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const request = await db.consultationRequest.findUnique({
    where: { id },
    select: {
      attachmentName: true,
      attachmentMime: true,
      attachmentData: true,
    },
  });

  if (!request?.attachmentData || !request.attachmentName) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const bytes = new Uint8Array(request.attachmentData);
  // attachmentName is sanitized on upload (no path separators / control chars)
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": request.attachmentMime || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${request.attachmentName}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
