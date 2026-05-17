import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");

  const where: Record<string, unknown> = {};
  if (postId) where.postId = postId;

  const comments = await prisma.comment.findMany({
    where,
    include: { post: { select: { id: true, title: true, slug: true } }, replies: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(comments);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { content, nickname, email, postId, parentId } = body;

  if (!content || !nickname || !email || !postId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const isAdmin = !!session;

  const comment = await prisma.comment.create({
    data: {
      content,
      nickname: isAdmin ? "博主" : nickname,
      email,
      postId,
      parentId: parentId || null,
      isAdmin,
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
