import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(_request: NextRequest, { params }: { params: { path: string[] } }) {
  const key = params.path.join("/");

  try {
    const { data, contentType } = await storage.read(key);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
