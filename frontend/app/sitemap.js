// Dynamic sitemap generation for Next.js
export default async function sitemap() {
  const baseUrl = 'https://wearabsence.com';
  
  // Static pages
  const staticPages = [
    '',
    '/shop',
    '/contact',
    '/shipping',
    '/returns',
    '/faq',
    '/terms',
    '/privacy',
    '/login',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // TODO: Fetch dynamic product pages from API
  // const products = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`).then(res => res.json());
  // const productPages = products.map((product) => ({
  //   url: `${baseUrl}/product/${product.slug}`,
  //   lastModified: product.updatedAt,
  //   changeFrequency: 'weekly',
  //   priority: 0.9,
  // }));

  return [
    ...staticPages,
    // ...productPages,
  ];
}
