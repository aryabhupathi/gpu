import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, identifier, password } = await req.json();
  if (!name || !identifier || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const isEmail = identifier.includes("@");

  const existingUser = await prisma.user.findFirst({
    where: isEmail ? { email: identifier } : { phone: identifier },
  });
  
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email: isEmail ? identifier : null,
      phone: !isEmail ? identifier : null,
      password: hashedPassword,
    },
  });
  return NextResponse.json({ message: "User created", user });
}
