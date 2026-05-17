import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await request.json();
  const slug = name.toLowerCase().replace(/[^a-z0-9一-龥]+/g, "-").replace(/(^-|-$)/g, "");

  const category = await prisma.category.create({ data: { name, slug } });
  return NextResponse.json(category, { status: 201 });
}
