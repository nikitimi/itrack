import utapi from "@/server/utils/utapi";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const json = await request.json();
  const response = await utapi.deleteFiles(json.name);
  return NextResponse.json(response);
}
