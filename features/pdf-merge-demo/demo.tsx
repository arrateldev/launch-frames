import Link from 'next/link';
import {
  Aperture,
  ImageDown,
  MonitorSmartphone,
  WandSparkles
} from 'lucide-react';

const files = [
  { name: 'hero-dashboard', meta: 'Desktop - 1440 x 900' },
  { name: 'mobile-vault', meta: 'iPhone - 1290 x 2796' },
  { name: 'sync-settings', meta: 'Social - 1200 x 630' }
] as const;

export function PdfMergeDemo({ showPricingCta }: { showPricingCta: boolean }) {
  return (
    <div className="animate-enter-delay-2 surface-panel p-0">
      <div className="rounded-[24px] border border-border/70 bg-background p-5 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-border/70 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">LaunchFrames Studio</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              Store-ready screenshot packs
            </p>
          </div>
          {showPricingCta ? (
            <Link
              href="#pricing"
              className="rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/12"
            >
              Go Pro
            </Link>
          ) : null}
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_320px]">
          <div className="space-y-4">
            <div className="rounded-[22px] border border-dashed border-primary/30 bg-primary/5 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <MonitorSmartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Paste app URL
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Capture screens or upload screenshots as fallback
                    </p>
                  </div>
                </div>
                <div className="rounded-xl bg-background px-3 py-2 text-xs font-medium text-foreground shadow-sm">
                  Generate pack
                </div>
              </div>
            </div>

            <div className="rounded-[22px] border border-border/70 bg-muted/30 p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Launch scenes</p>
                <p className="text-xs text-muted-foreground">3 captures ready</p>
              </div>

              <div className="space-y-3">
                {files.map((file, index) => (
                  <div
                    key={file.name}
                    className={`flex items-center gap-3 rounded-2xl border px-3 py-3 ${
                      index === 1
                        ? 'border-primary/35 bg-primary/6'
                        : 'border-border/70 bg-background'
                    }`}
                  >
                    <div className="text-muted-foreground">
                      <Aperture className="h-4 w-4" />
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                      <ImageDown className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{file.meta}</p>
                    </div>
                    <div className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[22px] border border-border/70 bg-muted/25 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <WandSparkles className="h-4 w-4 text-primary" />
                Export
              </div>
              <div className="mt-4 rounded-2xl border border-border/70 bg-background p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      launchframes-pack.zip
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      6 PNGs - App Store, Google Play, Social
                    </p>
                  </div>
                  <div className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                    Ready
                  </div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[86%] rounded-full bg-primary" />
                </div>
              </div>
            </div>

            <div className="rounded-[22px] border border-border/70 bg-muted/25 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Usage</p>
                <span className="rounded-full border border-primary/20 bg-primary/8 px-2.5 py-1 text-[11px] font-medium text-primary">
                  Free
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Exports today</span>
                  <span className="font-medium text-foreground">2 / 5</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-background">
                  <div className="h-full w-2/5 rounded-full bg-primary" />
                </div>
                <div className="rounded-2xl border border-primary/20 bg-primary/6 px-3 py-3">
                  <p className="text-xs font-medium text-primary">
                    Go Pro for ZIP packs, saved scenes, and batch regeneration
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
