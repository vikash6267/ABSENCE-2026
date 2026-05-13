export const revalidate = 3600;

const BASE_URL = 'https://www.wearabsence.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://absence-backend.up.railway.app';

async function fetchAllProducts() {
  const limit = 100;
  let page = 1;
  let totalPages = 1;
  const allProducts = [];

  while (page <= totalPages) {
    const response = await fetch(`${API_URL}/api/products?page=${page}&limit=${limit}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products page ${page}`);
    }

    const data = await response.json();
    const products = data?.products || [];
    const pages = Number(data?.pagination?.pages || 1);

    allProducts.push(...products);
    totalPages = pages;
    page += 1;
  }

  return allProducts;
}

export default async function sitemap() {
  const now = new Date().toISOString();

  const staticPages = [
    { route: '', priority: 1.0, changeFrequency: 'daily' },
    { route: '/shop', priority: 0.9, changeFrequency: 'daily' },
    { route: '/contact', priority: 0.7, changeFrequency: 'monthly' },
    { route: '/faq', priority: 0.6, changeFrequency: 'monthly' },
    { route: '/shipping', priority: 0.5, changeFrequency: 'monthly' },
    { route: '/returns', priority: 0.5, changeFrequency: 'monthly' },
    { route: '/terms', priority: 0.4, changeFrequency: 'yearly' },
    { route: '/privacy', priority: 0.4, changeFrequency: 'yearly' },
  ].map(({ route, priority, changeFrequency }) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  let productPages = [];
  try {
    const products = await fetchAllProducts();
    const seen = new Set();

    productPages = products
      .filter((product) => product?.isActive !== false && product?.slug)
      .filter((product) => {
        if (seen.has(product.slug)) return false;
        seen.add(product.slug);
        return true;
      })
      .map((product) => ({
        url: `${BASE_URL}/product/${product.slug}`,
        lastModified: product.updatedAt || product.createdAt || now,
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
  } catch (error) {
    console.error('Sitemap product fetch error:', error);
  }

  return [...staticPages, ...productPages];
}
