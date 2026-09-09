import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'http://localhost:3000' // In production, this would be process.env.NEXT_PUBLIC_BASE_URL or similar

  // Fetch all public forums
  const forums = await prisma.forum.findMany({
    where: { isPrivate: false },
    select: { id: true, updatedAt: true },
  })

  const forumUrls = forums.map((forum) => ({
    url: `${baseUrl}/forum/${forum.id}`,
    lastModified: forum.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Fetch all users
  const users = await prisma.user.findMany({
    select: { id: true, updatedAt: true },
  })

  const userUrls = users.map((user) => ({
    url: `${baseUrl}/u/${user.id}`,
    lastModified: user.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

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
