import { NextResponse } from "next/server";
import { localStudents } from "../data.js";


export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const index = localStudents.findIndex((s) => String(s.id) === String(id));
    if (index === -1) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    localStudents[index] = { ...localStudents[index], ...body };
    return NextResponse.json({ message: "Updated", data: localStudents[index] });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}


export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const index = localStudents.findIndex((s) => String(s.id) === String(id));

    if (index === -1) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    localStudents.splice(index, 1);
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
