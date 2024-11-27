import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import type { APIErrorResponse } from '@/types/types';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ message: 'Unauthorized' } satisfies APIErrorResponse, { status: 401 });

  try {
    const client = await clientPromise;
    const db = client.db('mermaid-app');
    const diagram = await db.collection('diagrams').findOne({ _id: new ObjectId(id as string), userId });
    if (!diagram) {
      return NextResponse.json({ message: 'Diagram not found' } satisfies APIErrorResponse, { status: 404 });
    }

    return NextResponse.json(diagram);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' } satisfies APIErrorResponse, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 });
  }

  const { userId } = getAuth(req);

  if (!userId) return NextResponse.json({ message: 'Unauthorized' } satisfies APIErrorResponse, { status: 401 });

  const data = await req.json();

  const updateFields: Record<string, string> = {};
  if (data.name) updateFields.name = data.name;
  if (data.description) updateFields.description = data.description;
  if (data.mermaidCode) updateFields.mermaidCode = data.mermaidCode;

  if (Object.keys(updateFields).length === 0) {
    return NextResponse.json({ message: 'No valid fields to update' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('mermaid-app');
    const diagram = await db
      .collection('diagrams')
      .findOneAndUpdate(
        { _id: new ObjectId(id as string), userId },
        { $set: updateFields },
        { returnDocument: 'after' }
      );
    if (!diagram) {
      return NextResponse.json({ message: 'Diagram not found' } satisfies APIErrorResponse, { status: 404 });
    }

    return NextResponse.json(diagram);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' } satisfies APIErrorResponse, { status: 500 });
  }
}
