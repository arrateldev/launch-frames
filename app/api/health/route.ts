import { deploymentMode } from '@/lib/config/feature-flags';
import { siteConfig } from '@/lib/site-config';

const healthHeaders = {
  'Cache-Control': 'no-store',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export function GET() {
  return Response.json(
    {
      status: 'ok',
      product: siteConfig.product.name,
      brand: siteConfig.brand.name,
      deploymentMode,
      timestamp: new Date().toISOString()
    },
    {
      headers: healthHeaders
    }
  );
}

export function HEAD() {
  return new Response(null, {
    status: 204,
    headers: healthHeaders
  });
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: healthHeaders
  });
}
