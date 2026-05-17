import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [postCount, commentCount, posts] = await Promise.all([
    prisma.post.count(),
    prisma.comment.count(),
    prisma.post.findMany({ select: { viewCount: true } }),
  ]);

  const totalViews = posts.reduce((sum, p) => sum + p.viewCount, 0);

  return NextResponse.json({ postCount, commentCount, totalViews });
}
