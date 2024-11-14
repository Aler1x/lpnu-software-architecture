import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { DiagramList } from '@/types/types';

type DiagramListProps = {
  diagram: DiagramList;
}

export default function Diagram({ diagram }: DiagramListProps) {
  return (
    <Card>
      <CardHeader>{diagram.name}</CardHeader>
      <CardContent>{diagram.description}</CardContent>
    </Card>
  )
}
