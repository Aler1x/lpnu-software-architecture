"use client"
import type { Message } from '@/types/types'
import { Input } from '../ui/input'
import MessageBubble from './message'
import { useState } from 'react'
import { Button } from '../ui/button'

type ChatProps = {
  messages: Message[]
  onMessageSend: (message: string) => void
  blockInput?: boolean
}

export default function Chat({ messages, onMessageSend, blockInput }: ChatProps) {
  const [message, setMessage] = useState('');

  const handleMessageSend = () => {
    onMessageSend(message)
    setMessage('')
  }

  return (
    <div className="flex flex-col gap-2 h-full relative">
      <div className="flex-grow overflow-y-auto gap-2 flex flex-col">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message.message} my={message.my} />
        ))}
      </div>
      <div className="sticky bottom-0 p-2 flex gap-2">
        <Input placeholder="Type your message..." className="w-full" value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button onClick={handleMessageSend} disabled={message.length === 0 || blockInput}>Send</Button>
      </div>
    </div>
  )
}
