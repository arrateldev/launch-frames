'use client';

import { useMemo, useRef, useState, type PointerEvent } from 'react';
import {
  Aperture,
  ArrowUpLeft,
  Camera,
  Check,
  Crosshair,
  Download,
  ImageUp,
  Layers3,
  Link as LinkIcon,
  Monitor,
  Moon,
  Palette,
  Smartphone,
  Sparkles,
  Sun,
  Tablet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getMessages } from '@/lib/i18n/messages';
import { defaultLocale, type Locale } from '@/lib/i18n/config';

type Scene = {
  id: string;
  name: string;
  device: 'desktop' | 'phone' | 'tablet';
  headline: string;
  subline: string;
};

type PackId = 'social' | 'appStore' | 'googlePlay' | 'microsoft';
type TemplateId = 'clean' | 'contrast' | 'halo';
type CropState = {
  zoom: number;
  offsetX: number;
  offsetY: number;
};

type FrameState = {
  x: number;
  y: number;
  scale: number;
};

const packOptions = [
  { id: 'social', size: '1200 x 630', accent: 'Open Graph' },
  { id: 'appStore', size: '1290 x 2796', accent: 'iPhone' },
  { id: 'googlePlay', size: '1024 x 500', accent: 'Feature Graphic' },
  { id: 'microsoft', size: '1366 x 768', accent: 'Store Screenshot' }
] as const satisfies ReadonlyArray<{ id: PackId; size: string; accent: string }>;

const templateOptions = [
  { id: 'clean', label: 'Clean', icon: Sun },
  { id: 'contrast', label: 'Contrast', icon: Moon },
  { id: 'halo', label: 'Halo', icon: Sparkles }
] as const satisfies ReadonlyArray<{ id: TemplateId; label: string; icon: typeof Sun }>;

const initialScenes: Scene[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    device: 'desktop',
    headline: 'Launch your app with sharper visuals',
    subline: 'Turn real product screens into store-ready assets.'
  },
  {
    id: 'mobile',
    name: 'Mobile feature',
    device: 'phone',
    headline: 'Show the key workflow first',
    subline: 'Frame your best app moment for every store.'
  },
  {
    id: 'settings',
    name: 'Trust screen',
    device: 'tablet',
    headline: 'Regenerate every launch pack',
    subline: 'Keep assets consistent after each UI update.'
  }
];

const deviceIcons = {
  desktop: Monitor,
  phone: Smartphone,
  tablet: Tablet
};

