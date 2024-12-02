import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DiagramList } from '@/types/types';
import { Button } from '../ui/button';
import formatDate from '@/lib/formatDate';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type DiagramListProps = {
  diagram: DiagramList;
  onDelete: (id: string) => void;
}

export default function Diagram({ diagram, onDelete }: DiagramListProps) {
  return (
    <Card className={cn('flex flex-col justify-between')}>
      <CardHeader>
        <CardTitle className={cn('text-xl font-bold')}>{diagram.title}</CardTitle>
        <CardDescription>Type: {diagram.type}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{diagram.description}</p>
        <p className="text-sm text-muted-foreground">
          Last updated: {formatDate(diagram.updated_at)}
        </p>
      </CardContent>
      <CardFooter className={cn('flex justify-between items-center gap-2')}>
        <Button asChild className="w-full">
          <Link href={`edit/${diagram._id}`}>
            Edit Diagram
          </Link>
        </Button>
        <Button className="w-full" variant='destructive' onClick={() => onDelete(diagram._id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
