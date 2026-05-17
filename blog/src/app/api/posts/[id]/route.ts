import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const post = await prisma.post.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { category: true, tags: true, comments: { orderBy: { createdAt: "desc" } } },
  });

  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.post.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } });

  return NextResponse.json(post);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { title, content, excerpt, coverImage, categoryId, tagIds, published } = body;

  const post = await prisma.post.update({
    where: { id },
    data: {
      title,
      content,
      excerpt,
      coverImage,
      published,
      categoryId: categoryId || null,
      tags: { set: tagIds?.map((tid: string) => ({ id: tid })) || [] },
    },
    include: { category: true, tags: true },
  });

  return NextResponse.json(post);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
