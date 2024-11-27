"use client"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { fetchClient } from '@/lib/fetchClient'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@clerk/nextjs'

type CreateDiagramProps = {
  onDiagramCreated: () => void
}

export default function CreateDialog({ onDiagramCreated }: CreateDiagramProps) {
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const { getToken } = useAuth();

  const createDiagram = async () => {
    const token = await getToken();
    if (!token) {
      return;
    }
    try {
      await fetchClient('api/diagrams', token, 'POST', {
        name,
        description,
      });
      setOpen(false);
      onDiagramCreated();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle />New Diagram
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[350px] w-[80dvw] max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create diagram</DialogTitle>
          <DialogDescription>
            Create a new diagram by entering a name and description.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 items-center">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              placeholder='My Diagram'
              className="col-span-3"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="description">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder='Mermaid app project'
              className="col-span-3"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={createDiagram} className='w-full' disabled={name.length === 0}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
