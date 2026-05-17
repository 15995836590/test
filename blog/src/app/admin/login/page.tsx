"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.ok) {
      router.push("/admin");
    } else {
      toast.error("邮箱或密码错误");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-8">后台登录</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>
        <p className="text-center text-xs text-muted mt-4">默认账号: admin@blog.com / admin123</p>
      </div>
    </div>
  );
}
