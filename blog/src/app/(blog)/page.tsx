import PostCard from "@/components/PostCard";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { category: true, tags: true, _count: { select: { comments: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div>
      <section className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">博客</h1>
        <p className="mt-2 text-muted">记录思考，分享见解</p>
      </section>

      {posts.length === 0 ? (
        <p className="text-muted text-center py-20">暂无文章</p>
      ) : (
        <div className="grid gap-10 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={{ ...post, createdAt: post.createdAt.toISOString() }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
