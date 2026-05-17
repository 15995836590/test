import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

interface PostCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string;
    createdAt: string;
    category?: { name: string; slug: string } | null;
    tags?: { name: string; slug: string }[];
    _count?: { comments: number };
    viewCount: number;
  };
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group">
      <Link href={`/post/${post.slug}`} className="block">
        {post.coverImage && (
          <div className="overflow-hidden rounded-2xl mb-4 bg-card aspect-[2/1]">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <h2 className="text-xl font-semibold tracking-tight group-hover:text-accent transition-colors">
          {post.title}
        </h2>
      </Link>
      <p className="mt-2 text-muted text-sm line-clamp-2 leading-relaxed">
        {post.excerpt}
      </p>
      <div className="mt-3 flex items-center gap-3 text-xs text-muted">
        {post.category && (
          <Link href={`/category/${post.category.slug}`} className="hover:text-accent">
            {post.category.name}
          </Link>
        )}
        <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: zhCN })}</span>
        <span>{post.viewCount} 阅读</span>
        {post._count && <span>{post._count.comments} 评论</span>}
      </div>
    </article>
  );
}
