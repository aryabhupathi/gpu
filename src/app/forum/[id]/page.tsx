import prisma from "@/lib/prisma";
import ForumDetailClient from "./ForumDetailClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";

import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const forum = await prisma.forum.findUnique({
    where: { id },
    include: { user: { select: { name: true } } }
  });

  if (!forum || forum.isPrivate) {
    return { title: "Post Not Found | letstalk" };
  }

  // Strip HTML tags for description
  const cleanDescription = forum.description.replace(/<[^>]+>/g, '').substring(0, 160) + "...";

  return {
    title: `${forum.title} | letstalk`,
    description: cleanDescription,
    openGraph: {
      title: forum.title,
      description: cleanDescription,
      type: "article",
      authors: [forum.user.name || "Anonymous"],
      images: forum.mediaUrl ? [forum.mediaUrl] : []
    },
    twitter: {
      card: "summary_large_image",
      title: forum.title,
      description: cleanDescription,
      images: forum.mediaUrl ? [forum.mediaUrl] : []
    }
  };
}

export default async function ForumDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  const forum = await prisma.forum.findUnique({
    where: { id },
    include: {
      user: true,
      comments: {
        include: {
          user: true,
          likes: true,
        },
        orderBy: { createdAt: "desc" },
      },
      likes: true,
    },
  });

  if (!forum) return notFound();

  let currentUser = null;
  if (userEmail) {
    currentUser = await prisma.user.findUnique({ 
      where: { email: userEmail },
      select: { id: true, email: true, name: true, role: true }
    });
  }

  // Privacy Check
  if (forum.isPrivate) {
    if (!currentUser) return notFound();
    if (currentUser.id !== forum.userId && currentUser.role !== "ADMIN") {
      const isFollowing = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUser.id,
            followingId: forum.userId
          }
        }
      });
      if (!isFollowing) {
        return (
          <div style={{ textAlign: "center", padding: "100px 20px" }}>
            <h1>This post is private.</h1>
            <p>You must follow the author to view this post.</p>
          </div>
        );
      }
    }
  }

  const userLikedForum = currentUser ? forum.likes.some(like => like.userId === currentUser.id) : false;
  
  let userBookmarkedForum = false;
  if (currentUser) {
    const bm = await prisma.bookmark.findUnique({
      where: {
        userId_forumId: { userId: currentUser.id, forumId: forum.id }
      }
    });
    userBookmarkedForum = !!bm;
  }

  const commentsWithLikes = forum.comments.map(comment => ({
    ...comment,
    userLiked: currentUser ? comment.likes.some(like => like.userId === currentUser.id) : false,
    _count: { likes: comment.likes.length }
  }));

  return (
    <ForumDetailClient 
      forum={{ ...forum, _count: { likes: forum.likes.length }, userLiked: userLikedForum, userBookmarked: userBookmarkedForum }} 
      initialComments={commentsWithLikes} 
      user={currentUser} 
    />
  );
}
