// import { NextApiRequest, NextApiResponse } from 'next';
// import { getSession } from 'next-auth/react';
// import prisma from '@/lib/prisma';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { id } = req.query;
//   const session = await getSession({ req });

//   if (!id || typeof id !== 'string') {
//     return res.status(400).json({ error: 'Invalid comment ID' });
//   }

//   // DELETE - Delete comment by ID
//   if (req.method === 'DELETE') {
//     if (!session) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     try {
//       // Check if user is the owner of the comment
//       const comment = await prisma.comment.findUnique({
//         where: { id },
//         select: { userId: true },
//       });

//       if (!comment) {
//         return res.status(404).json({ error: 'Comment not found' });
//       }

//       if (comment.userId !== session.user.id) {
//         return res.status(403).json({ error: 'Forbidden: You can only delete your own comments' });
//       }

//       // Delete comment
//       await prisma.comment.delete({
//         where: { id },
//       });

//       return res.status(200).json({ message: 'Comment deleted successfully' });
//     } catch (error) {
//       return res.status(500).json({ error: 'Failed to delete comment' });
//     }
//   }

//   return res.status(405).json({ error: 'Method not allowed' });
// }


import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const comment = await prisma.comment.findUnique({
    where: { id: params.id },
    include: { user: true }
  });

  if (!comment || comment.user.email !== session.user.email)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.comment.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Comment deleted" });
}
