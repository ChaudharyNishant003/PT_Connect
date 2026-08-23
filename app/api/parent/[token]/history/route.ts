import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resolveParentToken } from "@/lib/parent/resolveToken";
import { storage } from "@/lib/storage";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
  const student = await resolveParentToken(params.token);
  if (!student) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const cursor = request.nextUrl.searchParams.get("cursor") ?? undefined;

  const entries = await prisma.entry.findMany({
    where: { studentId: student.id },
    include: { photos: { orderBy: { sortOrder: "asc" } }, subject: true },
    orderBy: { entryDate: "desc" },
    take: PAGE_SIZE + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = entries.length > PAGE_SIZE;
  const page = hasMore ? entries.slice(0, PAGE_SIZE) : entries;

  const withUrls = await Promise.all(
    page.map(async (entry) => ({
      ...entry,
      photos: await Promise.all(
        entry.photos.map(async (photo) => ({ ...photo, url: await storage.getUrl(photo.url) })),
      ),
    })),
  );

  return NextResponse.json({ entries: withUrls, nextCursor: hasMore ? page[page.length - 1]?.id : null });
}
