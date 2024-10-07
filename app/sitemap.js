export const baseUrl = 'https://www.nestanote.com';

export default async function sitemap() {
  let routes = ['/','archive', 'search', 'settings', 'trash'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes,];
}
