/**
 * nashikMonitorPlaces.ts
 *
 * Civic infrastructure dataset imported from Nashik Monitor (Kumbhathon Innovation Foundation).
 * Source: github.com/tanmayk1234/nashik-monitor-v2
 * License note: Raw factual geographic data from NTKMA, NMC RTI, and Google Places.
 * Attribution: Civic infrastructure data via Nashik Monitor, an initiative by Kumbhathon Innovation Foundation.
 */

import type { Place } from '@/types/place';
import rawPlaces from './nashikMonitorPlaces.json';

export const NASHIK_MONITOR_PLACES: Place[] = rawPlaces as unknown as Place[];
