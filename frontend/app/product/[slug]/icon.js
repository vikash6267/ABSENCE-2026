import { ImageResponse } from 'next/og';
import { getServerApiBase } from '@/lib/serverApiBase';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const size = {
  width: 64,
  height: 64,
};
export const contentType = 'image/png';

async function getProduct(slug) {
  try {
    const apiBase = getServerApiBase();
    const res = await fetch(`${apiBase}/api/products/slug/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function Icon({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  const product = slug ? await getProduct(slug) : null;
  const imageUrl = product?.images?.[0]?.url || product?.variants?.[0]?.images?.[0]?.url;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#111111',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product?.name || 'ABSENCE'}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ color: '#ffffff', fontSize: 20, fontWeight: 700 }}>A</div>
        )}
      </div>
    ),
    size
  );
}
