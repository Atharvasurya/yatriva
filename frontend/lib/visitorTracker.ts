import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';

// Global singleton event emitter & state
declare global {
  // eslint-disable-next-line no-var
  var __visitorEmitter: EventEmitter | undefined;
  // eslint-disable-next-line no-var
  var __activeSessions: Map<string, number> | undefined;
}

const emitter = globalThis.__visitorEmitter || new EventEmitter();
emitter.setMaxListeners(200);
globalThis.__visitorEmitter = emitter;

const activeSessions = globalThis.__activeSessions || new Map<string, number>();
globalThis.__activeSessions = activeSessions;

const SESSION_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes window for active users
const STATS_FILE = path.join(process.cwd(), 'data', 'visitor_stats.json');

export function getStoredStats(): { totalVisitors: number } {
  try {
    if (fs.existsSync(STATS_FILE)) {
      const data = fs.readFileSync(STATS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (typeof parsed.totalVisitors === 'number') {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading visitor stats:', err);
  }
  return { totalVisitors: 1 };
}

export function saveStoredStats(stats: { totalVisitors: number }) {
  try {
    const dir = path.dirname(STATS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving visitor stats:', err);
  }
}

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
  const stats = getStoredStats();
  return {
    totalVisitors: stats.totalVisitors,
    activePilgrims: Math.max(1, activeSessions.size),
  };
}

export function recordVisitorPing(sessionId: string, isNewSession: boolean) {
  cleanActiveSessions();
  activeSessions.set(sessionId, Date.now());

  let stats = getStoredStats();
  if (isNewSession) {
    stats.totalVisitors += 1;
    saveStoredStats(stats);
  }

  const snapshot = {
    totalVisitors: stats.totalVisitors,
    activePilgrims: Math.max(1, activeSessions.size),
    sessionId,
  };

  // Broadcast to all connected clients in real-time
  emitter.emit('update', snapshot);

  return snapshot;
}

export function subscribeToVisitorUpdates(callback: (data: { totalVisitors: number; activePilgrims: number }) => void) {
  emitter.on('update', callback);
  return () => {
    emitter.off('update', callback);
  };
}
