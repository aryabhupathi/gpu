// import { NextApiRequest, NextApiResponse } from 'next';
// import { getSession } from 'next-auth/react';
// import prisma from '@/lib/prisma';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const session = await getSession({ req });

//   // POST - Create a new comment
//   if (req.method === 'POST') {
//     if (!session) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     const { forumId, content } = req.body;

//     if (!forumId || !content) {
//       return res.status(400).json({ error: 'Forum ID and content are required' });
//     }

//     try {
//       const comment = await prisma.comment.create({
//         data: {
//           content,
//           user: {
//             connect: {
//               id: session.user.id,
//             },
//           },
//           forum: {
//             connect: {
//               id: forumId,
//             },
//           },
//         },
//         include: {
//           user: {
//             select: {
//               name: true,
//               image: true,
//             },
//           },
//         },
//       });

//       return res.status(201).json(comment);
//     } catch (error) {
//       return res.status(500).json({ error: 'Failed to create comment' });
//     }
//   }

//   return res.status(405).json({ error: 'Method not allowed' });
// }

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { forumId, content } = await req.json();

  // Validate that content is not empty
  if (!content.trim()) {
    return NextResponse.json({ error: "Comment content cannot be empty" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      forum: { connect: { id: forumId } },
      user: { connect: { email: session.user.email } }
    },
    include: {
      user: true, // 👈 this is what was missing
    }
  });
  

  return NextResponse.json(comment);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const forumId = searchParams.get("forumId");

  if (!forumId) return NextResponse.json({ error: "Forum ID required" }, { status: 400 });

  const comments = await prisma.comment.findMany({
    where: { forumId },
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(comments);
}

