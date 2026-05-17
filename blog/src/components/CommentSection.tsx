"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import toast from "react-hot-toast";

interface Comment {
  id: string;
  content: string;
  nickname: string;
  isAdmin: boolean;
  parentId: string | null;
  createdAt: string;
  replies?: Comment[];
}

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  async function fetchComments() {
    const res = await fetch(`/api/comments?postId=${postId}`);
    const data = await res.json();
    setComments(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nickname || !email || !content) {
      toast.error("请填写所有字段");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, email, content, postId, parentId: replyTo }),
    });
    if (res.ok) {
      toast.success("评论成功");
      setContent("");
      setReplyTo(null);
      fetchComments();
    } else {
      toast.error("评论失败");
    }
    setLoading(false);
  }

  const topLevel = comments.filter((c) => !c.parentId);

  function renderComment(comment: Comment) {
    const replies = comments.filter((c) => c.parentId === comment.id);
    return (
      <div key={comment.id} className="py-4 border-b border-border last:border-0">
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
        <p className="text-sm text-foreground/80 leading-relaxed">{comment.content}</p>
        <button
          onClick={() => setReplyTo(comment.id)}
          className="mt-1 text-xs text-accent hover:underline"
        >
          回复
        </button>
        {replies.length > 0 && (
          <div className="ml-6 mt-2 border-l-2 border-border pl-4">
            {replies.map(renderComment)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h3 className="text-lg font-semibold mb-4">评论 ({comments.length})</h3>

      <form onSubmit={handleSubmit} className="mb-8 space-y-3">
        {replyTo && (
          <div className="text-sm text-muted flex items-center gap-2">
            回复评论中...
            <button onClick={() => setReplyTo(null)} className="text-accent hover:underline">取消</button>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="昵称"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <input
            type="email"
            placeholder="邮箱（不会公开）"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <textarea
          placeholder="写下你的评论..."
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-accent text-white text-sm rounded-full hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {loading ? "提交中..." : "发表评论"}
        </button>
      </form>

      <div>{topLevel.map(renderComment)}</div>
    </div>
  );
}
