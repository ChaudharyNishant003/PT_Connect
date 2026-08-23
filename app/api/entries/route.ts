import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireTeacher } from "@/lib/auth/guards";
import { scopeWhere } from "@/lib/db/scope";
import { createEntrySchema, listEntriesQuerySchema } from "@/lib/validation/entries";
import { toErrorResponse } from "@/lib/api/errors";

export async function GET(request: NextRequest) {
  try {
    const session = await requireTeacher();
    const query = listEntriesQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams));

    const students = await prisma.student.findMany({
      where: scopeWhere(session, query.studentId ? { id: query.studentId } : {}),
      select: { id: true },
    });
    const studentIds = students.map((s) => s.id);

    const entries = await prisma.entry.findMany({
      where: {
        studentId: { in: studentIds },
        ...(query.subjectId ? { subjectId: query.subjectId } : {}),
        ...(query.type ? { type: query.type } : {}),
      },
      include: { photos: { orderBy: { sortOrder: "asc" } }, subject: true, student: { select: { name: true } } },
      orderBy: { entryDate: "desc" },
      take: query.take + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
    });

    const hasMore = entries.length > query.take;
    const page = hasMore ? entries.slice(0, query.take) : entries;

    return NextResponse.json({ entries: page, nextCursor: hasMore ? page[page.length - 1]?.id : null });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireTeacher();
    const body = createEntrySchema.parse(await request.json());

    const students = await prisma.student.findMany({
      where: scopeWhere(session, { id: { in: body.studentIds } }),
      include: { subjects: true },
    });

    if (students.length === 0) {
      return NextResponse.json({ error: "No valid students selected" }, { status: 400 });
    }

    const skippedStudentIds: string[] = [];
    const creations = students
      .map((student) => {
        const subject = student.subjects.find(
          (s) => s.name.toLowerCase() === body.subjectName.toLowerCase(),
        );
        if (!subject) {
          skippedStudentIds.push(student.id);
          return null;
        }
        return { student, subject };
      })
      .filter((v): v is { student: (typeof students)[number]; subject: (typeof students)[number]["subjects"][number] } => v !== null);

    if (creations.length === 0) {
      return NextResponse.json(
        { error: "None of the selected students have that subject configured" },
        { status: 400 },
      );
    }

    const entries = await prisma.$transaction(
      creations.map(({ student, subject }) =>
        prisma.entry.create({
          data: {
            orgId: session.orgId,
            studentId: student.id,
            subjectId: subject.id,
            teacherId: session.sub,
            type: body.type,
            dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
            caption: body.caption,
            photos: {
              create: body.photoKeys.map((key, index) => ({ url: key, sortOrder: index })),
            },
          },
          include: { photos: true, subject: true },
        }),
      ),
    );

    return NextResponse.json({ entries, skippedStudentIds }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
