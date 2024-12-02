import { cn } from '@/lib/utils'
import type { Message } from '@/types/types'

export default function MessageBubble({ message, my }: Message) {
  return (
    <div className={cn(
      'border border-[rgba(255, 255, 255, 0.2)] rounded-2xl p-2 ' +
      (my ? 'rounded-br-none' : 'rounded-bl-none')
    )}>
      <p className={cn('text-base text-white p-2')}>
        {message}
      </p>
    </div>
  )
}
