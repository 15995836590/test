"use client";

import { useEffect, useState } from "react";
import { FileText, MessageSquare, Eye } from "lucide-react";
import AdminShell from "@/components/AdminShell";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ postCount: 0, commentCount: 0, totalViews: 0 });

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats);
  }, []);

  const cards = [
    { label: "文章数", value: stats.postCount, icon: FileText },
    { label: "评论数", value: stats.commentCount, icon: MessageSquare },
    { label: "总阅读量", value: stats.totalViews, icon: Eye },
  ];

  return (
    <AdminShell>
      <div>
        <h1 className="text-2xl font-bold mb-6">仪表盘</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="p-6 rounded-2xl border border-border bg-card">
                <div className="flex items-center gap-3 mb-2">
                  <Icon size={20} className="text-accent" />
                  <span className="text-sm text-muted">{card.label}</span>
                </div>
                <div className="text-3xl font-bold">{card.value}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminShell>
  );
}