export function LaunchFramesStudio({
  locale = defaultLocale
}: {
  locale?: Locale;
}) {
  const t = getMessages(locale).studio;
  const [sourceUrl, setSourceUrl] = useState('https://clavispass.github.io/ClavisPass/');
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [selectedPack, setSelectedPack] = useState<PackId>('social');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('clean');
  const [scenes, setScenes] = useState<Scene[]>(initialScenes);
  const [selectedSceneId, setSelectedSceneId] = useState(initialScenes[0].id);
  const [brandColor, setBrandColor] = useState('#787ff6');
  const [accentColor, setAccentColor] = useState('#69c4ff');
  const [crop, setCrop] = useState<CropState>({
    zoom: 1.15,
    offsetX: 0,
    offsetY: 0
  });
  const [frame, setFrame] = useState<FrameState>({
    x: 67,
    y: 46,
    scale: 1
  });
  const [captureState, setCaptureState] = useState<'idle' | 'capturing' | 'error'>('idle');
  const [exportState, setExportState] = useState<'idle' | 'exporting' | 'ready' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedScene = scenes.find((scene) => scene.id === selectedSceneId) ?? scenes[0];
  const selectedPackConfig =
    packOptions.find((pack) => pack.id === selectedPack) ?? packOptions[0];
  const normalizedSourceUrl = normalizeSourceUrl(sourceUrl);
  const canvasImage = uploadPreview ?? capturedPreview;

  const exportName = useMemo(
    () => `launchframes-${selectedPack}-${selectedScene.id}.png`,
    [selectedPack, selectedScene.id]
  );

  function updateScene(field: 'headline' | 'subline', value: string) {
    setScenes((current) =>
      current.map((scene) =>
        scene.id === selectedScene.id ? { ...scene, [field]: value } : scene
      )
    );
    setExportState('idle');
  }

  function handleUpload(file: File | undefined) {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadPreview(typeof reader.result === 'string' ? reader.result : null);
      setCapturedPreview(null);
      setExportState('idle');
    };
    reader.readAsDataURL(file);
  }

  async function captureCurrentUrl() {
    if (!normalizedSourceUrl) {
      setCaptureState('error');
      return null;
    }

    setCaptureState('capturing');
    setExportState('idle');

    try {
      const response = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: normalizedSourceUrl,
          device: selectedScene.device
        })
      });

      if (!response.ok) {
        throw new Error('Capture failed');
      }

      const blob = await response.blob();
      const dataUrl = await blobToDataUrl(blob);
      setCapturedPreview(dataUrl);
      setUploadPreview(null);
      setCaptureState('idle');
      return dataUrl;
    } catch {
      setCaptureState('error');
      return null;
    }
  }

  async function downloadCurrentPreview() {
    setExportState('exporting');

    try {
      const imageSource = canvasImage ?? (await captureCurrentUrl());
      const pngBlob = await renderPreviewPng({
        scene: selectedScene,
        template: selectedTemplate,
        brandColor,
        accentColor,
        frame,
        crop,
        imageSource
      });
      const url = URL.createObjectURL(pngBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = exportName;
      link.click();
      URL.revokeObjectURL(url);
      setExportState('ready');
    } catch {
      setExportState('error');
    }
  }

  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-border/60 bg-[linear-gradient(180deg,hsl(var(--background)),hsl(var(--secondary)))]">
        <div className="mx-auto w-full max-w-[1800px] px-3 py-5 sm:px-5 sm:py-6 2xl:px-8">
          <div className="grid gap-4 xl:grid-cols-[340px_minmax(720px,1fr)_320px] 2xl:grid-cols-[360px_minmax(860px,1fr)_340px]">
            <aside className="surface-card rounded-[22px] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {t.sourceEyebrow}
                  </p>
                  <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    {t.title}
                  </h1>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-primary/12 text-primary">
                  <Aperture className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-foreground">
                    {t.appUrl}
                  </span>
                  <div className="mt-2 flex gap-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-border/70 bg-background text-muted-foreground">
                      <LinkIcon className="h-4 w-4" />
                    </div>
                    <Input
                      value={sourceUrl}
                      onChange={(event) => {
                        setSourceUrl(event.target.value);
                        setCapturedPreview(null);
                        setExportState('idle');
                      }}
                      placeholder="https://your-app.com"
                      className="h-10"
                    />
                  </div>
                  <Button
                    type="button"
                    className="mt-2 w-full justify-start"
                    disabled={captureState === 'capturing'}
                    onClick={() => void captureCurrentUrl()}
                  >
                    <Camera className="h-4 w-4" />
                    {captureState === 'capturing' ? t.capturing : t.captureUrl}
                  </Button>
                  {captureState === 'error' ? (
                    <p className="mt-2 text-xs leading-5 text-destructive">
                      {t.captureError}
                    </p>
                  ) : null}
                </label>

                <div>
                  <span className="text-sm font-medium text-foreground">
                    {t.screenshot}
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleUpload(event.target.files?.[0])}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2 w-full justify-start"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageUp className="h-4 w-4" />
                    {canvasImage ? t.replaceScreenshot : t.uploadScreenshot}
                  </Button>
                  {canvasImage ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-1 w-full justify-start text-muted-foreground"
                      onClick={() => {
                        setUploadPreview(null);
                        setCapturedPreview(null);
                        setExportState('idle');
                      }}
                    >
                      {t.showLivePreview}
                    </Button>
                  ) : null}
                </div>

                <label className="block">
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Palette className="h-4 w-4 text-primary" />
                    {t.brandColor}
                  </span>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(event) => setBrandColor(event.target.value)}
                      aria-label={t.brandColor}
                      className="h-10 w-12 cursor-pointer rounded-[12px] border border-border/70 bg-background p-1"
                    />
                    <Input
                      value={brandColor}
                      onChange={(event) => setBrandColor(event.target.value)}
                      className="h-10 font-mono text-sm"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Palette className="h-4 w-4 text-brand-secondary" />
                    {t.accentColor}
                  </span>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(event) => setAccentColor(event.target.value)}
                      aria-label={t.accentColor}
                      className="h-10 w-12 cursor-pointer rounded-[12px] border border-border/70 bg-background p-1"
                    />
                    <Input
                      value={accentColor}
                      onChange={(event) => setAccentColor(event.target.value)}
                      className="h-10 font-mono text-sm"
                    />
                  </div>
                </label>

                <div className="rounded-[16px] border border-border/70 bg-secondary/45 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-foreground">
                      {t.frame}
                    </span>
                    <span className="rounded-[10px] bg-background px-2 py-1 text-xs font-semibold text-muted-foreground">
                      {t.exportScale}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full justify-start text-xs"
                    onClick={() => {
                      setFrame({ x: 67, y: 46, scale: 1 });
                      setExportState('idle');
                    }}
                  >
                    <Crosshair className="h-3.5 w-3.5" />
                    {t.resetFrame}
                  </Button>
                  <CanvasSlider
                    label={t.frameSize}
                    value={frame.scale}
                    min={0.65}
                    max={1.35}
                    step={0.01}
                    display={`${Math.round(frame.scale * 100)}%`}
                    onChange={(value) => {
                      setFrame((current) => ({ ...current, scale: value }));
                      setExportState('idle');
                    }}
                  />
                  <CanvasSlider
                    label={t.frameX}
                    value={frame.x}
                    min={35}
                    max={88}
                    step={1}
                    display={`${frame.x}`}
                    onChange={(value) => {
                      setFrame((current) => ({ ...current, x: value }));
                      setExportState('idle');
                    }}
                  />
                  <CanvasSlider
                    label={t.frameY}
                    value={frame.y}
                    min={22}
                    max={78}
                    step={1}
                    display={`${frame.y}`}
                    onChange={(value) => {
                      setFrame((current) => ({ ...current, y: value }));
                      setExportState('idle');
                    }}
                  />
                </div>

                <div className="rounded-[16px] border border-border/70 bg-secondary/45 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-foreground">
                      {t.canvas}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="px-2 text-xs"
                      onClick={() => {
                        setCrop({ zoom: 1, offsetX: 40, offsetY: 40 });
                        setExportState('idle');
                      }}
                    >
                      <ArrowUpLeft className="h-3.5 w-3.5" />
                      {t.topLeft}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="px-2 text-xs"
                      onClick={() => {
                        setCrop({ zoom: 1.15, offsetX: 0, offsetY: 0 });
                        setExportState('idle');
                      }}
                    >
                      <Crosshair className="h-3.5 w-3.5" />
                      {t.center}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="px-2 text-xs"
                      onClick={() => {
                        setCrop({ zoom: 1.45, offsetX: 0, offsetY: 0 });
                        setExportState('idle');
                      }}
                    >
                      <Aperture className="h-3.5 w-3.5" />
                      {t.closeUp}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full justify-start text-xs"
                    onClick={() => {
                      setCrop({ zoom: 1, offsetX: 0, offsetY: 0 });
                      setExportState('idle');
                    }}
                  >
                    <Crosshair className="h-3.5 w-3.5" />
                    {t.fitInFrame}
                  </Button>
                  <CanvasSlider
                    label={t.zoom}
                    value={crop.zoom}
                    min={0.5}
                    max={2.4}
                    step={0.05}
                    display={`${Math.round(crop.zoom * 100)}%`}
                    onChange={(value) => {
                      setCrop((current) => ({ ...current, zoom: value }));
                      setExportState('idle');
                    }}
                  />
                  <CanvasSlider
                    label={t.horizontal}
                    value={crop.offsetX}
                    min={-40}
                    max={40}
                    step={1}
                    display={`${crop.offsetX}`}
                    onChange={(value) => {
                      setCrop((current) => ({ ...current, offsetX: value }));
                      setExportState('idle');
                    }}
                  />
                  <CanvasSlider
                    label={t.vertical}
                    value={crop.offsetY}
                    min={-40}
                    max={40}
                    step={1}
                    display={`${crop.offsetY}`}
                    onChange={(value) => {
                      setCrop((current) => ({ ...current, offsetY: value }));
                      setExportState('idle');
                    }}
                  />
                </div>
              </div>
            </aside>

            <section className="surface-panel rounded-[24px] p-4 sm:p-5">
              <div className="flex flex-col gap-4 border-b border-border/70 pb-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {selectedPackConfig.accent}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-foreground">
                    {selectedScene.headline}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {templateOptions.map((template) => {
                    const Icon = template.icon;

                    return (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => setSelectedTemplate(template.id)}
                        className={cn(
                          'inline-flex h-9 items-center gap-2 rounded-[12px] border px-3 text-sm font-medium transition-colors',
                          selectedTemplate === template.id
                            ? 'border-primary/40 bg-primary/10 text-primary'
                            : 'border-border/70 bg-background text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {template.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-[18px] border border-border/70 bg-slate-950 p-3 shadow-[0_28px_70px_-48px_rgba(15,23,42,0.7)]">
                <PreviewCanvas
                  scene={selectedScene}
                  template={selectedTemplate}
                  brandColor={brandColor}
                  accentColor={accentColor}
                  sourceUrl={sourceUrl}
                  previewUrl={normalizedSourceUrl}
                  frame={frame}
                  onFrameChange={(nextFrame) => {
                    setFrame(nextFrame);
                    setExportState('idle');
                  }}
                  crop={crop}
                  uploadPreview={canvasImage}
                />
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-4">
                {packOptions.map((pack) => (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => {
                      setSelectedPack(pack.id);
                      setExportState('idle');
                    }}
                    className={cn(
                      'rounded-[16px] border p-3 text-left transition-colors',
                      selectedPack === pack.id
                        ? 'border-primary/45 bg-primary/10'
                        : 'border-border/70 bg-background hover:bg-secondary/70'
                    )}
                  >
                    <span className="text-sm font-semibold text-foreground">
                      {t.packs[pack.id]}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {pack.size}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <aside className="surface-card rounded-[22px] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {t.scenes}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-foreground">
                    {t.sceneEditor}
                  </h2>
                </div>
                <Layers3 className="h-5 w-5 text-primary" />
              </div>

              <div className="mt-4 space-y-2">
                {scenes.map((scene) => {
                  const Icon = deviceIcons[scene.device];

                  return (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => setSelectedSceneId(scene.id)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-[14px] border p-3 text-left transition-colors',
                        selectedSceneId === scene.id
                          ? 'border-primary/45 bg-primary/10'
                          : 'border-border/70 bg-background hover:bg-secondary/70'
                      )}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-secondary text-muted-foreground">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-foreground">
                          {scene.name}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {scene.headline}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-foreground">
                    {t.headline}
                  </span>
                  <Input
                    value={selectedScene.headline}
                    onChange={(event) => updateScene('headline', event.target.value)}
                    className="mt-2 h-10"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-foreground">
                    {t.subline}
                  </span>
                  <Input
                    value={selectedScene.subline}
                    onChange={(event) => updateScene('subline', event.target.value)}
                    className="mt-2 h-10"
                  />
                </label>
              </div>

              <div className="mt-5 rounded-[16px] border border-border/70 bg-secondary/50 p-3">
                <p className="text-sm font-semibold text-foreground">{t.output}</p>
                <p className="mt-1 break-all text-xs text-muted-foreground">
                  {exportName}
                </p>
                {exportState === 'ready' ? (
                  <p className="mt-3 flex items-center gap-2 text-xs font-medium text-emerald-700">
                    <Check className="h-4 w-4" />
                    {t.exportReady}
                  </p>
                ) : null}
                {exportState === 'error' ? (
                  <p className="mt-3 text-xs leading-5 text-destructive">
                    {t.exportError}
                  </p>
                ) : null}
              </div>

              <Button
                type="button"
                className="mt-4 w-full"
                disabled={exportState === 'exporting' || captureState === 'capturing'}
                onClick={() => void downloadCurrentPreview()}
              >
                <Download className="h-4 w-4" />
                {exportState === 'exporting' ? t.exporting : t.downloadPng}
              </Button>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function PreviewCanvas({
  scene,
  template,
  brandColor,
  accentColor,
  sourceUrl,
  previewUrl,
  frame,
  onFrameChange,
  crop,
  uploadPreview
}: {
  scene: Scene;
  template: TemplateId;
  brandColor: string;
  accentColor: string;
  sourceUrl: string;
  previewUrl: string | null;
  frame: FrameState;
  onFrameChange: (frame: FrameState) => void;
  crop: CropState;
  uploadPreview: string | null;
}) {
  const isContrast = template === 'contrast';
  const isHalo = template === 'halo';

  function handleFrameDrag(event: PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).dataset.resizeHandle) {
      return;
    }

    const canvas = event.currentTarget.parentElement;
    const rect = canvas?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    const canvasRect = rect;
    event.currentTarget.setPointerCapture(event.pointerId);
    const startX = event.clientX;
    const startY = event.clientY;
    const startFrame = frame;

    function moveFrame(moveEvent: globalThis.PointerEvent) {
      const nextX = startFrame.x + ((moveEvent.clientX - startX) / canvasRect.width) * 100;
      const nextY = startFrame.y + ((moveEvent.clientY - startY) / canvasRect.height) * 100;
      onFrameChange({
        ...startFrame,
        x: clamp(nextX, 30, 92),
        y: clamp(nextY, 16, 86)
      });
    }

    function stopFrameDrag() {
      window.removeEventListener('pointermove', moveFrame);
      window.removeEventListener('pointerup', stopFrameDrag);
    }

    window.addEventListener('pointermove', moveFrame);
    window.addEventListener('pointerup', stopFrameDrag);
  }

  function handleFrameResize(event: PointerEvent<HTMLButtonElement>) {
    event.stopPropagation();
    const startX = event.clientX;
    const startScale = frame.scale;

    function resizeFrame(moveEvent: globalThis.PointerEvent) {
      onFrameChange({
        ...frame,
        scale: clamp(startScale + (moveEvent.clientX - startX) / 360, 0.65, 1.35)
      });
    }

    function stopFrameResize() {
      window.removeEventListener('pointermove', resizeFrame);
      window.removeEventListener('pointerup', stopFrameResize);
    }

    window.addEventListener('pointermove', resizeFrame);
    window.addEventListener('pointerup', stopFrameResize);
  }

  return (
    <div
      className={cn(
        'relative aspect-[1200/630] min-h-[260px] overflow-hidden rounded-[14px] p-5 sm:p-8',
        isContrast ? 'bg-slate-950 text-white' : 'bg-white text-slate-950'
      )}
      style={{
        background: isContrast
          ? `radial-gradient(circle at 18% 18%, ${hexWithAlpha(brandColor, '4d')}, transparent 38%), radial-gradient(circle at 82% 24%, ${hexWithAlpha(accentColor, '42')}, transparent 34%), #09111f`
          : isHalo
            ? `radial-gradient(circle at 84% 18%, ${hexWithAlpha(brandColor, '1f')}, transparent 36%), radial-gradient(circle at 16% 82%, ${hexWithAlpha(accentColor, '1f')}, transparent 34%), #ffffff`
            : '#ffffff'
      }}
    >
      <div className="absolute left-8 top-1/2 z-10 w-[34%] -translate-y-1/2 sm:left-10">
        <div
          className="inline-flex items-center gap-2 rounded-[12px] px-3 py-2 text-xs font-semibold"
          style={{
            backgroundColor: `${brandColor}20`,
            color: isContrast ? '#ffffff' : brandColor
          }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          LaunchFrames
        </div>
        <h3 className="mt-5 text-2xl font-semibold leading-tight sm:text-4xl">
          {scene.headline}
        </h3>
        <p
          className={cn(
            'mt-8 text-sm leading-6 sm:text-base',
            isContrast ? 'text-slate-300' : 'text-slate-600'
          )}
        >
          {scene.subline}
        </p>
      </div>

      <div
        className={cn(
          'absolute z-20 cursor-move touch-none select-none',
          getFramePreviewSize(scene.device)
        )}
        onPointerDown={handleFrameDrag}
        style={{
          left: `${frame.x}%`,
          top: `${frame.y}%`,
          transform: `translate(-50%, -50%) scale(${frame.scale})`,
          transformOrigin: 'center'
        }}
      >
        <div
          className={cn(
            'relative flex h-full w-full items-center justify-center overflow-hidden rounded-[18px] border p-px shadow-[0_26px_70px_-50px_rgba(15,23,42,0.55)]',
            isContrast ? 'border-white/10 bg-white/8' : 'border-slate-200/45 bg-slate-950/80'
          )}
        >
          {uploadPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={uploadPreview}
              alt=""
              draggable={false}
              className="h-full w-full rounded-[13px] object-contain"
              style={{
                transform: `translate(${crop.offsetX}%, ${crop.offsetY}%) scale(${crop.zoom})`,
                transformOrigin: 'center'
              }}
            />
          ) : previewUrl ? (
            <LiveAppPreview
              key={`${previewUrl}-${scene.device}`}
              device={scene.device}
              sourceUrl={sourceUrl}
              previewUrl={previewUrl}
              crop={crop}
            />
          ) : (
            <div className="h-full w-full rounded-[13px] bg-slate-100 p-4">
              <div className="flex items-center justify-between">
                <div className="h-3 w-28 rounded-full bg-slate-300" />
                <div className="h-7 w-16 rounded-[10px]" style={{ backgroundColor: brandColor }} />
              </div>
              <div className="mt-5 grid h-[calc(100%-2.75rem)] grid-cols-[0.75fr_1fr] gap-3">
                <div className="rounded-[14px] bg-white p-3">
                  <div className="h-3 w-16 rounded-full bg-slate-200" />
                  <div className="mt-4 space-y-2">
                    <div className="h-8 rounded-[10px]" style={{ backgroundColor: `${brandColor}22` }} />
                    <div className="h-8 rounded-[10px] bg-slate-100" />
                    <div className="h-8 rounded-[10px] bg-slate-100" />
                  </div>
                </div>
                <div className="rounded-[14px] bg-white p-3">
                  <div className="h-24 rounded-[12px]" style={{ backgroundColor: `${brandColor}18` }} />
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="h-12 rounded-[10px] bg-slate-100" />
                    <div className="h-12 rounded-[10px] bg-slate-100" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            aria-label="Resize frame"
            data-resize-handle="true"
            onPointerDown={handleFrameResize}
            className="absolute bottom-2 right-2 h-5 w-5 cursor-nwse-resize rounded-[6px] border border-white/60 bg-black/35 shadow-sm"
          >
            <span className="sr-only">Resize frame</span>
          </button>
          </div>
        </div>
    </div>
  );
}

function LiveAppPreview({
  device,
  sourceUrl,
  previewUrl,
  crop
}: {
  device: Scene['device'];
  sourceUrl: string;
  previewUrl: string;
  crop: CropState;
}) {
  const viewport =
    device === 'phone'
      ? { width: 390, height: 844, scale: 0.66 }
      : device === 'tablet'
        ? { width: 820, height: 1180, scale: 0.46 }
        : { width: 1280, height: 800, scale: 0.52 };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[13px] bg-white">
      <iframe
        title={`${URLSafeHost(sourceUrl)} live preview`}
        src={previewUrl}
        className="absolute left-1/2 top-1/2 max-w-none border-0 bg-white"
        referrerPolicy="no-referrer"
        style={{
          width: viewport.width,
          height: viewport.height,
          transform: `translate(calc(-50% + ${crop.offsetX * 4}px), calc(-50% + ${crop.offsetY * 3}px)) scale(${viewport.scale * crop.zoom})`,
          transformOrigin: 'center'
        }}
      />
    </div>
  );
}

function getFramePreviewSize(device: Scene['device']) {
  if (device === 'phone') {
    return 'h-[78%] aspect-[9/18]';
  }

  if (device === 'tablet') {
    return 'h-[78%] aspect-[4/3]';
  }

  return 'w-[58%] aspect-[16/10]';
}

function CanvasSlider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="mt-3 block">
      <span className="flex items-center justify-between gap-3 text-xs font-medium text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono text-foreground">{display}</span>
      </span>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 h-2 w-full cursor-pointer accent-primary"
      />
    </label>
  );
}

function NewURLSafeHost(value: string) {
  try {
    return new URL(value).host;
  } catch {
    return value.replace(/^https?:\/\//, '').split('/')[0] || 'app.local';
  }
}

const URLSafeHost = NewURLSafeHost;

function normalizeSourceUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    return new URL(withProtocol).toString();
  } catch {
    return null;
  }
}

async function renderPreviewPng({
  scene,
  template,
  brandColor,
  accentColor,
  frame,
  crop,
  imageSource
}: {
  scene: Scene;
  template: TemplateId;
  brandColor: string;
  accentColor: string;
  frame: FrameState;
  crop: CropState;
  imageSource: string | null;
}) {
  const canvas = document.createElement('canvas');
  canvas.width = 2400;
  canvas.height = 1260;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas export is not available.');
  }

  const contrast = template === 'contrast';
  const halo = template === 'halo';
  const foreground = contrast ? '#ffffff' : '#0f172a';
  const muted = contrast ? '#cbd5e1' : '#475569';
  const background = contrast ? '#09111f' : '#ffffff';

  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);
  if (contrast || halo) {
    drawBlurredCircle(context, 430, 250, 440, 110, withAlpha(brandColor, contrast ? 0.34 : 0.1));
    drawBlurredCircle(context, 1900, 305, 390, 120, withAlpha(accentColor, contrast ? 0.18 : 0.08));
    drawBlurredCircle(context, 1690, 1040, 360, 120, withAlpha(brandColor, contrast ? 0.16 : 0.05));
  }

  roundRect(context, 160, 180, 380, 84, 28);
  context.fillStyle = withAlpha(brandColor, 0.16);
  context.fill();
  drawText(context, 'LaunchFrames', 208, 234, {
    color: foreground,
    size: 36,
    weight: 800
  });

  drawWrappedText(context, scene.headline, 164, 390, 820, 3, {
    color: foreground,
    size: 92,
    lineHeight: 104,
    weight: 850
  });
  drawWrappedText(context, scene.subline, 168, 740, 760, 2, {
    color: muted,
    size: 42,
    lineHeight: 58,
    weight: 500
  });
  const exportFrame = getExportFrame(scene.device, frame);
  context.save();
  context.shadowColor = 'rgba(2, 6, 23, 0.18)';
  context.shadowBlur = 52;
  context.shadowOffsetY = 36;
  roundRect(context, exportFrame.x, exportFrame.y, exportFrame.width, exportFrame.height, 48);
  context.fillStyle = contrast ? 'rgba(255,255,255,0.14)' : '#020617';
  context.fill();
  context.restore();

  const bezel = 3;
  const screen = {
    x: exportFrame.x + bezel,
    y: exportFrame.y + bezel,
    width: exportFrame.width - bezel * 2,
    height: exportFrame.height - bezel * 2
  };

  context.save();
  roundRect(context, screen.x, screen.y, screen.width, screen.height, 34);
  context.clip();

  if (imageSource) {
    const image = await loadImage(imageSource);
    drawCroppedImage(context, image, screen, crop);
  } else {
    drawMockScreen(context, screen, brandColor);
  }

  context.restore();

  roundRect(context, exportFrame.x, exportFrame.y, exportFrame.width, exportFrame.height, 48);
  context.strokeStyle = contrast ? 'rgba(255,255,255,0.10)' : 'rgba(226,232,240,0.52)';
  context.lineWidth = 2;
  context.stroke();

  return canvasToBlob(canvas);
}

function getExportFrame(device: Scene['device'], frame: FrameState) {
  const base =
    device === 'phone'
      ? { width: 430, height: 950 }
      : device === 'tablet'
        ? { width: 740, height: 940 }
        : { width: 1120, height: 700 };
  const width = base.width * frame.scale;
  const height = base.height * frame.scale;
  const centerX = (frame.x / 100) * 2400;
  const centerY = (frame.y / 100) * 1260;

  return {
    x: centerX - width / 2,
    y: centerY - height / 2,
    width,
    height
  };
}

function drawCroppedImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  screen: { x: number; y: number; width: number; height: number },
  crop: CropState
) {
  const baseScale = Math.min(screen.width / image.naturalWidth, screen.height / image.naturalHeight);
  const scale = baseScale * crop.zoom;
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  const maxMoveX = Math.max(0, (width - screen.width) / 2);
  const maxMoveY = Math.max(0, (height - screen.height) / 2);
  const x = screen.x + (screen.width - width) / 2 + (crop.offsetX / 40) * maxMoveX;
  const y = screen.y + (screen.height - height) / 2 + (crop.offsetY / 40) * maxMoveY;

  context.drawImage(image, x, y, width, height);
}

function drawMockScreen(
  context: CanvasRenderingContext2D,
  screen: { x: number; y: number; width: number; height: number },
  brandColor: string
) {
  context.fillStyle = '#f1f5f9';
  context.fillRect(screen.x, screen.y, screen.width, screen.height);
  context.fillStyle = '#cbd5e1';
  roundRect(context, screen.x + 42, screen.y + 48, 260, 22, 11);
  context.fill();
  context.fillStyle = brandColor;
  roundRect(context, screen.x + screen.width - 190, screen.y + 38, 132, 54, 18);
  context.fill();
  context.fillStyle = '#ffffff';
  roundRect(context, screen.x + 42, screen.y + 150, screen.width * 0.35, screen.height - 210, 28);
  context.fill();
  roundRect(context, screen.x + screen.width * 0.45, screen.y + 150, screen.width * 0.45, screen.height - 210, 28);
  context.fill();
}

function drawCircle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string
) {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fillStyle = color;
  context.fill();
}

function drawBlurredCircle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  blur: number,
  color: string
) {
  context.save();
  context.filter = `blur(${blur}px)`;
  drawCircle(context, x, y, radius, color);
  context.restore();
}

