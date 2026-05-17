import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">标签</h1>
      {tags.length === 0 ? (
        <p className="text-muted">暂无标签</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="px-4 py-2 rounded-full border border-border hover:border-accent hover:text-accent bg-card transition-colors text-sm"
            >
              {tag.name} ({tag._count.posts})
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
