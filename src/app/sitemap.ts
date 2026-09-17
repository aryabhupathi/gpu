import { MetadataRoute } from 'next'
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXTAUTH_URL || "https://letstalk-community.vercel.app";
  let forumUrls: MetadataRoute.Sitemap = [];
  let userUrls: MetadataRoute.Sitemap = [];
  try {
    const forums = await prisma.forum.findMany({
      where: { isPrivate: false },
      select: { id: true, updatedAt: true },
    });
    forumUrls = forums.map((forum) => ({
      url: `${baseUrl}/forum/${forum.id}`,
      lastModified: forum.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));
    const users = await prisma.user.findMany({
      select: { id: true, updatedAt: true },
    });
    userUrls = users.map((user) => ({
      url: `${baseUrl}/u/${user.id}`,
      lastModified: user.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    console.error("Sitemap DB connection skipped during build");
  }
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: `${baseUrl}/forum`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    ...forumUrls,
    ...userUrls,
  ]
}
