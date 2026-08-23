import { PrismaClient } from "@prisma/client";
import path from "path";
import { hashPassword } from "../lib/auth/password";
import { generateParentToken } from "../lib/auth/tokens";
import { createLocalFsDriver } from "../lib/storage/local-fs-driver";

const prisma = new PrismaClient();
const storage = createLocalFsDriver(path.resolve(process.env.STORAGE_LOCAL_ROOT ?? "./storage"));

// A tiny valid 1x1 JPEG, reused as placeholder photo content for seed entries.
const PLACEHOLDER_JPEG_BASE64 =
  "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

async function putPlaceholderPhoto(key: string) {
  const data = Buffer.from(PLACEHOLDER_JPEG_BASE64, "base64");
  await storage.put({ key, data, contentType: "image/jpeg" });
  return key;
}

async function main() {
  await prisma.organization.deleteMany({});

  const org = await prisma.organization.create({
    data: { name: "Sunrise Tuition Center", contactEmail: "hello@sunrise-tuition.example" },
  });

  const passwordHash = await hashPassword("Passw0rd!");

  const owner = await prisma.teacher.create({
    data: { orgId: org.id, name: "Asha Verma", email: "owner@example.com", passwordHash, role: "OWNER" },
  });

  const teacher2 = await prisma.teacher.create({
    data: { orgId: org.id, name: "Rohit Sharma", email: "teacher2@example.com", passwordHash, role: "TEACHER" },
  });

  const today = new Date();
  today.setHours(9, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const links: string[] = [];

  async function createStudentWithEntries(params: {
    orgId: string;
    teacherId: string;
    name: string;
    grade: string;
    parentName: string;
    parentPhone: string;
    subjectNames: string[];
  }) {
    const student = await prisma.student.create({
      data: {
        orgId: params.orgId,
        teacherId: params.teacherId,
        name: params.name,
        grade: params.grade,
        parentName: params.parentName,
        parentPhone: params.parentPhone,
        subjects: { create: params.subjectNames.map((name, i) => ({ name, sortOrder: i })) },
      },
      include: { subjects: true },
    });

    const [subjectA, subjectB] = student.subjects;

    const photoKeyToday = await putPlaceholderPhoto(
      path.posix.join("entries", "seed", `${student.id}-today.jpg`),
    );
    const photoKeyYesterday = await putPlaceholderPhoto(
      path.posix.join("entries", "seed", `${student.id}-yesterday.jpg`),
    );

    await prisma.entry.create({
      data: {
        orgId: params.orgId,
        studentId: student.id,
        subjectId: subjectA.id,
        teacherId: params.teacherId,
        type: "CLASSWORK",
        entryDate: today,
        caption: "Covered fractions, page 12-14",
        photos: { create: [{ url: photoKeyToday, sortOrder: 0 }] },
      },
    });

    await prisma.entry.create({
      data: {
        orgId: params.orgId,
        studentId: student.id,
        subjectId: subjectB.id,
        teacherId: params.teacherId,
        type: "HOMEWORK",
        entryDate: today,
        dueDate: nextWeek,
        caption: "Exercise 3, questions 1-10",
        photos: { create: [{ url: photoKeyToday, sortOrder: 0 }] },
      },
    });

    await prisma.entry.create({
      data: {
        orgId: params.orgId,
        studentId: student.id,
        subjectId: subjectA.id,
        teacherId: params.teacherId,
        type: "TEST",
        entryDate: yesterday,
        dueDate: nextWeek,
        caption: "Unit test next week",
        photos: { create: [{ url: photoKeyYesterday, sortOrder: 0 }] },
      },
    });

    await prisma.entry.create({
      data: {
        orgId: params.orgId,
        studentId: student.id,
        subjectId: subjectB.id,
        teacherId: params.teacherId,
        type: "REVISION",
        entryDate: yesterday,
        caption: "Revise chapter 2 before next class",
        photos: { create: [{ url: photoKeyYesterday, sortOrder: 0 }] },
      },
    });

    const token = await prisma.parentAccessToken.create({
      data: { studentId: student.id, token: generateParentToken(), label: "Mom" },
    });

    links.push(`${student.name}: http://localhost:3000/p/${token.token}`);

    return student;
  }

  await createStudentWithEntries({
    orgId: org.id,
    teacherId: owner.id,
    name: "Aarav Mehta",
    grade: "Grade 6",
    parentName: "Priya Mehta",
    parentPhone: "+91-90000-00001",
    subjectNames: ["Math", "Science", "English"],
  });

  await createStudentWithEntries({
    orgId: org.id,
    teacherId: owner.id,
    name: "Diya Kapoor",
    grade: "Grade 8",
    parentName: "Sanjay Kapoor",
    parentPhone: "+91-90000-00002",
    subjectNames: ["Math", "Hindi", "Social Studies"],
  });

  await createStudentWithEntries({
    orgId: org.id,
    teacherId: teacher2.id,
    name: "Kabir Singh",
    grade: "Grade 5",
    parentName: "Neha Singh",
    parentPhone: "+91-90000-00003",
    subjectNames: ["Math", "English"],
  });

  console.log("\nSeed complete.\n");
  console.log("Owner login:   owner@example.com / Passw0rd!");
  console.log("Teacher login: teacher2@example.com / Passw0rd!\n");
  console.log("Parent dashboard links:");
  links.forEach((link) => console.log(`  ${link}`));
  console.log("");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
