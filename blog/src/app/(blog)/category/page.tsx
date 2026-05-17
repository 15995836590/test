import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { connection } from "next/server";

export default async function CategoriesPage() {
  await connection();

  const categories = await prisma.category.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">分类</h1>
      {categories.length === 0 ? (
        <p className="text-muted">暂无分类</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="p-6 rounded-2xl border border-border hover:border-accent bg-card transition-colors group"
            >
              <h2 className="font-semibold group-hover:text-accent transition-colors">{cat.name}</h2>
              <p className="text-sm text-muted mt-1">{cat._count.posts} 篇文章</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
