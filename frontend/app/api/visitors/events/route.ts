import { getVisitorSnapshot } from '@/lib/visitorTracker';

export const dynamic = 'force-dynamic';

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial data immediately
      const initial = getVisitorSnapshot();
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(initial)}\n\n`));

      // Keep connection alive with periodic snapshot updates
      const interval = setInterval(() => {
        try {
          const snapshot = getVisitorSnapshot();
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(snapshot)}\n\n`));
        } catch {
          clearInterval(interval);
        }
      }, 15000);

      // Clean up when connection closes
      return () => {
        clearInterval(interval);
      };
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
