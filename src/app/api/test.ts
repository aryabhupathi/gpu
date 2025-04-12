// pages/api/test-prisma.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";  // Import the Prisma client instance

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Example: Fetch all users from the database
    const users = await prisma.user.findMany();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: "Failed to connect to the database" });
  }
}
