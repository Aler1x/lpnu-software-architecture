"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

type DeleteDiagramProps = {
  onDiagramDeleted: () => void
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function DeleteDialog({ onDiagramDeleted, isOpen, setIsOpen }: DeleteDiagramProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="min-w-[350px] w-[80dvw] max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Delete diagram</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this diagram?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant={'secondary'} onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button type="submit" variant={'destructive'} onClick={onDiagramDeleted}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
