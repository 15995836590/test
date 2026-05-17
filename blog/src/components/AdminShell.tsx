"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, FolderOpen, MessageSquare, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>;
  }

  if (!session) return null;

  const links = [
    { href: "/admin", label: "仪表盘", icon: LayoutDashboard },
    { href: "/admin/posts", label: "文章", icon: FileText },
    { href: "/admin/categories", label: "分类", icon: FolderOpen },
    { href: "/admin/comments", label: "评论", icon: MessageSquare },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r border-border bg-card min-h-screen p-4 flex flex-col">
        <div className="text-lg font-semibold mb-8 px-2">后台管理</div>
        <nav className="flex-1 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-accent/10 text-accent font-medium"
                    : "text-foreground/70 hover:text-foreground hover:bg-card"
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-3 py-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
        >
          <LogOut size={18} />
          退出登录
        </button>
      </aside>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
