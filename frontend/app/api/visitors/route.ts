import { NextResponse } from 'next/server';
import { getVisitorSnapshot, recordVisitorPing } from '@/lib/visitorTracker';

export const dynamic = 'force-dynamic';

export async function GET() {
  const snapshot = getVisitorSnapshot();
  return NextResponse.json(snapshot);
}

export async function POST(req: Request) {
  try {
    const text = await req.text();
    let body: any = {};
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        // ignore parse error
      }
    }
    const sessionId = body?.sessionId || `anon_${Math.random().toString(36).substring(2, 12)}`;
    const isNewSession = body?.isNewSession === true || body?.isNewSession === 'true';

    const result = recordVisitorPing(sessionId, isNewSession);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Visitor counter POST error:', error);
    return NextResponse.json(getVisitorSnapshot());
  }
}
