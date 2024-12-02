import { Message } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  // throw new Error('Invalid/Missing environment variable: "OPENAI_API_KEY"');
}

const openai = new OpenAI();

export async function POST(req: NextRequest) {
  console.log('POST request received');
  const { diagram, prompt, history } = await req.json();

  if (!diagram || !prompt) {
    return NextResponse.json({ error: 'Missing diagram or prompt' }, { status: 400 });
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
      messages: [
        ...messages,
      ],
    });

    const aiResponse = completion.choices[0].message;

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}
