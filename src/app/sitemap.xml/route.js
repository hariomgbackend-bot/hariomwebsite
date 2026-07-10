var BASE_URL = 'https://hariomwebsite.vercel.app'

var staticRoutes = [
  '', 'about', 'awards', 'brands', 'offers', 'products', 'services', 'stores', 'contact', 'commercial',
]

var dynamicSlugs = [
  'televisions', 'air-conditioners', 'refrigerators', 'washing-machines',
  'mobile-phones', 'tablets', 'laptops', 'audio-systems',
  'kitchen-appliances', 'industrial-appliances', 'atta-chakki', 'small-appliances',
]

export async function GET() {
  var urls = []

  staticRoutes.forEach(function (route) {
    urls.push({
      loc: BASE_URL + '/' + route,
      lastmod: '2026-07-01',
      changefreq: route === '' ? 'weekly' : 'monthly',
      priority: route === '' ? '1.0' : '0.8',
    })
  })

  dynamicSlugs.forEach(function (slug) {
    urls.push({
      loc: BASE_URL + '/products/' + slug,
      lastmod: '2026-07-01',
      changefreq: 'weekly',
      priority: '0.6',
    })
  })

  var xml = '<?xml version="1.0" encoding="UTF-8"?>'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  urls.forEach(function (u) {
    xml += '<url>'
    xml += '<loc>' + u.loc + '</loc>'
    xml += '<lastmod>' + u.lastmod + '</lastmod>'
    xml += '<changefreq>' + u.changefreq + '</changefreq>'
    xml += '<priority>' + u.priority + '</priority>'
    xml += '</url>'
  })
  xml += '</urlset>'

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
