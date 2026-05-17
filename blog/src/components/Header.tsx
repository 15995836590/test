"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);

  function toggleTheme() {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          My Blog
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/" className="hover:text-accent transition-colors">首页</Link>
          <Link href="/category" className="hover:text-accent transition-colors">分类</Link>
          <Link href="/tag" className="hover:text-accent transition-colors">标签</Link>
          <Link href="/about" className="hover:text-accent transition-colors">关于</Link>
          <button onClick={toggleTheme} className="p-1.5 rounded-full hover:bg-card transition-colors">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <button
          className="md:hidden p-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-border px-6 py-4 space-y-3 bg-background">
          <Link href="/" className="block" onClick={() => setMenuOpen(false)}>首页</Link>
          <Link href="/category" className="block" onClick={() => setMenuOpen(false)}>分类</Link>
          <Link href="/tag" className="block" onClick={() => setMenuOpen(false)}>标签</Link>
          <Link href="/about" className="block" onClick={() => setMenuOpen(false)}>关于</Link>
          <button onClick={toggleTheme} className="flex items-center gap-2">
            {dark ? <Sun size={16} /> : <Moon size={16} />} 切换主题
          </button>
        </div>
      )}
    </header>
  );
}
