import KumbhLoader from '@/components/ui/KumbhLoader';

export default function Loading() {
  return (
    <div className="w-full min-h-[65vh] flex items-center justify-center p-6 animate-fade-up">
      <div className="max-w-sm w-full">
        <KumbhLoader
          size="fullscreen"
          text="YATRIVA"
          subtext="Nashik Kumbh Mela 2027"
        />
      </div>
    </div>
  );
}
