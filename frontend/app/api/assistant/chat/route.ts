import { NextResponse } from 'next/server';
import { askGeminiRealtime } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, locale = 'en' } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const result = await askGeminiRealtime(message.trim(), locale);

    return NextResponse.json({
      reply: result.reply,
      sources: result.sources,
      sourceLinks: result.sourceLinks || [],
      images: result.images,
      isSafetyHandoff: result.isSafetyHandoff,
      locale,
      grounded: result.grounded ?? true,
      isGeneralKnowledge: result.isGeneralKnowledge ?? false,
    });
  } catch (error: any) {
    console.error('API assistant chat error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process AI chat query',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
