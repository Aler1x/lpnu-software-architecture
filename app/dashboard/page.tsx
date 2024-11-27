import { cn } from '@/lib/utils'
import { fetchServer } from '@/lib/fetchServer'
import type { DiagramList } from '@/types/types'
import Header from '@/components/header'
import DiagramsList from '@/components/dashboard/diagrams-list';

export default async function Dashboard() {
  const diagrams = await fetchServer('api/diagrams') satisfies DiagramList[];

  return (
    <div className={cn('min-h-dvh flex flex-col')}>
      <Header />
      <DiagramsList diagrams={diagrams} />
    </div>
  )
}
