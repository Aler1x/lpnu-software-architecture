"use client"
import { cn } from '@/lib/utils'
import { useState } from 'react'
import type { DiagramList } from '@/types/types'
import { fetchClient } from '@/lib/fetchClient'
import { useAuth } from '@clerk/nextjs'
import Diagram from './diagram'
import CreateDialog from './create-dialog'
import { Input } from '../ui/input'
import DeleteDialog from './delete-dialog'

export type DiagramListProps = {
  diagrams: DiagramList[];
}

export default function DiagramsList({ diagrams: initialDiagrams }: DiagramListProps) {
  const [diagrams, setDiagrams] = useState<DiagramList[]>(initialDiagrams);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const { getToken } = useAuth();

  const fetchDiagrams = async () => {
    const token = await getToken();
    if (!token) {
      return;
    }
    const fetchedDiagrams = await fetchClient<DiagramList[]>('/api/diagrams', token, 'GET');
    setDiagrams(fetchedDiagrams);
  };

  const filteredDiagrams = diagrams.filter(diagram =>
    diagram.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    try {
      const token = await getToken();
      if (!token) {
        return;
      }
      await fetchClient(`api/diagrams/${deleteId}`, token, 'DELETE');
      await fetchDiagrams();
    } catch (error) {
      console.error(error)
    } finally {
      setIsOpen(false)
      setDeleteId('')
    }
  }

  const openDelete = (id: string) => {
    setDeleteId(id)
    setIsOpen(true)
  };

  return (
    <main className={cn('container mx-auto px-4 flex flex-1 flex-col')}>
      <div className={cn('w-[400px] mx-auto my-4')}>
        <Input placeholder="Search diagrams..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      {filteredDiagrams.length === 0 && (
        <div className={cn('container flex items-center justify-center flex-1')}>
          <p>No diagrams yet</p>
        </div>
      )}

      <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4')}>
        {filteredDiagrams.length > 0 &&
          filteredDiagrams.map((diagram) => <Diagram key={diagram._id} diagram={diagram} onDelete={openDelete}/>)
        }
      </div>
      <DeleteDialog isOpen={isOpen} setIsOpen={setIsOpen} onDiagramDeleted={handleDelete} />
      <div className={cn('absolute bottom-10 right-10')}>
        <CreateDialog onDiagramCreated={fetchDiagrams} />
      </div>
    </main>
  )
}
