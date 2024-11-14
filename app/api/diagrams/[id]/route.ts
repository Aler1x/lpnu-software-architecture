import { NextApiRequest } from "next";
import clientPromise from '@/lib/db';
import { ObjectId } from "mongodb";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest) {
  const { id } = req.query;

  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const client = await clientPromise;
    const db = client.db("mermaid-app");
    const diagram = await db.collection("diagrams").findOne({ _id: new ObjectId(id as string), userId });
    if (!diagram) {
      return NextResponse.json({ message: 'Diagram not found' }, { status: 404 });
    }
  
    return NextResponse.json(diagram);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
