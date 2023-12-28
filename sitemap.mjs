import path from 'node:path';
import fs from 'node:fs/promises';

async function getRoadmapIds() {
  return fs.readdir(path.join(process.cwd(), 'src/data/roadmaps'));
}

async function getBestPracticesIds() {
  return fs.readdir(path.join(process.cwd(), 'src/data/best-practices'));
}

export function shouldIndexPage(pageUrl) {
  return ![
    'http://road-maps.cn/404',
    'http://road-maps.cn/terms',
    'http://road-maps.cn/privacy',
    'http://road-maps.cn/pdfs',
    'http://road-maps.cn/g',
  ].includes(pageUrl);
}

export async function serializeSitemap(item) {
  const highPriorityPages = [
    'http://road-maps.cn',
    'http://road-maps.cn/about',
    'http://road-maps.cn/roadmaps',
    'http://road-maps.cn/best-practices',
    'http://road-maps.cn/guides',
    'http://road-maps.cn/videos',
    ...(await getRoadmapIds()).flatMap((id) => [
      `http://road-maps.cn/${id}`,
      `http://road-maps.cn/${id}/topics`,
    ]),
    ...(await getBestPracticesIds()).map(
      (id) => `http://road-maps.cn/best-practices/${id}`
    ),
  ];

  // Roadmaps and other high priority pages
  for (let pageUrl of highPriorityPages) {
    if (item.url === pageUrl) {
      return {
        ...item,
        // @ts-ignore
        changefreq: 'monthly',
        priority: 1,
      };
    }
  }

  // Guide and video pages
  if (
    item.url.startsWith('http://road-maps.cn/guides') ||
    item.url.startsWith('http://road-maps.cn/videos')
  ) {
    return {
      ...item,
      // @ts-ignore
      changefreq: 'monthly',
      priority: 0.9,
    };
  }

  return undefined;
}
