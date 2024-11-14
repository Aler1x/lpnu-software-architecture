import CreateDialog from '@/components/dashboard/create-dialog'
import { cn } from '@/lib/utils'
import { UserButton } from '@clerk/nextjs'
import { fetchServer } from '@/lib/fetchServer'
import type { DiagramList } from '@/types/types'
import Diagram from '@/components/dashboard/diagram'


export default async function Dashboard() {
  const diagrams = await fetchServer('api/diagrams') satisfies DiagramList[]

  return (
    <div className={cn('min-h-dvh flex flex-col')}>
      <header className={cn('mx-auto px-6 py-3 flex items-center justify-between w-full sticky top-0 bg-background')}>
        <p>Mermaid Diagram Editor</p>
        <UserButton />
      </header>

      <main className={cn('container mx-auto px-4 flex flex-1 flex-col')}>
        {diagrams.length === 0 && (
          <div className={cn('container flex items-center justify-center flex-1')}>
            <p>No diagrams yet</p>
          </div>
        )}
        {diagrams.length > 0 && 
          diagrams.map((diagram) => <Diagram key={diagram.id} diagram={diagram} />)
        }
        <div className={cn('absolute bottom-10 right-10')}>
          <CreateDialog />
        </div>
      </main>
    </div>
  )
}
