import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { prisma } from "@/lib/prisma";
import CommentSection from "@/components/CommentSection";
import Link from "next/link";
import { connection } from "next/server";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: { category: true, tags: true },
  });

  if (!post || !post.published) notFound();

  await prisma.post.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } });

  return (
    <article className="max-w-3xl mx-auto">
      {post.coverImage && (
        <div className="rounded-2xl overflow-hidden mb-8 aspect-[2.5/1]">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
        {post.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
        {post.category && (
          <Link href={`/category/${post.category.slug}`} className="hover:text-accent">
            {post.category.name}
          </Link>
        )}
        <span>{formatDistanceToNow(post.createdAt, { addSuffix: true, locale: zhCN })}</span>
        <span>{post.viewCount} 阅读</span>
      </div>

      {post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="text-xs px-2.5 py-1 rounded-full bg-card border border-border hover:border-accent hover:text-accent transition-colors"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10 prose prose-neutral dark:prose-invert max-w-none leading-relaxed">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      <CommentSection postId={post.id} />
    </article>
  );
}
