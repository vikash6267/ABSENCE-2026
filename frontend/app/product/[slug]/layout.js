export async function generateMetadata({ params }) {
  try {
    // Fetch product data
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://absence-backend.up.railway.app';
    const res = await fetch(`${apiUrl}/api/products/slug/${params.slug}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return {
        title: 'Product Not Found - ABSENCE',
        description: 'The product you are looking for could not be found.',
      };
    }

    const product = await res.json();
    const productImage = product.images?.[0]?.url || product.variants?.[0]?.images?.[0]?.url || '/logo.png';
    const productPrice = product.price ? `₹${product.price}` : '';
    const comparePrice = product.comparePrice ? `₹${product.comparePrice}` : '';
    
    // Create description
    let description = product.description || product.shortDescription || '';
    if (description.length > 160) {
      description = description.substring(0, 157) + '...';
    }
    if (!description) {
      description = `Shop ${product.name} at ABSENCE. ${productPrice}${comparePrice ? ` (was ${comparePrice})` : ''}. Premium streetwear with free shipping.`;
    }

    // Create title
    const title = `${product.name} - ${productPrice} | ABSENCE`;

    return {
      title,
      description,
      keywords: `${product.name}, ${product.category || 'streetwear'}, ${product.gender || 'unisex'}, ABSENCE, buy online, ${productPrice}`,
      openGraph: {
        title,
        description,
        url: `https://www.wearabsence.com/product/${params.slug}`,
        siteName: 'ABSENCE',
        images: [
          {
            url: productImage,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
        locale: 'en_IN',
        type: 'product',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [productImage],
      },
      other: {
        'product:price:amount': product.price,
        'product:price:currency': 'INR',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'ABSENCE - Premium Streetwear',
      description: 'Shop premium streetwear at ABSENCE',
    };
  }
}

export default function ProductLayout({ children }) {
  return children;
}
