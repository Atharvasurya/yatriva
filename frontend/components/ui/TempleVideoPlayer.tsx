'use client';

import { Video, ExternalLink } from 'lucide-react';

interface TempleVideoPlayerProps {
  youtubeVideoId: string;
  templeName: string;
}

export default function TempleVideoPlayer({ youtubeVideoId, templeName }: TempleVideoPlayerProps) {
  if (!youtubeVideoId) return null;

  const watchUrl = `https://www.youtube.com/watch?v=${youtubeVideoId}`;

  return (
    <div className="space-y-3 pt-4 border-t border-slate-200">
      {/* Simple Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg">
          <Video className="h-5 w-5 text-slate-700 shrink-0" />
          <h2>Video Tour & Darshan</h2>
        </div>

        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <span>Watch on YouTube</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Clean Embedded Video Player */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?rel=0`}
          title={`Video Tour of ${templeName}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}
