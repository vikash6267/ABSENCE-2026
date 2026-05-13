import { getServerApiBase } from '@/lib/serverApiBase';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const slug = resolvedParams?.slug;

    if (!slug) {
      return {
        title: 'Product',
        description: 'Shop premium streetwear at ABSENCE',
      };
    }

    const siteUrl = 'https://www.wearabsence.com';

    const apiBase = getServerApiBase();
    const res = await fetch(`${apiBase}/api/products/slug/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return {
        title: slug.replace(/-/g, ' '),
        description: 'The product you are looking for could not be found.',
      };
    }

    const product = await res.json();
    const rawProductImage =
      product.images?.[0]?.url || product.variants?.[0]?.images?.[0]?.url || '/android-chrome-512x512.png';
    const productImage = rawProductImage?.startsWith('http') ? rawProductImage : `${siteUrl}${rawProductImage}`;
    const productPrice = product.price ? `Rs. ${product.price}` : '';
    const comparePrice = product.comparePrice ? `Rs. ${product.comparePrice}` : '';

    let description = String(product.description || product.shortDescription || '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (description.length > 160) {
      description = description.substring(0, 157) + '...';
    }

    if (!description) {
      description = `Shop ${product.name} at ABSENCE. ${productPrice}${
        comparePrice ? ` (was ${comparePrice})` : ''
      }. Premium streetwear with free shipping.`;
    }

    const title = `${product.name}${productPrice ? ` - ${productPrice}` : ''}`;
    const productUrl = `${siteUrl}/product/${slug}`;
    const ogImageUrl = `${productUrl}/opengraph-image`;

    return {
      title,
      description,
      keywords: `${product.name}, ${product.category || 'streetwear'}, ${product.gender || 'unisex'}, ABSENCE, buy online, ${productPrice}`,
      alternates: {
        canonical: productUrl,
      },
      openGraph: {
        title,
        description,
        url: productUrl,
        siteName: 'ABSENCE',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${product.name} by ABSENCE`,
          },
          {
            url: productImage,
            width: 1200,
            height: 1200,
            alt: `${product.name} product image`,
          },
        ],
        locale: 'en_IN',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImageUrl],
      },
      other: {
        'product:price:amount': product.price,
        'product:price:currency': 'INR',
        'og:type': 'product',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    const fallbackSlug = (await Promise.resolve(params))?.slug;
    return {
      title: fallbackSlug ? fallbackSlug.replace(/-/g, ' ') : 'Product',
      description: 'Shop premium streetwear at ABSENCE',
    };
  }
}

export default function ProductLayout({ children }) {
  return children;
}
