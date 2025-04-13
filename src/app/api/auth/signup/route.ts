import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
  return NextResponse.json({ message: "User created", user });
}
