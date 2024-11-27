import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: 'Next.js',
    likes: "Cats",
    favoriteNumber: 69,
  });
}
    