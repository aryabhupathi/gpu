// import { NextApiRequest, NextApiResponse } from 'next';
// import { getSession } from 'next-auth/react';
// import prisma from '@/lib/prisma';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { id } = req.query;
//   const session = await getSession({ req });

//   if (!id || typeof id !== 'string') {
//     return res.status(400).json({ error: 'Invalid forum ID' });
//   }

//   // GET - Get forum by ID
//   if (req.method === 'GET') {
//     try {
//       const forum = await prisma.forum.findUnique({
//         where: { id },
//         include: {
//           user: {
//             select: {
//               id: true,
//               name: true,
//               image: true,
//             },
//           },
//           tags: {
//             include: {
//               tag: true,
//             },
//           },
//           comments: {
//             include: {
//               user: {
//                 select: {
//                   name: true,
//                   image: true,
//                 },
//               },
//             },
//             orderBy: {
//               createdAt: 'desc',
//             },
//           },
//           _count: {
//             select: {
//               likes: true,
//             },
//           },
//         },
//       });

//       if (!forum) {
//         return res.status(404).json({ error: 'Forum not found' });
//       }

//       // Check if current user has liked this forum
//       let userLiked = false;
//       if (session?.user?.id) {
//         const like = await prisma.like.findUnique({
//           where: {
//             userId_forumId: {
//               userId: session.user.id,
//               forumId: id,
//             },
//           },
//         });
//         userLiked = !!like;
//       }

//       return res.status(200).json({ ...forum, userLiked });
//     } catch (error) {
//       return res.status(500).json({ error: 'Failed to fetch forum' });
//     }
//   }

//   // PUT - Update forum by ID
//   if (req.method === 'PUT') {
//     if (!session) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     try {
//       // Check if user is the owner of the forum
//       const forum = await prisma.forum.findUnique({
//         where: { id },
//         select: { userId: true },
//       });

//       if (!forum) {
//         return res.status(404).json({ error: 'Forum not found' });
//       }

//       if (forum.userId !== session.user.id) {
//         return res.status(403).json({ error: 'Forbidden: You can only update your own forums' });
//       }

//       const { title, description, tags } = req.body;

//       if (!title || !description) {
//         return res.status(400).json({ error: 'Title and description are required' });
//       }

//       // First, delete all existing tag relations
//       await prisma.forumTag.deleteMany({
//         where: { forumId: id },
//       });

//       // Then update the forum with new data
//       const updatedForum = await prisma.forum.update({
//         where: { id },
//         data: {
//           title,
//           description,
//           tags: {
//             create: tags ? tags.map((tagName: string) => ({
//               tag: {
//                 connectOrCreate: {
//                   where: { name: tagName },
//                   create: { name: tagName },
//                 },
//               },
//             })) : [],
//           },
//         },
//         include: {
//           user: {
//             select: {
//               name: true,
//               image: true,
//             },
//           },
//           tags: {
//             include: {
//               tag: true,
//             },
//           },
//         },
//       });

//       return res.status(200).json(updatedForum);
//     } catch (error) {
//       return res.status(500).json({ error: 'Failed to update forum' });
//     }
//   }

//   // DELETE - Delete forum by ID
//   if (req.method === 'DELETE') {
//     if (!session) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     try {
//       // Check if user is the owner of the forum
//       const forum = await prisma.forum.findUnique({
//         where: { id },
//         select: { userId: true },
//       });

//       if (!forum) {
//         return res.status(404).json({ error: 'Forum not found' });
//       }

//       if (forum.userId !== session.user.id) {
//         return res.status(403).json({ error: 'Forbidden: You can only delete your own forums' });
//       }

//       // Delete forum
//       await prisma.forum.delete({
//         where: { id },
//       });

//       return res.status(200).json({ message: 'Forum deleted successfully' });
//     } catch (error) {
//       return res.status(500).json({ error: 'Failed to delete forum' });
//     }
//   }

//   return res.status(405).json({ error: 'Method not allowed' });
// }


import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const forum = await prisma.forum.findUnique({
    where: { id: params.id },
    include: { user: true, comments: true }
  });

  if (!forum) return NextResponse.json({ error: "Not Found" }, { status: 404 });
  return NextResponse.json(forum);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.forum.findUnique({
    where: { id: params.id },
    include: { user: true }
  });

  if (existing?.user?.email !== session.user?.email)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { title, description, tags } = await req.json();
  const updated = await prisma.forum.update({
    where: { id: params.id },
    data: { title, description, tags }
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.forum.findUnique({
    where: { id: params.id },
    include: { user: true }
  });

  if (existing?.user?.email !== session.user?.email)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.forum.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Forum deleted" });
}
