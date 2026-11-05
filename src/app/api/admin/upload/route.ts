import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { put } from "@vercel/blob";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const ALLOWED_TYPES = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "لم يتم إرفاق ملف" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "نوع الملف غير مدعوم. الأنواع المسموحة: JPG, PNG, WebP, AVIF" },
      { status: 400 },
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "حجم الصورة يتجاوز 5 ميجابايت" },
      { status: 400 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    // Decode the actual file instead of trusting the client-supplied MIME type.
    const image = sharp(buffer, { failOn: "error" });
    const metadata = await image.metadata();
    if (!metadata.format || !["jpeg", "png", "webp", "avif"].includes(metadata.format)) {
      return NextResponse.json({ error: "محتوى الصورة غير مدعوم" }, { status: 400 });
    }

    // Optimize: fix orientation, cap dimensions, convert to WebP
    const optimized = await image
      .rotate()
      .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.webp`;

    let publicPath: string;
    if (useBlob) {
      // Production (Vercel): store in Blob storage
      const blob = await put(`uploads/${filename}`, optimized, {
        access: "public",
        contentType: "image/webp",
      });
      publicPath = blob.url;
    } else {
      // Local development: store in public/uploads
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });
      await writeFile(path.join(uploadsDir, filename), optimized);
      publicPath = `/uploads/${filename}`;
    }

    await db.media.create({
      data: {
        filename: file.name,
        path: publicPath,
        mime: "image/webp",
        size: optimized.length,
      },
    });

    return NextResponse.json({ path: publicPath });
  } catch {
    return NextResponse.json(
      { error: "فشل معالجة الصورة" },
      { status: 500 },
    );
  }
}
