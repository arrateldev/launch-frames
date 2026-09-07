'use client';

import {
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type RefObject,
  type WheelEvent
} from 'react';
import {
  Aperture,
  AlignCenter,
  AlignLeft,
  AlignRight,
  AppWindow,
  Download,
  Grid3X3,
  Link as LinkIcon,
  LocateFixed,
  LoaderCircle,
  Lock,
  Magnet,
  Maximize2,
  Monitor,
  Moon,
  Palette,
  Paintbrush,
  Redo2,
  Smartphone,
  Sparkles,
  Sun,
  Type,
  Undo2,
  Unlock,
  X
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
  viewportZoom: number;
  featureZoom: number;
  featureOffsetX: number;
  featureOffsetY: number;
  appRadius: number;
};

type FrameState = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type FrameResizeHandle =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-left'
  | 'top-right'
  | 'bottom-right'
  | 'bottom-left';

type ImageSize = {
  width: number;
  height: number;
};

type CanvasSize = {
  width: number;
  height: number;
};

type RenderedFrameSize = {
  width: number;
  height: number;
};

type CanvasPan = {
  x: number;
  y: number;
};

type ExportPreviewState = {
  url: string;
  blob: Blob;
};

type ExportFormat = 'png' | 'jpeg';

type LayerVisibility = {
  text: boolean;
  app: boolean;
  background: boolean;
};

type TextStyleState = {
  scale: number;
  gap: number;
  offsetX: number;
  offsetY: number;
  align: 'auto' | 'left' | 'center' | 'right';
  headlineWeight: number;
};

type BackgroundStyleState = {
  intensity: number;
  blur: number;
  composition: 'diagonal' | 'top' | 'bottom' | 'sides';
};

type TextLayout = {
  placement: 'left' | 'right' | 'top' | 'bottom';
  left: number;
  top: number;
  width: number;
  transform: string;
};

type StudioSnapshot = {
  selectedPack: PackId;
  selectedTemplate: TemplateId;
  scenes: Scene[];
  brandColor: string;
  accentColor: string;
  crop: CropState;
  frame: FrameState;
  layers: LayerVisibility;
  textStyle: TextStyleState;
  backgroundStyle: BackgroundStyleState;
};

type HistoryState = {
  past: StudioSnapshot[];
  future: StudioSnapshot[];
};

const packOptions = [
  { id: 'social', width: 1200, height: 630, accent: 'Open Graph' },
  { id: 'appStore', width: 1290, height: 2796, accent: 'iPhone' },
  { id: 'googlePlay', width: 1024, height: 500, accent: 'Feature Graphic' },
  { id: 'microsoft', width: 1366, height: 768, accent: 'Store Screenshot' }
] as const satisfies ReadonlyArray<CanvasSize & { id: PackId; accent: string }>;

const templateOptions = [
  { id: 'clean', label: 'Clean', icon: Sun },
  { id: 'contrast', label: 'Contrast', icon: Moon },
  { id: 'halo', label: 'Halo', icon: Sparkles }
] as const satisfies ReadonlyArray<{ id: TemplateId; label: string; icon: typeof Sun }>;

const backgroundCompositionOptions = [
  { id: 'diagonal', labelKey: 'backgroundCompositionDiagonal' },
  { id: 'top', labelKey: 'backgroundCompositionTop' },
  { id: 'bottom', labelKey: 'backgroundCompositionBottom' },
  { id: 'sides', labelKey: 'backgroundCompositionSides' }
] as const satisfies ReadonlyArray<{
  id: BackgroundStyleState['composition'];
  labelKey:
    | 'backgroundCompositionDiagonal'
    | 'backgroundCompositionTop'
    | 'backgroundCompositionBottom'
    | 'backgroundCompositionSides';
}>;

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

const DEFAULT_CONTENT_ZOOM = 0.8;
const APP_PREVIEW_INSET = 3;
const MIN_VISIBLE_FRAME_EDGE = 8;
const MAX_FRAME_OUTSET = 70;
const DEFAULT_CROP: CropState = {
  viewportZoom: DEFAULT_CONTENT_ZOOM,
  featureZoom: 1,
  featureOffsetX: 0,
  featureOffsetY: 0,
  appRadius: 13
};
const DESKTOP_FRAME: FrameState = {
  x: 67,
  y: 46,
  width: 58,
  height: 69
};
const PHONE_FRAME: FrameState = {
  x: 72,
  y: 47,
  width: 25,
  height: 80
};
const DEFAULT_CANVAS_PAN: CanvasPan = {
  x: 0,
  y: 0
};
const DEFAULT_EDITOR_ZOOM = 1;
const MAX_HISTORY_STEPS = 50;
const GUIDE_TARGETS = [0, 100 / 3, 50, (100 / 3) * 2, 100];
const SNAP_THRESHOLD = 1.2;
const DEFAULT_LAYER_VISIBILITY: LayerVisibility = {
  text: true,
  app: true,
  background: true
};
const DEFAULT_TEXT_STYLE: TextStyleState = {
  scale: 1,
  gap: 1,
  offsetX: 0,
  offsetY: 0,
  align: 'auto',
  headlineWeight: 850
};
const DEFAULT_BACKGROUND_STYLE: BackgroundStyleState = {
  intensity: 1,
  blur: 1,
  composition: 'diagonal'
};

