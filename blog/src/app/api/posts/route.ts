import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const published = searchParams.get("published");
  const categorySlug = searchParams.get("category");
  const tagSlug = searchParams.get("tag");

  const where: Record<string, unknown> = {};
  if (published === "true") where.published = true;
  if (published === "false") where.published = false;
  if (categorySlug) where.category = { slug: categorySlug };
  if (tagSlug) where.tags = { some: { slug: tagSlug } };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: { category: true, tags: true, _count: { select: { comments: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({ posts, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { title, content, excerpt, coverImage, categoryId, tagIds, published } = body;

  const asciiPart = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const slug = (asciiPart || "post") + "-" + Date.now().toString(36);

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      excerpt: excerpt || content.slice(0, 200),
      coverImage: coverImage || "",
      published: published || false,
      categoryId: categoryId || null,
      tags: tagIds?.length ? { connect: tagIds.map((id: string) => ({ id })) } : undefined,
    },
    include: { category: true, tags: true },
  });

  return NextResponse.json(post, { status: 201 });
}
