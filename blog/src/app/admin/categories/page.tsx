"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import AdminShell from "@/components/AdminShell";

interface Category { id: string; name: string; slug: string; _count: { posts: number } }

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");

  useEffect(() => { fetchCategories(); }, []);

  async function fetchCategories() {
    const res = await fetch("/api/categories");
    setCategories(await res.json());
  }

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    if (res.ok) {
      toast.success("分类已添加");
      setName("");
      fetchCategories();
    } else {
      toast.error("添加失败");
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm("确定删除此分类？")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    toast.success("已删除");
    fetchCategories();
  }

  return (
    <AdminShell>
    <div>
      <h1 className="text-2xl font-bold mb-6">分类管理</h1>

      <form onSubmit={addCategory} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="新分类名称"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 max-w-xs px-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <button type="submit" className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-full text-sm hover:bg-accent-hover transition-colors">
          <Plus size={16} /> 添加
        </button>
      </form>

      <div className="border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-card">
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 font-medium">名称</th>
              <th className="text-left px-4 py-3 font-medium">Slug</th>
              <th className="text-left px-4 py-3 font-medium">文章数</th>
              <th className="text-right px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{cat.name}</td>
                <td className="px-4 py-3 text-muted">{cat.slug}</td>
                <td className="px-4 py-3 text-muted">{cat._count.posts}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => deleteCategory(cat.id)} className="p-1.5 hover:text-red-500">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <p className="text-center py-8 text-muted">暂无分类</p>}
      </div>
    </div>
    </AdminShell>
  );
}
