import { Message } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  console.log('POST request received');
  const { diagram, prompt, history } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- i hate typescript
  let messages: any[] = [
    { role: 'system', content: 'You are a helpful assistant that provides suggestions for Mermaid diagrams.' },
    { role: 'user', content: `Diagram:\n${diagram}\n\nPrompt: ${prompt}` },
  ];

  if (history) {
    messages = messages.concat(
      history.map((message: Message) => {
        if (message.my) {
          messages.push({ role: 'user', content: message.message });
        } else {
          messages.push({ role: 'assistant', content: message.message });
        }
      }),
    );
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [...messages],
    });

    const response = completion.choices[0].message.content;

    return NextResponse.json(response);
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}
