import clientPromise from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import type { APIErrorResponse } from '@/types/types';

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) return NextResponse.json({ message: 'Unauthorized' } satisfies APIErrorResponse, { status: 401 });

  try {
    const client = await clientPromise;
    const db = client.db('mermaid-app');
    const diagrams = await db.collection('diagrams').find({ userId }).toArray();
    return NextResponse.json(diagrams);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' } satisfies APIErrorResponse, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) return NextResponse.json({ message: 'Unauthorized' } satisfies APIErrorResponse, { status: 401 });

  const data = await req.json();

  if (!data.name) {
    return NextResponse.json({ message: 'Invalid request body' } satisfies APIErrorResponse, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('mermaid-app');
    const diagram = await db.collection('diagrams').insertOne({
      userId,
      name: data.name,
      description: data.description || '',
      mermaidCode: '',
    });
    return NextResponse.json(diagram);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' } satisfies APIErrorResponse, { status: 500 });
  }
}
