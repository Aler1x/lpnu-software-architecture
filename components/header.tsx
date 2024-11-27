import { cn } from '@/lib/utils'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function Header() {
  return (
    <header className={cn('mx-auto px-6 py-3 flex items-center justify-between w-full sticky top-0 bg-background')}>
      <Link className="text-2xl font-bold" href="/dashboard">
        Mermaid Diagram Editor
      </Link>
      <UserButton />
    </header>
  )
}
