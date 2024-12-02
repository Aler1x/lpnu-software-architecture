import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import type { APIErrorResponse } from '@/types/types';
import { getDiagramType } from '@/lib/identifyDiagramType';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ message: 'Unauthorized' } satisfies APIErrorResponse, { status: 401 });

  try {
    const client = await clientPromise;
    const db = client.db('mermaid-app');
    const diagram = await db.collection('diagrams').findOne({ _id: new ObjectId(id as string), created_by: userId });
    if (!diagram) {
      return NextResponse.json({ message: 'Diagram not found' } satisfies APIErrorResponse, { status: 404 });
    }

    return NextResponse.json(diagram);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' } satisfies APIErrorResponse, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  if (!id) {
    return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 });
  }

  const { userId } = getAuth(req);

  if (!userId) return NextResponse.json({ message: 'Unauthorized' } satisfies APIErrorResponse, { status: 401 });

  const { code } = await req.json();

  if (!code) {
    console.log(code);
    return NextResponse.json({ message: 'Invalid request body' } satisfies APIErrorResponse, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('mermaid-app');
    const diagram = await db
      .collection('diagrams')
      .findOneAndUpdate(
        { _id: new ObjectId(id as string), created_by: userId },
        { $set: { mermaid_code: code, type: getDiagramType(code), updated_at: new Date() } },
        { returnDocument: 'after' },
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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  if (!id) {
    return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 });
  }

  const { userId } = getAuth(req);

  if (!userId) return NextResponse.json({ message: 'Unauthorized' } satisfies APIErrorResponse, { status: 401 });

  try {
    const client = await clientPromise;
    const db = client.db('mermaid-app');
    const diagram = await db.collection('diagrams').findOneAndDelete({ _id: new ObjectId(id as string), created_by: userId });
    if (!diagram) {
      return NextResponse.json({ message: 'Diagram not found' } satisfies APIErrorResponse, { status: 404 });
    }

    return NextResponse.json(diagram);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' } satisfies APIErrorResponse, { status: 500 });
  }
}
