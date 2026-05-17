"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import AdminShell from "@/components/AdminShell";

interface Post {
  id: string;
  title: string;
  published: boolean;
  createdAt: string;
  category?: { name: string } | null;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    const res = await fetch("/api/posts?limit=100");
    const data = await res.json();
    setPosts(data.posts);
  }

  async function deletePost(id: string) {
    if (!confirm("确定删除此文章？")) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("已删除");
      fetchPosts();
    }
  }

  async function togglePublish(post: Post) {
    await fetch(`/api/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !post.published }),
    });
    fetchPosts();
  }

  return (
    <AdminShell>
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-full text-sm hover:bg-accent-hover transition-colors"
        >
          <Plus size={16} /> 写文章
        </Link>
      </div>

      <div className="border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-card">
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 font-medium">标题</th>
              <th className="text-left px-4 py-3 font-medium">分类</th>
              <th className="text-left px-4 py-3 font-medium">状态</th>
              <th className="text-right px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{post.title}</td>
                <td className="px-4 py-3 text-muted">{post.category?.name || "-"}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => togglePublish(post)}
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      post.published
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {post.published ? "已发布" : "草稿"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/posts/${post.id}`} className="p-1.5 hover:text-accent">
                      <Edit size={15} />
                    </Link>
                    <button onClick={() => deletePost(post.id)} className="p-1.5 hover:text-red-500">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && <p className="text-center py-8 text-muted">暂无文章</p>}
      </div>
    </div>
    </AdminShell>
  );
}
