import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const comment = await prisma.comment.findUnique({
    where: { id: params.id },
    include: { user: true },
  });
  if (!comment || comment.user.email !== session.user.email)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await prisma.comment.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Comment deleted" });
}
