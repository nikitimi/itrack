import utapi from "@/server/utils/utapi";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formdata = await request.formData();

  const files = formdata.getAll("files") as File[];
  if (files === undefined) return NextResponse.json("no file", { status: 400 });
  const response = await utapi.uploadFiles(files);

  return NextResponse.json(response);
}
