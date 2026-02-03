import { NextResponse } from "next/server";
import { readSettings, writeSettings } from "@/lib/data";

export async function GET() {
  const settings = await readSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const settings = await readSettings();
  const nextSettings = {
    schoolName: String(body.schoolName ?? settings.schoolName),
    adminPassword: String(body.adminPassword ?? settings.adminPassword)
  };
  await writeSettings(nextSettings);
  return NextResponse.json(nextSettings);
}
