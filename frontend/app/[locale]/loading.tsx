import KumbhLoader from '@/components/ui/KumbhLoader';

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-white"
      aria-label="Loading Yatriva"
    >
      <div className="p-6 max-w-sm w-full flex flex-col items-center justify-center">
        <KumbhLoader
          size="fullscreen"
          text="YATRIVA"
          subtext="Nashik Kumbh Mela 2027"
        />
      </div>
    </div>
  );
}
