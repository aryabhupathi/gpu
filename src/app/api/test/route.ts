// /app/api/test/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";  // Import the Prisma client

export async function GET() {
  try {
    // Example: Fetch all users from the database
    const users = await prisma.user.findMany();
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