function drawText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  options: { color: string; size: number; weight: number }
) {
  context.fillStyle = options.color;
  context.font = `${options.weight} ${options.size}px Manrope, Inter, Arial, sans-serif`;
  context.fillText(text, x, y);
}

function drawWrappedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  maxLines: number,
  options: { color: string; size: number; lineHeight: number; weight: number }
) {
  context.fillStyle = options.color;
  context.font = `${options.weight} ${options.size}px Manrope, Inter, Arial, sans-serif`;

  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (context.measureText(testLine).width <= maxWidth || !currentLine) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  lines.slice(0, maxLines).forEach((line, index) => {
    context.fillText(line, x, y + index * options.lineHeight);
  });
}

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function withAlpha(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const fallback = normalized.length === 6 ? normalized : '787ff6';
  const red = parseInt(fallback.slice(0, 2), 16);
  const green = parseInt(fallback.slice(2, 4), 16);
  const blue = parseInt(fallback.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function hexWithAlpha(hex: string, alphaHex: string) {
  const normalized = hex.replace('#', '');
  const fallback = /^[0-9a-f]{6}$/i.test(normalized) ? normalized : '787ff6';
  return `#${fallback}${alphaHex}`;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Image could not be loaded.'));
    image.src = src;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('PNG export failed.'));
      }
    }, 'image/png');
  });
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Captured image could not be read.'));
      }
    };
    reader.onerror = () => reject(new Error('Captured image could not be read.'));
    reader.readAsDataURL(blob);
  });
}