export function LaunchFramesStudio({
  locale = defaultLocale
}: {
  locale?: Locale;
}) {
  const t = getMessages(locale).studio;
  const [sourceUrl, setSourceUrl] = useState('https://clavispass.github.io/ClavisPass/');
  const canvasElementRef = useRef<HTMLDivElement>(null);
  const frameElementRef = useRef<HTMLDivElement>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const [selectedPack, setSelectedPack] = useState<PackId>('social');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('clean');
  const [scenes, setScenes] = useState<Scene[]>(initialScenes);
  const [brandColor, setBrandColor] = useState('#787ff6');
  const [accentColor, setAccentColor] = useState('#69c4ff');
  const [crop, setCrop] = useState<CropState>(DEFAULT_CROP);
  const [frame, setFrame] = useState<FrameState>(DESKTOP_FRAME);
  const [canvasPan, setCanvasPan] = useState<CanvasPan>(DEFAULT_CANVAS_PAN);
  const [editorZoom, setEditorZoom] = useState(DEFAULT_EDITOR_ZOOM);
  const [isCanvasPanning, setIsCanvasPanning] = useState(false);
  const [isFrameRatioLocked, setIsFrameRatioLocked] = useState(false);
  const [showGuides, setShowGuides] = useState(true);
  const [snapToGuides, setSnapToGuides] = useState(true);
  const [layers, setLayers] = useState<LayerVisibility>(DEFAULT_LAYER_VISIBILITY);
  const [textStyle, setTextStyle] = useState<TextStyleState>(DEFAULT_TEXT_STYLE);
  const [backgroundStyle, setBackgroundStyle] = useState<BackgroundStyleState>(
    DEFAULT_BACKGROUND_STYLE
  );
  const [history, setHistory] = useState<HistoryState>({ past: [], future: [] });
  const editSessionRef = useRef<string | null>(null);
  const exportPreviewRef = useRef<ExportPreviewState | null>(null);
  const [captureState, setCaptureState] = useState<'idle' | 'capturing' | 'error'>('idle');
  const [exportState, setExportState] = useState<'idle' | 'exporting' | 'ready' | 'error'>('idle');
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportPreview, setExportPreview] = useState<ExportPreviewState | null>(null);
  const [exportFileName, setExportFileName] = useState('');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
  const [jpegQuality, setJpegQuality] = useState(92);

  const selectedScene = scenes[0] ?? initialScenes[0];
  const selectedPackConfig =
    packOptions.find((pack) => pack.id === selectedPack) ?? packOptions[0];
  const captureDevice = getCaptureDevice(selectedPackConfig, frame);
  const normalizedSourceUrl = normalizeSourceUrl(sourceUrl);
  const canvasImage = capturedPreview;
  const featurePanLimit = getFeaturePanLimit(crop.featureZoom);
  const featurePanLimitX = canvasImage
    ? getImageFeaturePanLimit(crop, frame, imageSize, selectedPackConfig, 'x')
    : featurePanLimit;
  const featurePanLimitY = canvasImage
    ? getImageFeaturePanLimit(crop, frame, imageSize, selectedPackConfig, 'y')
    : featurePanLimit;
  const featureOffsetX = clamp(crop.featureOffsetX, -featurePanLimitX, featurePanLimitX);
  const featureOffsetY = clamp(crop.featureOffsetY, -featurePanLimitY, featurePanLimitY);

  const exportName = useMemo(
    () => `launchframes-${selectedPack}-${selectedScene.id}.png`,
    [selectedPack, selectedScene.id]
  );

  function createSnapshot(): StudioSnapshot {
    return {
      selectedPack,
      selectedTemplate,
      scenes: scenes.map((scene) => ({ ...scene })),
      brandColor,
      accentColor,
      crop: { ...crop },
      frame: { ...frame },
      layers: { ...layers },
      textStyle: { ...textStyle },
      backgroundStyle: { ...backgroundStyle }
    };
  }

  function restoreSnapshot(snapshot: StudioSnapshot) {
    setSelectedPack(snapshot.selectedPack);
    setSelectedTemplate(snapshot.selectedTemplate);
    setScenes(snapshot.scenes.map((scene) => ({ ...scene })));
    setBrandColor(snapshot.brandColor);
    setAccentColor(snapshot.accentColor);
    setCrop({ ...snapshot.crop });
    setFrame({ ...snapshot.frame });
    setLayers({ ...snapshot.layers });
    setTextStyle({ ...DEFAULT_TEXT_STYLE, ...(snapshot.textStyle ?? {}) });
    setBackgroundStyle({
      ...DEFAULT_BACKGROUND_STYLE,
      ...(snapshot.backgroundStyle ?? {})
    });
    setExportState('idle');
  }

  function commitHistory() {
    const snapshot = createSnapshot();
    setHistory((current) => ({
      past: [...current.past, snapshot].slice(-MAX_HISTORY_STEPS),
      future: []
    }));
  }

  function beginEditSession(key: string) {
    if (editSessionRef.current === key) {
      return;
    }

    editSessionRef.current = key;
    commitHistory();
  }

  function endEditSession() {
    editSessionRef.current = null;
  }

  function undoStudioChange() {
    const previous = history.past.at(-1);
    if (!previous) {
      return;
    }

    setHistory({
      past: history.past.slice(0, -1),
      future: [createSnapshot(), ...history.future].slice(0, MAX_HISTORY_STEPS)
    });
    restoreSnapshot(previous);
  }

  function redoStudioChange() {
    const next = history.future[0];
    if (!next) {
      return;
    }

    setHistory({
      past: [...history.past, createSnapshot()].slice(-MAX_HISTORY_STEPS),
      future: history.future.slice(1)
    });
    restoreSnapshot(next);
  }

  function updateScene(field: 'headline' | 'subline', value: string) {
    setScenes((current) =>
      current.map((scene) =>
        scene.id === selectedScene.id ? { ...scene, [field]: value } : scene
      )
    );
    setExportState('idle');
  }

  function updateTextStyle(nextStyle: Partial<TextStyleState>) {
    setTextStyle((current) => ({ ...current, ...nextStyle }));
    setExportState('idle');
  }

  function updateBackgroundStyle(nextStyle: Partial<BackgroundStyleState>) {
    setBackgroundStyle((current) => ({ ...current, ...nextStyle }));
    setExportState('idle');
  }

  function toggleLayer(layer: keyof LayerVisibility) {
    commitHistory();
    setLayers((current) => ({
      ...current,
      [layer]: !current[layer]
    }));
    setExportState('idle');
  }

  function handleCanvasViewportPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 1) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsCanvasPanning(true);

    const startX = event.clientX;
    const startY = event.clientY;
    const startPan = canvasPan;

    function moveCanvas(moveEvent: globalThis.PointerEvent) {
      setCanvasPan({
        x: startPan.x + moveEvent.clientX - startX,
        y: startPan.y + moveEvent.clientY - startY
      });
    }

    function stopCanvasPan() {
      setIsCanvasPanning(false);
      window.removeEventListener('pointermove', moveCanvas);
      window.removeEventListener('pointerup', stopCanvasPan);
    }

    window.addEventListener('pointermove', moveCanvas);
    window.addEventListener('pointerup', stopCanvasPan);
  }

  function handleCanvasViewportWheel(event: WheelEvent<HTMLDivElement>) {
    if (!event.ctrlKey && !event.metaKey) {
      return;
    }

    event.preventDefault();
    setEditorZoom((current) => clamp(current - event.deltaY * 0.001, 0.5, 2.5));
  }

  function fitCanvasToView() {
    setCanvasPan(DEFAULT_CANVAS_PAN);
    setEditorZoom(DEFAULT_EDITOR_ZOOM);
  }

  function centerCanvasView() {
    setCanvasPan(DEFAULT_CANVAS_PAN);
  }

  function showCanvasActualSize() {
    const canvasRect = canvasElementRef.current?.getBoundingClientRect();
    if (!canvasRect) {
      setEditorZoom(DEFAULT_EDITOR_ZOOM);
      setCanvasPan(DEFAULT_CANVAS_PAN);
      return;
    }

    const unscaledWidth = canvasRect.width / editorZoom;
    setEditorZoom(clamp(selectedPackConfig.width / unscaledWidth, 0.5, 2.5));
    setCanvasPan(DEFAULT_CANVAS_PAN);
  }

  async function captureCurrentUrl({ persist = false } = {}) {
    if (!normalizedSourceUrl) {
      setCaptureState('error');
      return null;
    }

    setCaptureState('capturing');
    setExportState('idle');

    try {
      const frameRect = frameElementRef.current?.getBoundingClientRect();
      const exportFrame = getExportFrame(selectedScene.device, frame, selectedPackConfig);
      const renderedFrameSize = frameRect
        ? { width: frameRect.width / editorZoom, height: frameRect.height / editorZoom }
        : null;
      const response = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: normalizedSourceUrl,
          device: captureDevice,
          aspectRatio: getFrameAspectRatio(selectedPackConfig, frame),
          viewportWidth: (renderedFrameSize?.width ?? exportFrame.width) / crop.viewportZoom,
          viewportHeight: (renderedFrameSize?.height ?? exportFrame.height) / crop.viewportZoom,
          viewportZoom: crop.viewportZoom
        })
      });

      if (!response.ok) {
        throw new Error('Capture failed');
      }

      const blob = await response.blob();
      const dataUrl = await blobToDataUrl(blob);
      const nextImageSize = await getImageSize(dataUrl);

      if (persist) {
        setCapturedPreview(dataUrl);
        setImageSize(nextImageSize);
      }

      setCaptureState('idle');
      return { dataUrl, imageSize: nextImageSize };
    } catch {
      setCaptureState('error');
      return null;
    }
  }

  function setPreparedExportPreview(nextPreview: ExportPreviewState | null) {
    if (exportPreviewRef.current) {
      URL.revokeObjectURL(exportPreviewRef.current.url);
    }

    exportPreviewRef.current = nextPreview;
    setExportPreview(nextPreview);
  }

  function openExportDialog() {
    setIsExportDialogOpen(true);
    setExportFileName(getExportFileName(exportName, exportFormat));
    void prepareExportPreview(exportFormat, jpegQuality);
  }

  async function prepareExportPreview(
    format = exportFormat,
    quality = jpegQuality
  ) {
    setExportState('exporting');
    setPreparedExportPreview(null);

    try {
      const frameRect = frameElementRef.current?.getBoundingClientRect();
      const renderedFrameSize = frameRect
        ? { width: frameRect.width / editorZoom, height: frameRect.height / editorZoom }
        : null;
      const captureResult = layers.app
        ? canvasImage
          ? { dataUrl: canvasImage, imageSize }
          : await captureCurrentUrl()
        : null;

      if (layers.app && !captureResult) {
        throw new Error('Capture failed');
      }

      const exportBlob = await renderPreviewPng({
        scene: selectedScene,
        template: selectedTemplate,
        brandColor,
        accentColor,
        canvasSize: selectedPackConfig,
        renderedFrameSize,
        frame,
        crop,
        layers,
        textStyle,
        backgroundStyle,
        exportFormat: format,
        jpegQuality: quality,
        imageSource: captureResult?.dataUrl ?? null,
        imageSize: captureResult?.imageSize ?? null
      });
      setPreparedExportPreview({
        url: URL.createObjectURL(exportBlob),
        blob: exportBlob
      });
      setExportState('ready');
    } catch {
      setExportState('error');
    }
  }

  function downloadPreparedExport() {
    if (!exportPreview) {
      return;
    }

    const link = document.createElement('a');
    link.href = exportPreview.url;
    link.download = getExportFileName(exportFileName || exportName, exportFormat);
    link.click();
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background text-foreground">
      <section className="min-h-[calc(100vh-4rem)] border-b border-border/60 bg-[linear-gradient(180deg,hsl(var(--background)),hsl(var(--secondary)))]">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[1800px] px-3 py-3 sm:px-5 2xl:px-8">
          <div className="grid min-h-0 w-full gap-4 xl:grid-cols-[340px_minmax(720px,1fr)_320px] 2xl:grid-cols-[360px_minmax(860px,1fr)_340px]">
            <aside className="surface-card max-h-[calc(100vh-5.5rem)] overflow-y-auto rounded-[22px] p-4">
              <div className="space-y-4">
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
                        setImageSize(null);
                        setCrop(DEFAULT_CROP);
                        setExportState('idle');
                      }}
                      placeholder="https://your-app.com"
                      className="h-10"
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
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="justify-start px-2 text-xs"
                      onClick={() => {
                        commitHistory();
                        setFrame(DESKTOP_FRAME);
                        setExportState('idle');
                      }}
                    >
                      <Monitor className="h-3.5 w-3.5" />
                      {t.desktopFrame}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="justify-start px-2 text-xs"
                      onClick={() => {
                        commitHistory();
                        setFrame(PHONE_FRAME);
                        setExportState('idle');
                      }}
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                      {t.phoneFrame}
                    </Button>
                  </div>
                </div>

                <div className="rounded-[16px] border border-border/70 bg-secondary/45 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                      <AppWindow className="h-4 w-4 text-primary" />
                      {t.canvas}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleLayer('app')}
                      className={cn(
                        'rounded-[10px] px-2 py-1 text-xs font-semibold transition-colors',
                        layers.app
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'bg-background text-muted-foreground hover:text-foreground'
                      )}
                      aria-pressed={layers.app}
                    >
                      {layers.app ? t.visible : t.hidden}
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full justify-start text-xs"
                    onClick={() => {
                      commitHistory();
                      setCrop(DEFAULT_CROP);
                      setExportState('idle');
                    }}
                  >
                    <Aperture className="h-3.5 w-3.5" />
                    {t.resetCanvas}
                  </Button>
                  <CanvasSlider
                    label={t.viewportZoom}
                    value={crop.viewportZoom}
                    min={0.5}
                    max={1.25}
                    step={0.01}
                    display={`${Math.round(crop.viewportZoom * 100)}%`}
                    onEditStart={() => beginEditSession('crop.viewportZoom')}
                    onEditEnd={endEditSession}
                    onChange={(value) => {
                      setCrop((current) => ({ ...current, viewportZoom: value }));
                      setExportState('idle');
                    }}
                  />
                  <CanvasSlider
                    label={t.featureZoom}
                    value={crop.featureZoom}
                    min={1}
                    max={2.8}
                    step={0.01}
                    display={`${Math.round(crop.featureZoom * 100)}%`}
                    onEditStart={() => beginEditSession('crop.featureZoom')}
                    onEditEnd={endEditSession}
                    onChange={(value) => {
                      const nextCrop = { ...crop, featureZoom: value };
                      const nextPanLimit = getFeaturePanLimit(value);
                      const nextPanLimitX = canvasImage
                        ? getImageFeaturePanLimit(nextCrop, frame, imageSize, selectedPackConfig, 'x')
                        : nextPanLimit;
                      const nextPanLimitY = canvasImage
                        ? getImageFeaturePanLimit(nextCrop, frame, imageSize, selectedPackConfig, 'y')
                        : nextPanLimit;
                      setCrop((current) => ({
                        ...current,
                        featureZoom: value,
                        featureOffsetX: clamp(current.featureOffsetX, -nextPanLimitX, nextPanLimitX),
                        featureOffsetY: clamp(current.featureOffsetY, -nextPanLimitY, nextPanLimitY)
                      }));
                      setExportState('idle');
                    }}
                  />
                  <CanvasSlider
                    label={t.featureX}
                    value={featureOffsetX}
                    min={-featurePanLimitX}
                    max={featurePanLimitX}
                    step={1}
                    display={`${featureOffsetX}`}
                    onEditStart={() => beginEditSession('crop.featureOffsetX')}
                    onEditEnd={endEditSession}
                    onChange={(value) => {
                      setCrop((current) => ({ ...current, featureOffsetX: value }));
                      setExportState('idle');
                    }}
                  />
                  <CanvasSlider
                    label={t.featureY}
                    value={featureOffsetY}
                    min={-featurePanLimitY}
                    max={featurePanLimitY}
                    step={1}
                    display={`${featureOffsetY}`}
                    onEditStart={() => beginEditSession('crop.featureOffsetY')}
                    onEditEnd={endEditSession}
                    onChange={(value) => {
                      setCrop((current) => ({ ...current, featureOffsetY: value }));
                      setExportState('idle');
                    }}
                  />
                  <CanvasSlider
                    label={t.borderRadius}
                    value={crop.appRadius}
                    min={0}
                    max={32}
                    step={1}
                    display={`${crop.appRadius}px`}
                    onEditStart={() => beginEditSession('crop.appRadius')}
                    onEditEnd={endEditSession}
                    onChange={(value) => {
                      setCrop((current) => ({ ...current, appRadius: value }));
                      setExportState('idle');
                    }}
                  />
                </div>
              </div>
            </aside>

            <section className="surface-panel flex min-h-0 flex-col rounded-[24px] p-4 sm:p-5">
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={undoStudioChange}
                    disabled={history.past.length === 0}
                    className="inline-flex h-8 items-center justify-center rounded-[10px] px-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-35"
                    title={t.undo}
                  >
                    <Undo2 className="h-3.5 w-3.5" />
                    <span className="sr-only">{t.undo}</span>
                  </button>
                  <button
                    type="button"
                    onClick={redoStudioChange}
                    disabled={history.future.length === 0}
                    className="inline-flex h-8 items-center justify-center rounded-[10px] px-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-35"
                    title={t.redo}
                  >
                    <Redo2 className="h-3.5 w-3.5" />
                    <span className="sr-only">{t.redo}</span>
                  </button>
                  <div className="h-6 w-px bg-border/80" />
                  <button
                    type="button"
                    onClick={fitCanvasToView}
                    className="inline-flex h-8 items-center gap-1.5 rounded-[10px] px-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    title={t.fitToView}
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    {t.fit}
                  </button>
                  <button
                    type="button"
                    onClick={showCanvasActualSize}
                    className="inline-flex h-8 items-center rounded-[10px] px-2 font-mono text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    title={t.actualSize}
                  >
                    100%
                  </button>
                  <button
                    type="button"
                    onClick={centerCanvasView}
                    className="inline-flex h-8 items-center justify-center rounded-[10px] px-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    title={t.centerView}
                  >
                    <LocateFixed className="h-3.5 w-3.5" />
                    <span className="sr-only">{t.centerView}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFrameRatioLocked((current) => !current)}
                    className={cn(
                      'inline-flex h-8 items-center justify-center rounded-[10px] px-2 transition-colors hover:bg-secondary hover:text-foreground',
                      isFrameRatioLocked
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground'
                    )}
                    title={isFrameRatioLocked ? t.unlockAspectRatio : t.lockAspectRatio}
                    aria-pressed={isFrameRatioLocked}
                  >
                    {isFrameRatioLocked ? (
                      <Lock className="h-3.5 w-3.5" />
                    ) : (
                      <Unlock className="h-3.5 w-3.5" />
                    )}
                    <span className="sr-only">
                      {isFrameRatioLocked ? t.unlockAspectRatio : t.lockAspectRatio}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowGuides((current) => !current)}
                    className={cn(
                      'inline-flex h-8 items-center justify-center rounded-[10px] px-2 transition-colors hover:bg-secondary hover:text-foreground',
                      showGuides ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                    )}
                    title={showGuides ? t.hideGuides : t.showGuides}
                    aria-pressed={showGuides}
                  >
                    <Grid3X3 className="h-3.5 w-3.5" />
                    <span className="sr-only">{showGuides ? t.hideGuides : t.showGuides}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSnapToGuides((current) => !current)}
                    className={cn(
                      'inline-flex h-8 items-center justify-center rounded-[10px] px-2 transition-colors hover:bg-secondary hover:text-foreground',
                      snapToGuides ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                    )}
                    title={snapToGuides ? t.disableSnap : t.enableSnap}
                    aria-pressed={snapToGuides}
                  >
                    <Magnet className="h-3.5 w-3.5" />
                    <span className="sr-only">{snapToGuides ? t.disableSnap : t.enableSnap}</span>
                  </button>
                  <div className="h-6 w-px bg-border/80" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    {t.editorZoom}
                  </span>
                  <input
                    type="range"
                    value={editorZoom}
                    min={0.5}
                    max={2.5}
                    step={0.01}
                    onChange={(event) => setEditorZoom(Number(event.target.value))}
                    className="h-2 w-28 cursor-pointer accent-primary"
                    aria-label={t.editorZoom}
                  />
                  <span className="w-10 text-right font-mono text-xs text-foreground">
                    {Math.round(editorZoom * 100)}%
                  </span>
                </div>

                <Button
                  type="button"
                  size="sm"
                  className="shrink-0"
                  disabled={exportState === 'exporting' || captureState === 'capturing'}
                  onClick={openExportDialog}
                >
                  {exportState === 'exporting' || captureState === 'capturing' ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {exportState === 'exporting' ? t.exporting : t.downloadPng}
                </Button>
              </div>

              <div
                className={cn(
                  'relative mt-5 flex min-h-[280px] flex-1 items-center justify-center overflow-hidden rounded-[18px] border border-border/60 bg-background p-1 shadow-[0_22px_60px_-48px_rgba(15,23,42,0.45)]',
                  isCanvasPanning && 'cursor-grabbing'
                )}
                onPointerDown={handleCanvasViewportPointerDown}
                onWheel={handleCanvasViewportWheel}
                onAuxClick={(event) => event.preventDefault()}
              >
                <div
                  className="flex h-full w-full items-center justify-center"
                  style={{
                    transform: `translate(${canvasPan.x}px, ${canvasPan.y}px) scale(${editorZoom})`,
                    transformOrigin: 'center'
                  }}
                >
                  <PreviewCanvas
                    scene={selectedScene}
                    template={selectedTemplate}
                    brandColor={brandColor}
                    accentColor={accentColor}
                    canvasSize={selectedPackConfig}
                    canvasRef={canvasElementRef}
                    sourceUrl={sourceUrl}
                    previewUrl={normalizedSourceUrl}
                    frame={frame}
                    frameRef={frameElementRef}
                    isFrameRatioLocked={isFrameRatioLocked}
                    showGuides={showGuides}
                    snapToGuides={snapToGuides}
                    layers={layers}
                    textStyle={textStyle}
                    backgroundStyle={backgroundStyle}
                    onFrameEditStart={commitHistory}
                    onFrameChange={(nextFrame) => {
                      setFrame(nextFrame);
                      setExportState('idle');
                    }}
                    crop={crop}
                    capturedPreview={canvasImage}
                    imageSize={imageSize}
                  />
                </div>
              </div>

              <div className="mt-5 grid shrink-0 gap-3 md:grid-cols-4">
                {packOptions.map((pack) => (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => {
                      commitHistory();
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
                      {pack.width} x {pack.height}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <aside className="surface-card max-h-[calc(100vh-5.5rem)] overflow-y-auto rounded-[22px] p-4">
              <div className="flex flex-col gap-4">
                <div className="order-2 rounded-[16px] border border-border/70 bg-secondary/45 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Type className="h-4 w-4 text-primary" />
                      {t.textLayer}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleLayer('text')}
                      className={cn(
                        'rounded-[10px] px-2 py-1 text-xs font-semibold transition-colors',
                        layers.text
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'bg-background text-muted-foreground hover:text-foreground'
                      )}
                      aria-pressed={layers.text}
                    >
                      {layers.text ? t.visible : t.hidden}
                    </button>
                  </div>

                  <div className={cn('mt-4 space-y-4', !layers.text && 'opacity-55')}>
                    <label className="block">
                      <span className="text-sm font-medium text-foreground">
                        {t.headline}
                      </span>
                      <Input
                        value={selectedScene.headline}
                        onFocus={() => beginEditSession('scene.headline')}
                        onBlur={endEditSession}
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
                        onFocus={() => beginEditSession('scene.subline')}
                        onBlur={endEditSession}
                        onChange={(event) => updateScene('subline', event.target.value)}
                        className="mt-2 h-10"
                      />
                    </label>
                    <CanvasSlider
                      label={t.textScale}
                      value={textStyle.scale}
                      min={0.7}
                      max={1.4}
                      step={0.01}
                      display={`${Math.round(textStyle.scale * 100)}%`}
                      onEditStart={() => beginEditSession('text.scale')}
                      onEditEnd={endEditSession}
                      onChange={(value) => {
                        updateTextStyle({ scale: value });
                      }}
                    />
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">
                        {t.textAlign}
                      </span>
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        {[
                          { value: 'auto', label: t.textAlignAuto, icon: Type },
                          { value: 'left', label: t.textAlignLeft, icon: AlignLeft },
                          { value: 'center', label: t.textAlignCenter, icon: AlignCenter },
                          { value: 'right', label: t.textAlignRight, icon: AlignRight }
                        ].map((option) => {
                          const Icon = option.icon;
                          const isActive = textStyle.align === option.value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                commitHistory();
                                updateTextStyle({
                                  align: option.value as TextStyleState['align']
                                });
                              }}
                              className={cn(
                                'inline-flex h-9 items-center justify-center rounded-[10px] border text-xs font-semibold transition-colors',
                                isActive
                                  ? 'border-primary/40 bg-primary text-primary-foreground hover:bg-primary/90'
                                  : 'border-border/70 bg-background text-muted-foreground hover:text-foreground'
                              )}
                              title={option.label}
                              aria-pressed={isActive}
                            >
                              <Icon className="h-3.5 w-3.5" />
                              <span className="sr-only">{option.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <label className="block">
                      <span className="text-xs font-medium text-muted-foreground">
                        {t.headlineWeight}
                      </span>
                      <select
                        value={textStyle.headlineWeight}
                        onFocus={() => beginEditSession('text.headlineWeight')}
                        onBlur={endEditSession}
                        onChange={(event) =>
                          updateTextStyle({ headlineWeight: Number(event.target.value) })
                        }
                        className="mt-2 h-10 w-full rounded-[12px] border border-border/70 bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary/50"
                      >
                        <option value={650}>{t.textWeightMedium}</option>
                        <option value={750}>{t.textWeightSemibold}</option>
                        <option value={850}>{t.textWeightBold}</option>
                        <option value={950}>{t.textWeightHeavy}</option>
                      </select>
                    </label>
                    <CanvasSlider
                      label={t.textSpacing}
                      value={textStyle.gap}
                      min={0.6}
                      max={1.8}
                      step={0.01}
                      display={`${Math.round(textStyle.gap * 100)}%`}
                      onEditStart={() => beginEditSession('text.gap')}
                      onEditEnd={endEditSession}
                      onChange={(value) => {
                        updateTextStyle({ gap: value });
                      }}
                    />
                    <CanvasSlider
                      label={t.textOffsetX}
                      value={textStyle.offsetX}
                      min={-12}
                      max={12}
                      step={0.5}
                      display={`${textStyle.offsetX}%`}
                      onEditStart={() => beginEditSession('text.offsetX')}
                      onEditEnd={endEditSession}
                      onChange={(value) => {
                        updateTextStyle({ offsetX: value });
                      }}
                    />
                    <CanvasSlider
                      label={t.textOffsetY}
                      value={textStyle.offsetY}
                      min={-12}
                      max={12}
                      step={0.5}
                      display={`${textStyle.offsetY}%`}
                      onEditStart={() => beginEditSession('text.offsetY')}
                      onEditEnd={endEditSession}
                      onChange={(value) => {
                        updateTextStyle({ offsetY: value });
                      }}
                    />
                  </div>
                </div>

                <div className="order-1 rounded-[16px] border border-border/70 bg-secondary/45 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Paintbrush className="h-4 w-4 text-primary" />
                      {t.backgroundLayer}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleLayer('background')}
                      className={cn(
                        'rounded-[10px] px-2 py-1 text-xs font-semibold transition-colors',
                        layers.background
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'bg-background text-muted-foreground hover:text-foreground'
                      )}
                      aria-pressed={layers.background}
                    >
                      {layers.background ? t.visible : t.hidden}
                    </button>
                  </div>

                  <div className={cn('mt-4 grid gap-2', !layers.background && 'opacity-55')}>
                    <label className="block">
                      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Palette className="h-4 w-4 text-primary" />
                        {t.brandColor}
                      </span>
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="color"
                          value={brandColor}
                          onFocus={() => beginEditSession('brandColor')}
                          onBlur={endEditSession}
                          onChange={(event) => {
                            setBrandColor(event.target.value);
                            setExportState('idle');
                          }}
                          aria-label={t.brandColor}
                          className="h-10 w-12 cursor-pointer rounded-[12px] border border-border/70 bg-background p-1"
                        />
                        <Input
                          value={brandColor}
                          onFocus={() => beginEditSession('brandColor')}
                          onBlur={endEditSession}
                          onChange={(event) => {
                            setBrandColor(event.target.value);
                            setExportState('idle');
                          }}
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
                          onFocus={() => beginEditSession('accentColor')}
                          onBlur={endEditSession}
                          onChange={(event) => {
                            setAccentColor(event.target.value);
                            setExportState('idle');
                          }}
                          aria-label={t.accentColor}
                          className="h-10 w-12 cursor-pointer rounded-[12px] border border-border/70 bg-background p-1"
                        />
                        <Input
                          value={accentColor}
                          onFocus={() => beginEditSession('accentColor')}
                          onBlur={endEditSession}
                          onChange={(event) => {
                            setAccentColor(event.target.value);
                            setExportState('idle');
                          }}
                          className="h-10 font-mono text-sm"
                        />
                      </div>
                    </label>

                    {templateOptions.map((template) => {
                      const Icon = template.icon;
                      const isActive = selectedTemplate === template.id;

                      return (
                        <div key={template.id}>
                          <button
                            type="button"
                            onClick={() => {
                              commitHistory();
                              setSelectedTemplate(template.id);
                              setExportState('idle');
                            }}
                            className={cn(
                              'inline-flex h-10 w-full items-center gap-2 rounded-[12px] border px-3 text-sm font-medium transition-colors',
                              isActive
                                ? 'border-primary/40 bg-primary text-primary-foreground hover:bg-primary/90'
                                : 'border-border/70 bg-background text-muted-foreground hover:text-foreground'
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            {template.label}
                          </button>

                          {template.id !== 'clean' && isActive ? (
                            <div className="mt-3 rounded-[14px] border border-border/70 bg-background/70 p-3">
                              <div>
                                <span className="text-xs font-medium text-muted-foreground">
                                  {t.backgroundComposition}
                                </span>
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                  {backgroundCompositionOptions.map((option) => {
                                    const isCompositionActive =
                                      backgroundStyle.composition === option.id;

                                    return (
                                      <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => {
                                          commitHistory();
                                          updateBackgroundStyle({ composition: option.id });
                                        }}
                                        className={cn(
                                          'h-9 rounded-[10px] border px-2 text-xs font-semibold transition-colors',
                                          isCompositionActive
                                            ? 'border-primary/40 bg-primary text-primary-foreground hover:bg-primary/90'
                                            : 'border-border/70 bg-background text-muted-foreground hover:text-foreground'
                                        )}
                                        aria-pressed={isCompositionActive}
                                      >
                                        {t[option.labelKey]}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <CanvasSlider
                                label={t.backgroundIntensity}
                                value={backgroundStyle.intensity}
                                min={0}
                                max={1.8}
                                step={0.01}
                                display={`${Math.round(backgroundStyle.intensity * 100)}%`}
                                onEditStart={() => beginEditSession('background.intensity')}
                                onEditEnd={endEditSession}
                                onChange={(value) => {
                                  updateBackgroundStyle({ intensity: value });
                                }}
                              />
                              <CanvasSlider
                                label={t.backgroundBlur}
                                value={backgroundStyle.blur}
                                min={0.6}
                                max={1.8}
                                step={0.01}
                                display={`${Math.round(backgroundStyle.blur * 100)}%`}
                                onEditStart={() => beginEditSession('background.blur')}
                                onEditEnd={endEditSession}
                                onChange={(value) => {
                                  updateBackgroundStyle({ blur: value });
                                }}
                              />
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </aside>
          </div>
        </div>
        {isExportDialogOpen ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="export-dialog-title"
          >
            <div className="w-full max-w-4xl rounded-[24px] border border-border/70 bg-background p-4 shadow-2xl sm:p-5">
              <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-4">
                <div>
                  <h2 id="export-dialog-title" className="text-lg font-semibold text-foreground">
                    {t.exportDialogTitle}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsExportDialogOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-[12px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  title={t.closeExportDialog}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">{t.closeExportDialog}</span>
                </button>
              </div>

              <div className="grid gap-4 pt-4 lg:grid-cols-[minmax(0,1fr)_260px]">
                <div className="flex min-h-[360px] items-center justify-center overflow-hidden rounded-[18px] border border-border/70 bg-secondary/35 p-3">
                  {exportState === 'exporting' || captureState === 'capturing' ? (
                    <div className="flex flex-col items-center gap-3 text-sm font-medium text-muted-foreground">
                      <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
                      {t.exporting}
                    </div>
                  ) : exportPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={exportPreview.url}
                      alt={t.exportDialogTitle}
                      className="max-h-[62vh] max-w-full rounded-[12px] object-contain shadow-[0_18px_60px_-45px_rgba(15,23,42,0.5)]"
                    />
                  ) : (
                    <div className="text-sm font-medium text-muted-foreground">
                      {t.exportError}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-foreground">
                      {t.exportFileType}
                    </span>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {(['png', 'jpeg'] as const).map((format) => {
                        const isActive = exportFormat === format;

                        return (
                          <button
                            key={format}
                            type="button"
                            onClick={() => {
                              setExportFormat(format);
                              setExportFileName((current) =>
                                getExportFileName(current || exportName, format)
                              );
                              void prepareExportPreview(format, jpegQuality);
                            }}
                            className={cn(
                              'h-10 rounded-[12px] border px-2 text-sm font-semibold uppercase transition-colors',
                              isActive
                                ? 'border-primary/40 bg-primary text-primary-foreground hover:bg-primary/90'
                                : 'border-border/70 bg-background text-muted-foreground hover:text-foreground'
                            )}
                            aria-pressed={isActive}
                          >
                            {format}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {exportFormat === 'jpeg' ? (
                    <CanvasSlider
                      label={t.jpegQuality}
                      value={jpegQuality}
                      min={70}
                      max={100}
                      step={1}
                      display={`${jpegQuality}%`}
                      onChange={(value) => {
                        const nextQuality = Math.round(value);
                        setJpegQuality(nextQuality);
                        void prepareExportPreview('jpeg', nextQuality);
                      }}
                    />
                  ) : null}

                  <label className="block">
                    <span className="text-sm font-medium text-foreground">
                      {t.exportFileName}
                    </span>
                    <Input
                      value={exportFileName}
                      onChange={(event) => setExportFileName(event.target.value)}
                      className="mt-2 h-10 font-mono text-sm"
                    />
                  </label>

                  <Button
                    type="button"
                    className="w-full"
                    disabled={!exportPreview || exportState === 'exporting'}
                    onClick={downloadPreparedExport}
                  >
                    <Download className="h-4 w-4" />
                    {t.downloadPng}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function PreviewCanvas({
  scene,
  template,
  brandColor,
  accentColor,
  canvasSize,
  canvasRef,
  sourceUrl,
  previewUrl,
  frame,
  frameRef,
  isFrameRatioLocked,
  showGuides,
  snapToGuides,
  layers,
  textStyle,
  backgroundStyle,
  onFrameEditStart,
  onFrameChange,
  crop,
  capturedPreview,
  imageSize
}: {
  scene: Scene;
  template: TemplateId;
  brandColor: string;
  accentColor: string;
  canvasSize: CanvasSize;
  canvasRef: RefObject<HTMLDivElement | null>;
  sourceUrl: string;
  previewUrl: string | null;
  frame: FrameState;
  frameRef: RefObject<HTMLDivElement | null>;
  isFrameRatioLocked: boolean;
  showGuides: boolean;
  snapToGuides: boolean;
  layers: LayerVisibility;
  textStyle: TextStyleState;
  backgroundStyle: BackgroundStyleState;
  onFrameEditStart: () => void;
  onFrameChange: (frame: FrameState) => void;
  crop: CropState;
  capturedPreview: string | null;
  imageSize: ImageSize | null;
}) {
  const isContrast = template === 'contrast';
  const isHalo = template === 'halo';
  const canvasRatio = canvasSize.width / canvasSize.height;
  const textLayout = getTextLayout(frame, textStyle);
  const resolvedTextAlign = getResolvedTextAlign(textLayout, textStyle);
  const textLayoutStyle: CSSProperties = {
    left: `${textLayout.left}%`,
    top: `${textLayout.top}%`,
    width: `${textLayout.width}%`,
    transform: textLayout.transform,
    textAlign: resolvedTextAlign
  };

  function handleFrameDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }

    if ((event.target as HTMLElement).dataset.resizeHandle) {
      return;
    }

    onFrameEditStart();

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
      onFrameChange(snapFramePosition({
        ...startFrame,
        x: clamp(
          nextX,
          -startFrame.width / 2 + MIN_VISIBLE_FRAME_EDGE,
          100 + startFrame.width / 2 - MIN_VISIBLE_FRAME_EDGE
        ),
        y: clamp(
          nextY,
          -startFrame.height / 2 + MIN_VISIBLE_FRAME_EDGE,
          100 + startFrame.height / 2 - MIN_VISIBLE_FRAME_EDGE
        )
      }, snapToGuides));
    }

    function stopFrameDrag() {
      window.removeEventListener('pointermove', moveFrame);
      window.removeEventListener('pointerup', stopFrameDrag);
    }

    window.addEventListener('pointermove', moveFrame);
    window.addEventListener('pointerup', stopFrameDrag);
  }

  function handleFrameResize(
    event: PointerEvent<HTMLButtonElement>,
    handle: FrameResizeHandle
  ) {
    if (event.button !== 0) {
      return;
    }

    event.stopPropagation();
    onFrameEditStart();
    const startX = event.clientX;
    const startY = event.clientY;
    const canvas = event.currentTarget.closest('[data-preview-canvas]');
    const rect = canvas?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    const canvasRect = rect;
    const startFrame = frame;

    function resizeFrame(moveEvent: globalThis.PointerEvent) {
      const deltaX = ((moveEvent.clientX - startX) / canvasRect.width) * 100;
      const deltaY = ((moveEvent.clientY - startY) / canvasRect.height) * 100;
      onFrameChange(
        resizeFrameByHandle(
          startFrame,
          handle,
          deltaX,
          deltaY,
          isFrameRatioLocked,
          snapToGuides
        )
      );
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
      ref={canvasRef}
      className={cn(
        'relative w-full max-w-full overflow-hidden rounded-[14px] p-5 sm:p-8',
        isContrast && layers.background ? 'bg-slate-950 text-white' : 'bg-white text-slate-950'
      )}
      data-preview-canvas="true"
      style={{
        aspectRatio: `${canvasSize.width} / ${canvasSize.height}`,
        maxWidth: `min(100%, calc((100vh - 15rem) * ${canvasRatio}))`,
        background: getCanvasBackground({
          template,
          layers,
          brandColor,
          accentColor,
          backgroundStyle
        }),
        backgroundSize: layers.background ? undefined : '16px 16px',
        backgroundPosition: layers.background ? undefined : '0 0, 0 8px, 8px -8px, -8px 0, 0 0'
      }}
    >
      {showGuides ? <CanvasGuides /> : null}
      {layers.text ? (
        <div className="absolute z-10 break-words" style={textLayoutStyle}>
          <h3
            className="leading-tight"
            style={{
              fontSize: `clamp(1.25rem, ${2.25 * textStyle.scale}rem, 3.25rem)`,
              fontWeight: textStyle.headlineWeight
            }}
          >
            {scene.headline}
          </h3>
          <p
            className={cn(
              'leading-6',
              isContrast && layers.background ? 'text-slate-300' : 'text-slate-600'
            )}
            style={{
              fontSize: `clamp(0.875rem, ${1 * textStyle.scale}rem, 1.5rem)`,
              marginTop: `${1.25 * textStyle.gap}rem`
            }}
          >
            {scene.subline}
          </p>
        </div>
      ) : null}

      <div
        ref={frameRef}
        className="absolute z-20 cursor-move touch-none select-none"
        onPointerDown={handleFrameDrag}
        style={{
          left: `${frame.x}%`,
          top: `${frame.y}%`,
          width: `${frame.width}%`,
          height: `${frame.height}%`,
          transform: 'translate(-50%, -50%)',
          transformOrigin: 'center'
        }}
      >
        <div
          className={cn(
            'relative flex h-full w-full items-center justify-center border shadow-[0_22px_55px_-46px_rgba(15,23,42,0.42)]',
            isContrast && layers.background
              ? 'border-white/12 bg-white/4'
              : 'border-slate-900/5 bg-transparent',
            !layers.app && 'border-dashed opacity-55'
          )}
        >
          {layers.app ? (
            capturedPreview ? (
              <ImageFramePreview
                src={capturedPreview}
                crop={crop}
                imageSize={imageSize}
                frame={frame}
                canvasSize={canvasSize}
              />
            ) : previewUrl ? (
              <LiveAppPreview
                key={`${previewUrl}-${scene.device}`}
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
            )
          ) : null}

          <FrameResizeButton handle="top" onPointerDown={handleFrameResize} />
          <FrameResizeButton handle="right" onPointerDown={handleFrameResize} />
          <FrameResizeButton handle="bottom" onPointerDown={handleFrameResize} />
          <FrameResizeButton handle="left" onPointerDown={handleFrameResize} />
          <FrameResizeButton handle="top-left" onPointerDown={handleFrameResize} />
          <FrameResizeButton handle="top-right" onPointerDown={handleFrameResize} />
          <FrameResizeButton handle="bottom-right" onPointerDown={handleFrameResize} />
          <FrameResizeButton handle="bottom-left" onPointerDown={handleFrameResize} />
          </div>
        </div>
    </div>
  );
}

function LiveAppPreview({
  sourceUrl,
  previewUrl,
  crop
}: {
  sourceUrl: string;
  previewUrl: string;
  crop: CropState;
}) {
  const viewportZoom = Math.max(crop.viewportZoom, 0.1);
  const featureZoom = Math.max(crop.featureZoom, 1);
  const maxFeatureShift = (featureZoom - 1) * 50;
  const featurePanLimit = getFeaturePanLimit(featureZoom);
  const featureShiftX = getEdgeMappedShift(crop.featureOffsetX, featurePanLimit, maxFeatureShift);
  const featureShiftY = getEdgeMappedShift(crop.featureOffsetY, featurePanLimit, maxFeatureShift);
  const viewportSize = `${100 / viewportZoom}%`;

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-white"
      style={{ borderRadius: crop.appRadius, padding: APP_PREVIEW_INSET }}
    >
      <div
        className="relative h-full w-full overflow-hidden bg-white"
        style={{ borderRadius: Math.max(0, crop.appRadius - APP_PREVIEW_INSET) }}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${featureShiftX}%, ${featureShiftY}%) scale(${featureZoom})`,
            transformOrigin: 'center'
          }}
        >
          <iframe
            title={`${URLSafeHost(sourceUrl)} live preview`}
            src={previewUrl}
            className="absolute left-0 top-0 max-w-none border-0 bg-white"
            referrerPolicy="no-referrer"
            style={{
              width: viewportSize,
              height: viewportSize,
              transform: `scale(${viewportZoom})`,
              transformOrigin: 'top left'
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ImageFramePreview({
  src,
  crop,
  imageSize,
  frame,
  canvasSize
}: {
  src: string;
  crop: CropState;
  imageSize: ImageSize | null;
  frame: FrameState;
  canvasSize: CanvasSize;
}) {
  const fallbackSize = { width: 1440, height: 1000 };
  const source = imageSize ?? fallbackSize;
  const frameAspect = getFrameAspectRatio(canvasSize, frame);
  const imageAspect = source.width / source.height;
  const coverSize =
    imageAspect > frameAspect
      ? { width: (imageAspect / frameAspect) * 100, height: 100 }
      : { width: 100, height: (frameAspect / imageAspect) * 100 };
  const width = coverSize.width * crop.featureZoom;
  const height = coverSize.height * crop.featureZoom;
  const maxShiftX = getImageEdgeShift(width);
  const maxShiftY = getImageEdgeShift(height);
  const featurePanLimit = getFeaturePanLimit(crop.featureZoom);
  const featureShiftX = getEdgeMappedShift(crop.featureOffsetX, featurePanLimit, maxShiftX);
  const featureShiftY = getEdgeMappedShift(crop.featureOffsetY, featurePanLimit, maxShiftY);

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-white"
      style={{ borderRadius: crop.appRadius, padding: APP_PREVIEW_INSET }}
    >
      <div
        className="relative h-full w-full overflow-hidden bg-white"
        style={{ borderRadius: Math.max(0, crop.appRadius - APP_PREVIEW_INSET) }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          draggable={false}
          className="absolute left-1/2 top-1/2 max-w-none select-none"
          style={{
            width: `${width}%`,
            height: `${height}%`,
            transform: `translate(calc(-50% + ${featureShiftX}%), calc(-50% + ${featureShiftY}%))`,
            objectFit: 'fill'
          }}
        />
      </div>
    </div>
  );
}

function FrameResizeButton({
  handle,
  onPointerDown
}: {
  handle: FrameResizeHandle;
  onPointerDown: (
    event: PointerEvent<HTMLButtonElement>,
    handle: FrameResizeHandle
  ) => void;
}) {
  const isCorner = handle.includes('-');
  const classNameByHandle: Record<FrameResizeHandle, string> = {
    top: 'left-4 right-4 top-[-7px] h-3 cursor-ns-resize',
    right: 'bottom-4 right-[-7px] top-4 w-3 cursor-ew-resize',
    bottom: 'bottom-[-7px] left-4 right-4 h-3 cursor-ns-resize',
    left: 'bottom-4 left-[-7px] top-4 w-3 cursor-ew-resize',
    'top-left': 'left-[-8px] top-[-8px] h-4 w-4 cursor-nwse-resize',
    'top-right': 'right-[-8px] top-[-8px] h-4 w-4 cursor-nesw-resize',
    'bottom-right': 'bottom-[-8px] right-[-8px] h-4 w-4 cursor-nwse-resize',
    'bottom-left': 'bottom-[-8px] left-[-8px] h-4 w-4 cursor-nesw-resize'
  };

  return (
    <button
      type="button"
      aria-label={`Resize frame ${handle}`}
      data-resize-handle="true"
      onPointerDown={(event) => onPointerDown(event, handle)}
      className={cn(
        'absolute z-30 touch-none',
        classNameByHandle[handle],
        isCorner &&
          'rounded-[5px] border border-white/70 bg-black/35 opacity-80 shadow-sm'
      )}
    >
      <span className="sr-only">Resize frame {handle}</span>
    </button>
  );
}

function CanvasGuides() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5]">
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-primary/35" />
      <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-primary/35" />
      <div className="absolute left-1/3 top-0 h-full w-px -translate-x-1/2 bg-slate-400/20" />
      <div className="absolute left-2/3 top-0 h-full w-px -translate-x-1/2 bg-slate-400/20" />
      <div className="absolute left-0 top-1/3 h-px w-full -translate-y-1/2 bg-slate-400/20" />
      <div className="absolute left-0 top-2/3 h-px w-full -translate-y-1/2 bg-slate-400/20" />
      <div className="absolute inset-[5%] border border-dashed border-slate-400/20" />
    </div>
  );
}

function resizeFrameByHandle(
  frame: FrameState,
  handle: FrameResizeHandle,
  deltaX: number,
  deltaY: number,
  lockAspectRatio: boolean,
  snapToGuides: boolean
) {
  let left = frame.x - frame.width / 2;
  let right = frame.x + frame.width / 2;
  let top = frame.y - frame.height / 2;
  let bottom = frame.y + frame.height / 2;
  const aspectRatio = frame.width / frame.height;

  if (handle.includes('left')) {
    left += deltaX;
  }

  if (handle.includes('right')) {
    right += deltaX;
  }

  if (handle.includes('top')) {
    top += deltaY;
  }

  if (handle.includes('bottom')) {
    bottom += deltaY;
  }

  const minWidth = 18;
  const minHeight = 22;
  const maxWidth = 78;
  const maxHeight = 88;

  if (lockAspectRatio) {
    ({ left, right, top, bottom } = lockFrameEdgesToAspectRatio(
      { left, right, top, bottom },
      handle,
      aspectRatio,
      Math.abs(deltaX) >= Math.abs(deltaY) ? 'width' : 'height'
    ));
  }

  if (right - left < minWidth) {
    if (handle.includes('left')) {
      left = right - minWidth;
    } else {
      right = left + minWidth;
    }
  }

  if (bottom - top < minHeight) {
    if (handle.includes('top')) {
      top = bottom - minHeight;
    } else {
      bottom = top + minHeight;
    }
  }

  if (right - left > maxWidth) {
    if (handle.includes('left')) {
      left = right - maxWidth;
    } else {
      right = left + maxWidth;
    }
  }

  if (bottom - top > maxHeight) {
    if (handle.includes('top')) {
      top = bottom - maxHeight;
    } else {
      bottom = top + maxHeight;
    }
  }

  if (lockAspectRatio) {
    ({ left, right, top, bottom } = lockFrameEdgesToAspectRatio(
      { left, right, top, bottom },
      handle,
      aspectRatio,
      right - left >= maxWidth || right - left <= minWidth ? 'width' : 'height'
    ));
  }

  if (snapToGuides) {
    ({ left, right, top, bottom } = snapFrameEdgesToGuides(
      { left, right, top, bottom },
      handle
    ));

    if (lockAspectRatio) {
      ({ left, right, top, bottom } = lockFrameEdgesToAspectRatio(
        { left, right, top, bottom },
        handle,
        aspectRatio,
        Math.abs(deltaX) >= Math.abs(deltaY) ? 'width' : 'height'
      ));
    }
  }

  left = clamp(left, -MAX_FRAME_OUTSET, 100 - MIN_VISIBLE_FRAME_EDGE);
  right = clamp(right, left + minWidth, 100 + MAX_FRAME_OUTSET);
  top = clamp(top, -MAX_FRAME_OUTSET, 100 - MIN_VISIBLE_FRAME_EDGE);
  bottom = clamp(bottom, top + minHeight, 100 + MAX_FRAME_OUTSET);

  if (right < MIN_VISIBLE_FRAME_EDGE) {
    const shift = MIN_VISIBLE_FRAME_EDGE - right;
    left += shift;
    right += shift;
  }

  if (left > 100 - MIN_VISIBLE_FRAME_EDGE) {
    const shift = left - (100 - MIN_VISIBLE_FRAME_EDGE);
    left -= shift;
    right -= shift;
  }

  if (bottom < MIN_VISIBLE_FRAME_EDGE) {
    const shift = MIN_VISIBLE_FRAME_EDGE - bottom;
    top += shift;
    bottom += shift;
  }

  if (top > 100 - MIN_VISIBLE_FRAME_EDGE) {
    const shift = top - (100 - MIN_VISIBLE_FRAME_EDGE);
    top -= shift;
    bottom -= shift;
  }

  return {
    x: (left + right) / 2,
    y: (top + bottom) / 2,
    width: right - left,
    height: bottom - top
  };
}

function snapFramePosition(frame: FrameState, snapToGuides: boolean) {
  if (!snapToGuides) {
    return frame;
  }

  const left = frame.x - frame.width / 2;
  const right = frame.x + frame.width / 2;
  const top = frame.y - frame.height / 2;
  const bottom = frame.y + frame.height / 2;

  return {
    ...frame,
    x: frame.x + getClosestSnapDelta([frame.x, left, right]),
    y: frame.y + getClosestSnapDelta([frame.y, top, bottom])
  };
}

function snapFrameEdgesToGuides(
  edges: { left: number; right: number; top: number; bottom: number },
  handle: FrameResizeHandle
) {
  let { left, right, top, bottom } = edges;

  if (handle.includes('left')) {
    left = snapValueToGuides(left);
  }

  if (handle.includes('right')) {
    right = snapValueToGuides(right);
  }

  if (handle.includes('top')) {
    top = snapValueToGuides(top);
  }

  if (handle.includes('bottom')) {
    bottom = snapValueToGuides(bottom);
  }

  return { left, right, top, bottom };
}

function getClosestSnapDelta(values: number[]) {
  let bestDelta = 0;
  let bestDistance = SNAP_THRESHOLD;

  for (const value of values) {
    for (const target of GUIDE_TARGETS) {
      const delta = target - value;
      const distance = Math.abs(delta);

      if (distance < bestDistance) {
        bestDistance = distance;
        bestDelta = delta;
      }
    }
  }

  return bestDelta;
}

function snapValueToGuides(value: number) {
  return value + getClosestSnapDelta([value]);
}

function lockFrameEdgesToAspectRatio(
  edges: { left: number; right: number; top: number; bottom: number },
  handle: FrameResizeHandle,
  aspectRatio: number,
  driver: 'width' | 'height'
) {
  let { left, right, top, bottom } = edges;
  let width = right - left;
  let height = bottom - top;

  if (driver === 'width') {
    height = width / aspectRatio;
  } else {
    width = height * aspectRatio;
  }

  const movesLeft = handle.includes('left');
  const movesRight = handle.includes('right');
  const movesTop = handle.includes('top');
  const movesBottom = handle.includes('bottom');

  if (movesLeft) {
    left = right - width;
  } else if (movesRight) {
    right = left + width;
  } else {
    const centerX = (left + right) / 2;
    left = centerX - width / 2;
    right = centerX + width / 2;
  }

  if (movesTop) {
    top = bottom - height;
  } else if (movesBottom) {
    bottom = top + height;
  } else {
    const centerY = (top + bottom) / 2;
    top = centerY - height / 2;
    bottom = centerY + height / 2;
  }

  return { left, right, top, bottom };
}

function getFeaturePanLimit(featureZoom: number) {
  return Math.round(((Math.max(featureZoom, 1) - 1) / Math.max(featureZoom, 1)) * 100);
}

function getImageFeaturePanLimit(
  crop: CropState,
  frame: FrameState,
  imageSize: ImageSize | null,
  canvasSize: CanvasSize,
  axis: 'x' | 'y'
) {
  const fallbackSize = { width: 1440, height: 1000 };
  const source = imageSize ?? fallbackSize;
  const frameAspect = getFrameAspectRatio(canvasSize, frame);
  const imageAspect = source.width / source.height;
  const coverSize =
    imageAspect > frameAspect
      ? { width: (imageAspect / frameAspect) * 100, height: 100 }
      : { width: 100, height: (frameAspect / imageAspect) * 100 };
  const renderedSize =
    (axis === 'x' ? coverSize.width : coverSize.height) *
    crop.featureZoom;

  return renderedSize > 100 ? getFeaturePanLimit(crop.featureZoom) : 0;
}

function getImageEdgeShift(renderedSize: number) {
  if (renderedSize <= 100) {
    return 0;
  }

  return ((renderedSize - 100) / (2 * renderedSize)) * 100;
}

function getEdgeMappedShift(value: number, limit: number, maxShift: number) {
  if (limit <= 0 || maxShift <= 0) {
    return 0;
  }

  return (clamp(value, -limit, limit) / limit) * maxShift;
}

function CanvasSlider({
  label,
  value,
  min,
  max,
  step,
  display,
  onEditStart,
  onEditEnd,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onEditStart?: () => void;
  onEditEnd?: () => void;
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
        onPointerDown={onEditStart}
        onPointerUp={onEditEnd}
        onBlur={onEditEnd}
        onKeyDown={onEditStart}
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

function getExportFileName(value: string, format: ExportFormat) {
  const sanitized = value
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '-')
    .replace(/\s+/g, '-');
  const extension = format === 'jpeg' ? 'jpg' : 'png';
  const fileName = sanitized || `launchframes-export.${extension}`;

  return fileName.replace(/\.(png|jpe?g)$/i, `.${extension}`);
}

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

function getBaseTextLayout(frame: FrameState): TextLayout {
  const edge = 5;
  const gap = 4;
  const minSideWidth = 22;
  const maxSideWidth = 34;
  const maxStackWidth = 72;
  const frameLeft = frame.x - frame.width / 2;
  const frameRight = frame.x + frame.width / 2;
  const frameTop = frame.y - frame.height / 2;
  const frameBottom = frame.y + frame.height / 2;
  const leftSpace = Math.max(0, frameLeft - gap - edge);
  const rightSpace = Math.max(0, 100 - frameRight - gap - edge);

  if (Math.max(leftSpace, rightSpace) >= minSideWidth) {
    if (rightSpace >= leftSpace) {
      return {
        placement: 'right',
        left: clamp(frameRight + gap, edge, 100 - edge),
        top: 50,
        width: clamp(rightSpace, minSideWidth, maxSideWidth),
        transform: 'translateY(-50%)'
      };
    }

    return {
      placement: 'left',
      left: clamp(frameLeft - gap, edge, 100 - edge),
      top: 50,
      width: clamp(leftSpace, minSideWidth, maxSideWidth),
      transform: 'translate(-100%, -50%)'
    };
  }

  const topSpace = Math.max(0, frameTop - gap - edge);
  const bottomSpace = Math.max(0, 100 - frameBottom - gap - edge);
  const stackWidth = clamp(100 - edge * 2, minSideWidth, maxStackWidth);

  if (bottomSpace >= topSpace) {
    return {
      placement: 'bottom',
      left: 50,
      top: clamp(frameBottom + gap, edge, 100 - edge),
      width: stackWidth,
      transform: 'translateX(-50%)'
    };
  }

  return {
    placement: 'top',
    left: 50,
    top: clamp(frameTop - gap, edge, 100 - edge),
    width: stackWidth,
    transform: 'translate(-50%, -100%)'
  };
}

function getTextLayout(frame: FrameState, textStyle: TextStyleState = DEFAULT_TEXT_STYLE): TextLayout {
  const edge = 5;
  const gap = 4;
  const baseLayout = getBaseTextLayout(frame);
  const frameLeft = frame.x - frame.width / 2;
  const frameRight = frame.x + frame.width / 2;
  const frameTop = frame.y - frame.height / 2;
  const frameBottom = frame.y + frame.height / 2;
  const adjusted = {
    ...baseLayout,
    left: baseLayout.left + textStyle.offsetX,
    top: baseLayout.top + textStyle.offsetY
  };

  if (adjusted.placement === 'left') {
    const leftAnchor = clamp(adjusted.left, edge + adjusted.width, frameLeft - gap);

    return {
      ...adjusted,
      left: leftAnchor,
      width: clamp(Math.min(adjusted.width, leftAnchor - edge), 14, adjusted.width)
    };
  }

  if (adjusted.placement === 'right') {
    const leftAnchor = clamp(adjusted.left, frameRight + gap, 100 - edge - adjusted.width);

    return {
      ...adjusted,
      left: leftAnchor,
      width: clamp(Math.min(adjusted.width, 100 - edge - leftAnchor), 14, adjusted.width)
    };
  }

  if (adjusted.placement === 'top') {
    return {
      ...adjusted,
      left: clamp(adjusted.left, edge + adjusted.width / 2, 100 - edge - adjusted.width / 2),
      top: clamp(adjusted.top, edge, frameTop - gap)
    };
  }

  return {
    ...adjusted,
    left: clamp(adjusted.left, edge + adjusted.width / 2, 100 - edge - adjusted.width / 2),
    top: clamp(adjusted.top, frameBottom + gap, 100 - edge)
  };
}

function getResolvedTextAlign(
  textLayout: TextLayout,
  textStyle: TextStyleState
): 'left' | 'center' | 'right' {
  if (textStyle.align !== 'auto') {
    return textStyle.align;
  }

  if (textLayout.placement === 'left') {
    return 'right';
  }

  if (textLayout.placement === 'right') {
    return 'left';
  }

  return 'center';
}

function getCaptureDevice(canvasSize: CanvasSize, frame: FrameState): Scene['device'] {
  const frameAspect = getFrameAspectRatio(canvasSize, frame);

  if (frameAspect < 0.78) {
    return 'phone';
  }

  if (frameAspect < 1.25) {
    return 'tablet';
  }

  return 'desktop';
}

function getFrameAspectRatio(canvasSize: CanvasSize, frame: FrameState) {
  return (frame.width / frame.height) * (canvasSize.width / canvasSize.height);
}

async function renderPreviewPng({
  scene,
  template,
  brandColor,
  accentColor,
  canvasSize,
  renderedFrameSize,
  frame,
  crop,
  layers,
  textStyle,
  backgroundStyle,
  exportFormat,
  jpegQuality,
  imageSource,
  imageSize
}: {
  scene: Scene;
  template: TemplateId;
  brandColor: string;
  accentColor: string;
  canvasSize: CanvasSize;
  renderedFrameSize: RenderedFrameSize | null;
  frame: FrameState;
  crop: CropState;
  layers: LayerVisibility;
  textStyle: TextStyleState;
  backgroundStyle: BackgroundStyleState;
  exportFormat: ExportFormat;
  jpegQuality: number;
  imageSource: string | null;
  imageSize: ImageSize | null;
}) {
  const canvas = document.createElement('canvas');
  canvas.width = canvasSize.width;
  canvas.height = canvasSize.height;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas export is not available.');
  }

  const contrast = template === 'contrast';
  const halo = template === 'halo';
  const foreground = contrast && layers.background ? '#ffffff' : '#0f172a';
  const muted = contrast && layers.background ? '#cbd5e1' : '#475569';
  const background = contrast ? '#09111f' : '#ffffff';
  const textLayout = getTextLayout(frame, textStyle);
  const resolvedTextAlign = getResolvedTextAlign(textLayout, textStyle);
  const exportScale = Math.min(canvas.width / 2400, canvas.height / 1260);
  const copyScale = textStyle.scale;
  const headlineSize = (textLayout.placement === 'top' || textLayout.placement === 'bottom' ? 76 : 88) * exportScale * copyScale;
  const headlineLineHeight = (textLayout.placement === 'top' || textLayout.placement === 'bottom' ? 86 : 100) * exportScale * copyScale;
  const sublineSize = (textLayout.placement === 'top' || textLayout.placement === 'bottom' ? 36 : 40) * exportScale * copyScale;
  const sublineLineHeight = (textLayout.placement === 'top' || textLayout.placement === 'bottom' ? 50 : 56) * exportScale * copyScale;
  const textBox = {
    x: (textLayout.left / 100) * canvas.width,
    y: (textLayout.top / 100) * canvas.height,
    width: (textLayout.width / 100) * canvas.width
  };
  const textOriginX =
    textLayout.placement === 'left'
      ? textBox.x - textBox.width
      : textLayout.placement === 'top' || textLayout.placement === 'bottom'
        ? textBox.x - textBox.width / 2
        : textBox.x;
  const textOriginY =
    textLayout.placement === 'left' || textLayout.placement === 'right'
      ? textBox.y - 160 * exportScale * copyScale
      : textLayout.placement === 'top'
        ? textBox.y - 250 * exportScale * copyScale
        : textBox.y;

  if (!layers.background && exportFormat === 'jpeg') {
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (layers.background) {
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (layers.background && (contrast || halo)) {
    const glowBase = Math.min(canvas.width, canvas.height);
    const activeBackgroundStyle = contrast || halo
      ? backgroundStyle
      : DEFAULT_BACKGROUND_STYLE;
    const intensity = clamp(activeBackgroundStyle.intensity, 0, 1.8);
    const blur = clamp(activeBackgroundStyle.blur, 0.6, 1.8);
    const glowPoints = getBackgroundGlowPoints(activeBackgroundStyle.composition);

    drawBlurredCircle(
      context,
      canvas.width * (glowPoints[0]?.x ?? 0.18),
      canvas.height * (glowPoints[0]?.y ?? 0.2),
      glowBase * 0.35 * blur,
      glowBase * 0.09 * blur,
      withAlpha(brandColor, (contrast ? 0.34 : 0.1) * intensity)
    );
    drawBlurredCircle(
      context,
      canvas.width * (glowPoints[1]?.x ?? 0.79),
      canvas.height * (glowPoints[1]?.y ?? 0.24),
      glowBase * 0.31 * blur,
      glowBase * 0.1 * blur,
      withAlpha(accentColor, (contrast ? 0.18 : 0.08) * intensity)
    );
    drawBlurredCircle(
      context,
      canvas.width * (glowPoints[2]?.x ?? 0.7),
      canvas.height * (glowPoints[2]?.y ?? 0.83),
      glowBase * 0.29 * blur,
      glowBase * 0.1 * blur,
      withAlpha(brandColor, (contrast ? 0.16 : 0.05) * intensity)
    );
  }

  if (layers.text) {
    drawWrappedText(context, scene.headline, textOriginX, textOriginY, textBox.width, 3, {
      color: foreground,
      size: headlineSize,
      lineHeight: headlineLineHeight,
      weight: textStyle.headlineWeight,
      align: resolvedTextAlign
    });
    drawWrappedText(context, scene.subline, textOriginX, textOriginY + headlineLineHeight * 3 + 52 * exportScale * copyScale * textStyle.gap, textBox.width, 2, {
      color: muted,
      size: sublineSize,
      lineHeight: sublineLineHeight,
      weight: 500,
      align: resolvedTextAlign
    });
  }
  const exportFrame = getExportFrame(scene.device, frame, canvasSize);
  const bezel = imageSource ? 0 : Math.max(1, 3 * exportScale);
  const screen = {
    x: exportFrame.x + bezel,
    y: exportFrame.y + bezel,
    width: exportFrame.width - bezel * 2,
    height: exportFrame.height - bezel * 2
  };
  const radiusScale = renderedFrameSize
    ? Math.max(exportFrame.width / renderedFrameSize.width, exportFrame.height / renderedFrameSize.height)
    : exportScale;
  const screenRadius = Math.min(screen.width / 2, screen.height / 2, crop.appRadius * radiusScale);
  const contentInset = imageSource ? 0 : APP_PREVIEW_INSET;
  const contentScreen = {
    x: screen.x + contentInset,
    y: screen.y + contentInset,
    width: screen.width - contentInset * 2,
    height: screen.height - contentInset * 2
  };

  if (layers.app) {
    context.save();
    context.shadowColor = 'rgba(2, 6, 23, 0.18)';
    context.shadowBlur = 52 * exportScale;
    context.shadowOffsetY = 36 * exportScale;
    context.fillStyle = '#ffffff';
    roundRect(context, screen.x, screen.y, screen.width, screen.height, screenRadius);
    context.fill();
    context.restore();

    context.save();
    roundRect(context, screen.x, screen.y, screen.width, screen.height, screenRadius);
    context.clip();
    context.fillStyle = '#ffffff';
    context.fillRect(screen.x, screen.y, screen.width, screen.height);

    if (imageSource) {
      const image = await loadImage(imageSource);
      drawImageInFrame(context, image, contentScreen, crop, imageSize);
    } else {
      drawMockScreen(context, contentScreen, brandColor);
    }

    context.restore();

    if (!imageSource) {
      context.strokeStyle = contrast ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.05)';
      context.lineWidth = 2;
      context.strokeRect(exportFrame.x, exportFrame.y, exportFrame.width, exportFrame.height);
    }
  }

  return canvasToBlob(
    canvas,
    exportFormat === 'jpeg' ? 'image/jpeg' : 'image/png',
    exportFormat === 'jpeg' ? clamp(jpegQuality / 100, 0.7, 1) : undefined
  );
}

function getExportFrame(_device: Scene['device'], frame: FrameState, canvasSize: CanvasSize) {
  const width = (frame.width / 100) * canvasSize.width;
  const height = (frame.height / 100) * canvasSize.height;
  const centerX = (frame.x / 100) * canvasSize.width;
  const centerY = (frame.y / 100) * canvasSize.height;

  return {
    x: centerX - width / 2,
    y: centerY - height / 2,
    width,
    height
  };
}

function drawImageInFrame(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  screen: { x: number; y: number; width: number; height: number },
  crop: CropState,
  imageSize: ImageSize | null
) {
  const sourceWidth = imageSize?.width ?? image.naturalWidth;
  const sourceHeight = imageSize?.height ?? image.naturalHeight;
  const baseScale = Math.max(screen.width / sourceWidth, screen.height / sourceHeight);
  const scale = baseScale * crop.featureZoom;
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;
  const maxMoveX = Math.max(0, (width - screen.width) / 2);
  const maxMoveY = Math.max(0, (height - screen.height) / 2);
  const featurePanLimit = getFeaturePanLimit(crop.featureZoom);
  const shiftX = getEdgeMappedShift(crop.featureOffsetX, featurePanLimit, maxMoveX);
  const shiftY = getEdgeMappedShift(crop.featureOffsetY, featurePanLimit, maxMoveY);
  const x = screen.x + (screen.width - width) / 2 + shiftX;
  const y = screen.y + (screen.height - height) / 2 + shiftY;

  context.fillStyle = '#ffffff';
  context.fillRect(screen.x, screen.y, screen.width, screen.height);
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

function drawWrappedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  maxLines: number,
  options: {
    color: string;
    size: number;
    lineHeight: number;
    weight: number;
    align?: CanvasTextAlign;
  }
) {
  context.fillStyle = options.color;
  context.font = `${options.weight} ${options.size}px Manrope, Inter, Arial, sans-serif`;
  context.textAlign = options.align ?? 'left';
  const lineX =
    options.align === 'center'
      ? x + maxWidth / 2
      : options.align === 'right'
        ? x + maxWidth
        : x;

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
    context.fillText(line, lineX, y + index * options.lineHeight);
  });
  context.textAlign = 'left';
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

function getCanvasBackground({
  template,
  layers,
  brandColor,
  accentColor,
  backgroundStyle
}: {
  template: TemplateId;
  layers: LayerVisibility;
  brandColor: string;
  accentColor: string;
  backgroundStyle: BackgroundStyleState;
}) {
  if (!layers.background) {
    return getCheckerboardBackground();
  }

  const activeBackgroundStyle =
    template === 'contrast' || template === 'halo'
      ? backgroundStyle
      : DEFAULT_BACKGROUND_STYLE;
  const intensity = clamp(activeBackgroundStyle.intensity, 0, 1.8);
  const blur = clamp(activeBackgroundStyle.blur, 0.6, 1.8);
  const primaryStop = Math.round(26 + 12 * blur);
  const secondaryStop = Math.round(24 + 10 * blur);
  const glowPoints = getBackgroundGlowPoints(activeBackgroundStyle.composition);
  const primaryPoint = glowPoints[0] ?? { x: 0.18, y: 0.2 };
  const secondaryPoint = glowPoints[1] ?? { x: 0.82, y: 0.24 };
  const tertiaryPoint = glowPoints[2] ?? { x: 0.7, y: 0.83 };

  if (template === 'contrast') {
    return [
      `radial-gradient(circle at ${toPercent(primaryPoint.x)} ${toPercent(primaryPoint.y)}, ${withAlpha(brandColor, 0.34 * intensity)}, transparent ${primaryStop}%)`,
      `radial-gradient(circle at ${toPercent(secondaryPoint.x)} ${toPercent(secondaryPoint.y)}, ${withAlpha(accentColor, 0.18 * intensity)}, transparent ${secondaryStop}%)`,
      '#09111f'
    ].join(', ');
  }

  if (template === 'halo') {
    return [
      `radial-gradient(circle at ${toPercent(primaryPoint.x)} ${toPercent(primaryPoint.y)}, ${withAlpha(brandColor, 0.1 * intensity)}, transparent ${primaryStop}%)`,
      `radial-gradient(circle at ${toPercent(secondaryPoint.x)} ${toPercent(secondaryPoint.y)}, ${withAlpha(accentColor, 0.08 * intensity)}, transparent ${secondaryStop}%)`,
      `radial-gradient(circle at ${toPercent(tertiaryPoint.x)} ${toPercent(tertiaryPoint.y)}, ${withAlpha(brandColor, 0.05 * intensity)}, transparent ${secondaryStop}%)`,
      '#ffffff'
    ].join(', ');
  }

  return '#ffffff';
}

function getBackgroundGlowPoints(composition: BackgroundStyleState['composition']) {
  switch (composition) {
    case 'top':
      return [
        { x: 0.24, y: 0.08 },
        { x: 0.78, y: 0.12 },
        { x: 0.5, y: 0.24 }
      ];
    case 'bottom':
      return [
        { x: 0.18, y: 0.84 },
        { x: 0.82, y: 0.78 },
        { x: 0.52, y: 0.66 }
      ];
    case 'sides':
      return [
        { x: 0.04, y: 0.5 },
        { x: 0.96, y: 0.5 },
        { x: 0.5, y: 0.82 }
      ];
    case 'diagonal':
    default:
      return [
        { x: 0.18, y: 0.2 },
        { x: 0.82, y: 0.24 },
        { x: 0.7, y: 0.83 }
      ];
  }
}

function toPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function withAlpha(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const fallback = normalized.length === 6 ? normalized : '787ff6';
  const red = parseInt(fallback.slice(0, 2), 16);
  const green = parseInt(fallback.slice(2, 4), 16);
  const blue = parseInt(fallback.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${clamp(alpha, 0, 1)})`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getCheckerboardBackground() {
  return [
    'linear-gradient(45deg, rgba(148,163,184,0.22) 25%, transparent 25%)',
    'linear-gradient(-45deg, rgba(148,163,184,0.22) 25%, transparent 25%)',
    'linear-gradient(45deg, transparent 75%, rgba(148,163,184,0.22) 75%)',
    'linear-gradient(-45deg, transparent 75%, rgba(148,163,184,0.22) 75%)',
    '#ffffff'
  ].join(', ');
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Image could not be loaded.'));
    image.src = src;
  });
}

async function getImageSize(src: string) {
  const image = await loadImage(src);
  return {
    width: image.naturalWidth,
    height: image.naturalHeight
  };
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type = 'image/png',
  quality?: number
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Export failed.'));
      }
    }, type, quality);
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
