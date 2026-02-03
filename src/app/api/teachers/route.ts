import { NextResponse } from "next/server";
import { readTeachers, writeTeachers } from "@/lib/data";
import { randomUUID } from "crypto";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const teachers = await readTeachers();
  if (id) {
    const teacher = teachers.find((item) => item.id === id);
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }
    return NextResponse.json(teacher);
  }
  return NextResponse.json(teachers);
}

export async function POST(request: Request) {
  const body = await request.json();
  const teachers = await readTeachers();
  const newTeacher = {
    id: randomUUID(),
    name: String(body.name ?? ""),
    surname: String(body.surname ?? ""),
    email: String(body.email ?? "")
  };
  if (!newTeacher.name || !newTeacher.surname || !newTeacher.email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const nextTeachers = [...teachers, newTeacher];
  await writeTeachers(nextTeachers);
  return NextResponse.json(newTeacher, { status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const teachers = await readTeachers();
  const nextTeachers = teachers.filter((item) => item.id !== id);
  await writeTeachers(nextTeachers);
  return NextResponse.json({ ok: true });
}
