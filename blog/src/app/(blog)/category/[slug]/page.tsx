import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { published: true },
        include: { category: true, tags: true, _count: { select: { comments: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!category) notFound();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">分类: {category.name}</h1>
      <p className="text-muted mb-8">{category.posts.length} 篇文章</p>

      <div className="grid gap-10 md:grid-cols-2">
        {category.posts.map((post) => (
          <PostCard key={post.id} post={{ ...post, createdAt: post.createdAt.toISOString() }} />
        ))}
      </div>
    </div>
  );
}
