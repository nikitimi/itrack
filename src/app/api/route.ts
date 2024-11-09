import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log({ fromApi: request.headers.get('x-pathname') });
  return NextResponse.json('Hello world');
}
