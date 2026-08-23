import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import path from "path";
import { requireTeacher } from "@/lib/auth/guards";
import { storage } from "@/lib/storage";
import { toErrorResponse } from "@/lib/api/errors";

const ALLOWED_MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

export async function POST(request: NextRequest) {
  try {
    await requireTeacher();

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const ext = ALLOWED_MIME_TO_EXT[file.type];
    if (!ext) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = path.posix.join("entries", "tmp", `${randomUUID()}${ext}`);

    await storage.put({ key, data: buffer, contentType: file.type });
    const url = await storage.getUrl(key);

    return NextResponse.json({ key, url }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
