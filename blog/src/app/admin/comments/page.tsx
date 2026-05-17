"use client";

import { useEffect, useState } from "react";
import { Trash2, Reply } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import toast from "react-hot-toast";
import AdminShell from "@/components/AdminShell";

interface Comment {
  id: string;
  content: string;
  nickname: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  postId: string;
  post: { id: string; title: string; slug: string };
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => { fetchComments(); }, []);

  async function fetchComments() {
    const res = await fetch("/api/comments");
    setComments(await res.json());
  }

  async function deleteComment(id: string) {
    if (!confirm("确定删除此评论？")) return;
    await fetch(`/api/comments/${id}`, { method: "DELETE" });
    toast.success("已删除");
    fetchComments();
  }

  async function submitReply(postId: string) {
    if (!replyContent.trim()) return;
    const comment = comments.find((c) => c.id === replyTo);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: replyContent,
        nickname: "博主",
        email: "admin@blog.com",
        postId,
        parentId: replyTo,
      }),
    });
    if (res.ok) {
      toast.success("回复成功");
      setReplyTo(null);
      setReplyContent("");
      fetchComments();
    }
  }

  return (
    <AdminShell>
    <div>
      <h1 className="text-2xl font-bold mb-6">评论管理</h1>

      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 rounded-2xl border border-border bg-card">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {comment.nickname}
                    {comment.isAdmin && (
                      <span className="ml-1.5 text-xs bg-accent/10 text-accent px-1.5 py-0.5 rounded">博主</span>
                    )}
                  </span>
                  <span className="text-xs text-muted">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: zhCN })}
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
                <p className="text-xs text-muted mt-1">
                  文章: {comment.post?.title}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setReplyTo(comment.id); setReplyContent(""); }}
                  className="p-1.5 hover:text-accent"
                >
                  <Reply size={15} />
                </button>
                <button onClick={() => deleteComment(comment.id)} className="p-1.5 hover:text-red-500">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {replyTo === comment.id && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="输入回复..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  autoFocus
                />
                <button
                  onClick={() => submitReply(comment.postId)}
                  className="px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-accent-hover"
                >
                  回复
                </button>
                <button
                  onClick={() => setReplyTo(null)}
                  className="px-3 py-2 text-sm text-muted hover:text-foreground"
                >
                  取消
                </button>
              </div>
            )}
          </div>
        ))}
        {comments.length === 0 && <p className="text-center py-8 text-muted">暂无评论</p>}
      </div>
    </div>
    </AdminShell>
  );
}
