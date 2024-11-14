import { NextApiRequest } from 'next';
import clientPromise from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest) {
  const { userId } = getAuth(req);

  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const client = await clientPromise;
    const db = client.db('mermaid-app');
    const diagrams = await db.collection('diagrams').find({ userId }).toArray();
    return NextResponse.json(diagrams);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextApiRequest) {
  const { userId } = getAuth(req);

  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const client = await clientPromise;
    const db = client.db('mermaid-app');
    const diagram = await db.collection('diagrams').insertOne({
      userId,
      name: req.body.name,
      description: req.body.description,
    });
    return NextResponse.json(diagram);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
