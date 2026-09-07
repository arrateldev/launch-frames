import { NextResponse } from 'next/server';
import { chromium, devices } from 'playwright';

type CaptureDevice = 'desktop' | 'phone' | 'tablet';

const viewportByDevice = {
  desktop: { width: 1440, height: 1000, deviceScaleFactor: 2 },
  phone: { width: 390, height: 844, deviceScaleFactor: 3 },
  tablet: { width: 820, height: 1180, deviceScaleFactor: 2 }
} as const satisfies Record<
  CaptureDevice,
  { width: number; height: number; deviceScaleFactor: number }
>;

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let browser;

  try {
    const body = await request.json();
    const sourceUrl = normalizeSourceUrl(body?.url);
    const device = normalizeDevice(body?.device);
    const aspectRatio = normalizeAspectRatio(body?.aspectRatio);
    const viewportWidth = normalizeViewportDimension(body?.viewportWidth, 240, 1800);
    const viewportHeight = normalizeViewportDimension(body?.viewportHeight, 320, 2200);
    const viewportZoom = normalizeViewportZoom(body?.viewportZoom);

    if (!sourceUrl) {
      return NextResponse.json(
        { error: 'A valid URL is required.' },
        { status: 400 }
      );
    }

    const viewport = getCaptureViewport(
      device,
      aspectRatio,
      viewportZoom,
      viewportWidth,
      viewportHeight
    );
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      ...(device === 'phone' ? devices['iPhone 15'] : {}),
      viewport: {
        width: viewport.width,
        height: viewport.height
      },
      deviceScaleFactor: viewport.deviceScaleFactor
    });
    const page = await context.newPage();

    await page.goto(sourceUrl, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(500);

    const screenshot = await page.screenshot({
      type: 'png'
    });

    return new NextResponse(new Blob([new Uint8Array(screenshot)]), {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'image/png'
      }
    });
  } catch (error) {
    console.error('Capture failed:', error);
    return NextResponse.json(
      { error: 'The URL could not be captured.' },
      { status: 500 }
    );
  } finally {
    await browser?.close();
  }
}

function getCaptureViewport(
  device: CaptureDevice,
  aspectRatio: number | null,
  viewportZoom: number,
  viewportWidth: number | null,
  viewportHeight: number | null
) {
  const base = viewportByDevice[device];

  if (viewportWidth && viewportHeight) {
    return {
      width: viewportWidth,
      height: viewportHeight,
      deviceScaleFactor: base.deviceScaleFactor
    };
  }

  const targetAspectRatio = aspectRatio ?? base.width / base.height;
  const cssWidth = base.width / viewportZoom;
  const cssHeight = cssWidth / targetAspectRatio;

  return {
    width: Math.round(clamp(cssWidth, 320, 1800)),
    height: Math.round(clamp(cssHeight, 360, 2200)),
    deviceScaleFactor: base.deviceScaleFactor
  };
}

function normalizeSourceUrl(value: unknown) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function normalizeDevice(value: unknown): CaptureDevice {
  return value === 'phone' || value === 'tablet' || value === 'desktop'
    ? value
    : 'desktop';
}

function normalizeAspectRatio(value: unknown) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }

  return clamp(value, 0.28, 3.2);
}

function normalizeViewportZoom(value: unknown) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 1;
  }

  return clamp(value, 0.5, 1.25);
}

function normalizeViewportDimension(value: unknown, min: number, max: number) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }

  return Math.round(clamp(value, min, max));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
