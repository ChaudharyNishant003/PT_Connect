import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireTeacher } from "@/lib/auth/guards";
import { scopeWhere } from "@/lib/db/scope";
import { updateEntrySchema } from "@/lib/validation/entries";
import { toErrorResponse } from "@/lib/api/errors";
import { storage } from "@/lib/storage";

export async function GET(_request: NextRequest, { params }: { params: { entryId: string } }) {
  try {
    const session = await requireTeacher();
    const entry = await prisma.entry.findFirst({
      where: scopeWhere(session, { id: params.entryId }),
      include: { photos: { orderBy: { sortOrder: "asc" } }, subject: true, student: true },
    });
    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }
    return NextResponse.json({ entry });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { entryId: string } }) {
  try {
    const session = await requireTeacher();
    const body = updateEntrySchema.parse(await request.json());

    const existing = await prisma.entry.findFirst({
      where: scopeWhere(session, { id: params.entryId }),
      include: { photos: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    if (body.subjectId) {
      const subject = await prisma.subject.findFirst({
        where: { id: body.subjectId, studentId: existing.studentId },
      });
      if (!subject) {
        return NextResponse.json({ error: "Subject not found for this student" }, { status: 400 });
      }
    }

    if (body.removePhotoIds?.length) {
      const toRemove = existing.photos.filter((p) => body.removePhotoIds!.includes(p.id));
      await Promise.all(toRemove.map((p) => storage.delete(p.url)));
      await prisma.entryPhoto.deleteMany({ where: { id: { in: body.removePhotoIds } } });
    }

    if (body.addPhotoKeys?.length) {
      const currentMax = existing.photos.length;
      await prisma.entryPhoto.createMany({
        data: body.addPhotoKeys.map((key, index) => ({
          entryId: existing.id,
          url: key,
          sortOrder: currentMax + index,
        })),
      });
    }

    const entry = await prisma.entry.update({
      where: { id: existing.id },
      data: {
        subjectId: body.subjectId,
        type: body.type,
        dueDate: body.dueDate === undefined ? undefined : body.dueDate ? new Date(body.dueDate) : null,
        caption: body.caption,
      },
      include: { photos: { orderBy: { sortOrder: "asc" } }, subject: true },
    });

    return NextResponse.json({ entry });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { entryId: string } }) {
  try {
    const session = await requireTeacher();
    const existing = await prisma.entry.findFirst({
      where: scopeWhere(session, { id: params.entryId }),
      include: { photos: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    await Promise.all(existing.photos.map((p) => storage.delete(p.url)));
    await prisma.entry.delete({ where: { id: existing.id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
