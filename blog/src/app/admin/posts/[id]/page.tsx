"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AdminShell from "@/components/AdminShell";

interface Category { id: string; name: string }
interface Tag { id: string; name: string }

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [published, setPublished] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/posts/${id}`).then((r) => r.json()).then((post) => {
      setTitle(post.title);
      setContent(post.content);
      setExcerpt(post.excerpt);
      setCoverImage(post.coverImage);
      setCategoryId(post.categoryId || "");
      setSelectedTags(post.tags?.map((t: Tag) => t.id) || []);
      setPublished(post.published);
    });
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
    fetch("/api/tags").then((r) => r.json()).then(setTags);
  }, [id]);

  async function handleSave() {
    if (!title || !content) { toast.error("标题和内容不能为空"); return; }
    setLoading(true);
    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, excerpt, coverImage, categoryId, tagIds: selectedTags, published }),
    });
    if (res.ok) {
      toast.success("保存成功");
      router.push("/admin/posts");
    } else {
      toast.error("保存失败");
    }
    setLoading(false);
  }

  return (
    <AdminShell>
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">编辑文章</h1>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="文章标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-border bg-card text-lg font-medium focus:outline-none focus:ring-2 focus:ring-accent/30"
        />

        <input
          type="text"
          placeholder="封面图 URL（可选）"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            <option value="">选择分类</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <div className="flex flex-wrap gap-2 items-center px-4 py-2.5 rounded-xl border border-border bg-card">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-1 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedTags([...selectedTags, tag.id]);
                    else setSelectedTags(selectedTags.filter((t) => t !== tag.id));
                  }}
                  className="rounded"
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>

        <textarea
          placeholder="文章摘要"
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/30"
        />

        <textarea
          placeholder="正文内容（支持 Markdown）"
          rows={20}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-accent/30"
        />

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="rounded"
            />
            发布
          </label>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2.5 bg-accent text-white rounded-full text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {loading ? "保存中..." : "保存"}
          </button>
          <button
            onClick={() => router.push("/admin/posts")}
            className="px-6 py-2.5 border border-border rounded-full text-sm hover:bg-card transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
    </AdminShell>
  );
}
