// import { NextApiRequest, NextApiResponse } from 'next';
// import { getSession } from 'next-auth/react';
// import prisma from '@/lib/prisma';
// import { hash } from 'bcryptjs';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const session = await getSession({ req });

//   // GET - Get all forums
//   if (req.method === 'GET') {
//     try {
//       const forums = await prisma.forum.findMany({
//         orderBy: {
//           createdAt: 'desc',
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
//           _count: {
//             select: {
//               comments: true,
//               likes: true,
//             },
//           },
//         },
//       });
      
//       return res.status(200).json(forums);
//     } catch (error) {
//       return res.status(500).json({ error: 'Failed to fetch forums' });
//     }
//   }

//   // POST - Create a new forum
//   if (req.method === 'POST') {
//     if (!session) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     const { title, description, tags } = req.body;

//     if (!title || !description) {
//       return res.status(400).json({ error: 'Title and description are required' });
//     }

//     try {
//       const forum = await prisma.forum.create({
//         data: {
//           title,
//           description,
//           user: {
//             connect: {
//               id: session.user.id,
//             },
//           },
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

//       return res.status(201).json(forum);
//     } catch (error) {
//       return res.status(500).json({ error: 'Failed to create forum' });
//     }
//   }

//   return res.status(405).json({ error: 'Method not allowed' });
// }


// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function GET() {
//   const forums = await prisma.forum.findMany({
//     include: { user: true },
//     orderBy: { createdAt: "desc" }
//   });
//   return NextResponse.json(forums);
// }

// export async function POST(req: Request) {
//   const session = await getServerSession(authOptions);
//   if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const { title, description, tags } = await req.json();
//   const forum = await prisma.forum.create({
//     data: {
//       title,
//       description,
//       tags,
//       user: { connect: { email: session.user?.email! } }
//     }
//   });

//   return NextResponse.json(forum);
// }


import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const forums = await prisma.forum.findMany({
    include: {
      user: true,
      tags: { include: { tag: true } },
      likes: true,
      comments: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(forums);
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, tags } = await req.json();

    // Create or connect tags
    const tagConnections = tags.map((tagName: string) => ({
      tag: {
        connectOrCreate: {
          where: { name: tagName.toLowerCase() },
          create: { name: tagName.toLowerCase() },
        },
      },
    }));

    const forum = await prisma.forum.create({
      data: {
        title,
        description,
        user: {
          connect: { email: session.user.email },
        },
        tags: {
          create: tagConnections,
        },
      },
      include: {
        tags: { include: { tag: true } },
        user: true,
      },
    });

    return NextResponse.json(forum);
  } catch (error) {
    console.error("Error creating forum:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
