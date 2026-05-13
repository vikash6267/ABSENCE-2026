import { ImageResponse } from 'next/og';
import { getServerApiBase } from '@/lib/serverApiBase';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const alt = 'Product Image';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

async function getProduct(slug) {
  try {
    const apiBase = getServerApiBase();
    const res = await fetch(`${apiBase}/api/products/slug/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error('Failed to fetch product:', res.status, res.statusText);
      return null;
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function Image({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  const product = slug ? await getProduct(slug) : null;

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: 'linear-gradient(to bottom, #000000, #434343)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          ABSENCE - Product Not Found
        </div>
      ),
      {
        ...size,
      }
    );
  }

  const productImage = product.images?.[0]?.url || product.variants?.[0]?.images?.[0]?.url;

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom, #0F0F0F, #1a1a1a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            background: 'white',
            borderRadius: '24px',
            padding: '60px',
          }}
        >
          {/* Product Image */}
          {productImage && (
            <div
              style={{
                display: 'flex',
                width: '45%',
                height: '100%',
                borderRadius: '16px',
                overflow: 'hidden',
              }}
            >
              <img
                src={productImage}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          )}

          {/* Product Details */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              width: productImage ? '50%' : '100%',
              paddingLeft: productImage ? '40px' : '0',
            }}
          >
            {/* Brand */}
            <div
              style={{
                fontSize: 24,
                color: '#D4AF37',
                fontWeight: 'bold',
                marginBottom: '16px',
                letterSpacing: '0.1em',
              }}
            >
              ABSENCE
            </div>

            {/* Product Name */}
            <div
              style={{
                fontSize: 42,
                fontWeight: 'bold',
                color: '#0F0F0F',
                marginBottom: '20px',
                lineHeight: 1.2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {product.name}
            </div>

            {/* Price */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 'bold',
                  color: '#D4AF37',
                }}
              >
                Rs. {product.price}
              </div>
              {product.comparePrice && (
                <div
                  style={{
                    fontSize: 32,
                    color: '#999',
                    textDecoration: 'line-through',
                  }}
                >
                    Rs. {product.comparePrice}
                </div>
              )}
            </div>

            {/* Category Badge */}
            {product.category && (
              <div
                style={{
                  display: 'inline-flex',
                  padding: '12px 24px',
                  background: '#f5f5f5',
                  borderRadius: '999px',
                  fontSize: 20,
                  color: '#666',
                  textTransform: 'capitalize',
                  marginBottom: '24px',
                }}
              >
                {product.category}
              </div>
            )}

            {/* Website */}
            <div
              style={{
                fontSize: 20,
                color: '#999',
                marginTop: 'auto',
              }}
            >
              www.wearabsence.com
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

