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

    if (!sourceUrl) {
      return NextResponse.json(
        { error: 'A valid URL is required.' },
        { status: 400 }
      );
    }

    const viewport = viewportByDevice[device];
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
      type: 'png',
      fullPage: false
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
