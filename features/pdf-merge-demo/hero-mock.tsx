export function PdfMergeHeroMock() {
  return (
    <div className="surface-card flex h-[172px] w-full items-center overflow-hidden p-3">
      <div className="flex h-[146px] w-full flex-col rounded-[20px] border border-border/70 bg-background p-2.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="h-2 w-24 rounded-full bg-muted-foreground/18" />
          <div className="h-4 w-14 rounded-full bg-emerald-100" />
        </div>

        <div className="mt-2.5 grid flex-1 grid-cols-[0.85fr_1.15fr] gap-2.5">
          <div className="rounded-xl border border-border/70 bg-muted/30 p-2.5">
            <div className="h-1.5 w-14 rounded-full bg-muted-foreground/18" />
            <div className="mt-2 space-y-1.5">
              <div className="rounded-lg border border-primary/25 bg-primary/8 px-2 py-1.5">
                <div className="h-1.5 w-16 rounded-full bg-primary/30" />
              </div>
              <div className="rounded-lg bg-background px-2 py-1.5">
                <div className="h-1.5 w-12 rounded-full bg-foreground/12" />
              </div>
              <div className="rounded-lg bg-background px-2 py-1.5">
                <div className="h-1.5 w-14 rounded-full bg-foreground/12" />
              </div>
            </div>
          </div>

          <div className="relative h-[92px] self-center rounded-xl border border-border/70 bg-muted/25 p-2">
            <div className="absolute inset-x-4 top-3 h-3 rounded-full bg-primary/10" />
            <div className="animate-mock-file-top absolute left-5 right-7 top-8 z-10 rounded-lg border border-border/70 bg-background px-2 py-1 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.35)]">
              <div className="h-1.5 w-20 rounded-full bg-foreground/12" />
              <div className="mt-1 h-1 w-14 rounded-full bg-foreground/8" />
            </div>
            <div className="animate-mock-file-bottom absolute left-8 right-4 top-[58px] rounded-lg border border-primary/30 bg-primary/6 px-2 py-1">
              <div className="h-1.5 w-16 rounded-full bg-primary/25" />
              <div className="mt-1 h-1 w-20 rounded-full bg-primary/15" />
            </div>
            <div className="absolute bottom-2 left-3 right-3 h-1.5 overflow-hidden rounded-full bg-background">
              <div className="animate-mock-progress h-full w-2/3 rounded-full bg-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
