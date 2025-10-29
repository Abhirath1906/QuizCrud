import { NextResponse } from "next/server";
import { localStudents } from "./data.js";

export async function GET() {
  try {
    const res = await fetch("https://course.summitglobal.id/students", {
      cache: "no-store",
    });
    const data = await res.json();

    const apiData = data?.body?.data || [];
    const all = [
      ...apiData,
      ...localStudents.map((s, i) => ({
        id: `local-${i + 1}`,
        ...s,
      })),
    ];

    return NextResponse.json({ body: { data: all }, statusCode: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newStudent = {
      ...body,
      id: `local-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    localStudents.push(newStudent);
    return NextResponse.json({ message: "Added", student: newStudent }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const index = localStudents.findIndex((s) => String(s.id) === String(id));

  if (index === -1)
    return NextResponse.json({ error: "Student not found" }, { status: 404 });

  localStudents.splice(index, 1);
  return NextResponse.json({ message: "Deleted" }, { status: 200 });
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const body = await request.json();

  const index = localStudents.findIndex((s) => String(s.id) === String(id));

  if (index === -1)
    return NextResponse.json({ error: "Student not found" }, { status: 404 });

  localStudents[index] = { ...localStudents[index], ...body };
  return NextResponse.json({ message: "Updated", data: localStudents[index] });
}
