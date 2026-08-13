'use client';

import { Video, ExternalLink, Play } from 'lucide-react';

interface TempleVideoPlayerProps {
  youtubeVideoId: string;
  templeName: string;
}

export default function TempleVideoPlayer({ youtubeVideoId, templeName }: TempleVideoPlayerProps) {
  if (!youtubeVideoId) return null;

  return (
    <div className="space-y-3 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-rose-700 font-black text-lg sm:text-xl">
          <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
            <Video className="h-5 w-5 fill-rose-600 text-white" />
          </div>
          <h2>Virtual Video Tour & Pilgrimage Darshan</h2>
        </div>

        <a
          href={`https://www.youtube.com/watch?v=${youtubeVideoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 transition-colors"
        >
          <span>Watch on YouTube</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Embed Container */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-800 group">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?rel=0&modestbranding=1`}
          title={`Virtual Darshan of ${templeName}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
}
