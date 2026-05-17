import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const existing = await prisma.user.findUnique({ where: { email: "admin@blog.com" } });
    if (existing) {
      return NextResponse.json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash("admin123", 12);
    await prisma.user.create({
      data: { name: "Admin", email: "admin@blog.com", password: hashedPassword },
    });

    await prisma.category.createMany({
      data: [
        { name: "技术", slug: "tech" },
        { name: "生活", slug: "life" },
      ],
      skipDuplicates: true,
    });

    await prisma.tag.createMany({
      data: [
        { name: "Next.js", slug: "nextjs" },
        { name: "React", slug: "react" },
      ],
      skipDuplicates: true,
    });

    const category = await prisma.category.findUnique({ where: { slug: "tech" } });
    const tag = await prisma.tag.findUnique({ where: { slug: "nextjs" } });

    await prisma.post.create({
      data: {
        title: "Hello World - 我的第一篇博客",
        slug: "hello-world",
        excerpt: "欢迎来到我的博客！这是用 Next.js + Prisma + PostgreSQL 搭建的个人博客网站。",
        content: `# Hello World!\n\n欢迎来到我的博客！\n\n这是一个使用 **Next.js** 全栈框架搭建的个人博客网站。\n\n## 功能\n\n- 文章发布与管理\n- Markdown 渲染\n- 评论与回复\n- 分类和标签\n- 暗色模式\n\n感谢阅读！`,
        coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
        published: true,
        categoryId: category?.id,
        tags: tag ? { connect: [{ id: tag.id }] } : undefined,
      },
    });

    return NextResponse.json({ message: "Seed complete! Admin: admin@blog.com / admin123" });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
