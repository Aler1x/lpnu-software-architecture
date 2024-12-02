import clientPromise from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import type { APIErrorResponse } from '@/types/types';
import type { Diagram } from '@/types/types';

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) return NextResponse.json({ message: 'Unauthorized' } satisfies APIErrorResponse, { status: 401 });

  try {
    const client = await clientPromise;
    const db = client.db('mermaid-app');
    const diagrams = await db.collection('diagrams').find({ created_by: userId }).toArray();
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

  if (!data.title) {
    return NextResponse.json({ message: 'Invalid request body' } satisfies APIErrorResponse, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('mermaid-app');
    const diagram: Omit<Diagram, '_id'> = {
      title: data.title,
      description: data.description || '',
      type: '',
      mermaid_code: '',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: userId,
    };

    const result = await db.collection('diagrams').insertOne(diagram);
    const insertedDiagram = await db.collection('diagrams').findOne({ _id: result.insertedId });
    return NextResponse.json(insertedDiagram);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' } satisfies APIErrorResponse, { status: 500 });
  }
}
