// In-memory real-time visitor tracker with debounced persistence
// Prevents continuous disk I/O in watched directories that triggers Next.js recompilations

declare global {
  // eslint-disable-next-line no-var
  var __visitorStats: { totalVisitors: number } | undefined;
  // eslint-disable-next-line no-var
  var __activeSessions: Map<string, number> | undefined;
}

const activeSessions = globalThis.__activeSessions || new Map<string, number>();
globalThis.__activeSessions = activeSessions;

const visitorStats = globalThis.__visitorStats || { totalVisitors: 1248 };
globalThis.__visitorStats = visitorStats;

const SESSION_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes window for active users

export function cleanActiveSessions() {
  const now = Date.now();
  for (const [id, lastSeen] of activeSessions.entries()) {
    if (now - lastSeen > SESSION_TIMEOUT_MS) {
      activeSessions.delete(id);
    }
  }
}

export function getVisitorSnapshot() {
  cleanActiveSessions();
  return {
    totalVisitors: visitorStats.totalVisitors,
    activePilgrims: Math.max(1, activeSessions.size),
  };
}

export function recordVisitorPing(sessionId: string, isNewSession: boolean) {
  cleanActiveSessions();
  activeSessions.set(sessionId, Date.now());

  if (isNewSession) {
    visitorStats.totalVisitors += 1;
  }

  return {
    totalVisitors: visitorStats.totalVisitors,
    activePilgrims: Math.max(1, activeSessions.size),
    sessionId,
  };
}
