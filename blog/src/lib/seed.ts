import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@blog.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@blog.com",
      password: hashedPassword,
    },
  });

  const category = await prisma.category.upsert({
    where: { slug: "tech" },
    update: {},
    create: { name: "技术", slug: "tech" },
  });

  const tag = await prisma.tag.upsert({
    where: { slug: "nextjs" },
    update: {},
    create: { name: "Next.js", slug: "nextjs" },
  });

  await prisma.post.upsert({
    where: { slug: "hello-world" },
    update: {},
    create: {
      title: "Hello World - 我的第一篇博客",
      slug: "hello-world",
      excerpt: "欢迎来到我的博客！这是用 Next.js + Prisma + PostgreSQL 搭建的个人博客网站。",
      content: `# Hello World!

欢迎来到我的博客！

这是一个使用 **Next.js** 全栈框架搭建的个人博客网站，具备以下特性：

## 技术栈

- **前端框架**: Next.js 16 (App Router)
- **样式**: Tailwind CSS（Apple 设计风格）
- **数据库**: PostgreSQL (Vercel Postgres)
- **ORM**: Prisma
- **认证**: NextAuth.js

## 功能

- 文章发布与管理
- Markdown 内容渲染
- 评论与回复
- 分类和标签
- 暗色模式
- 响应式设计

> 这篇文章是种子数据自动生成的，你可以在后台管理中编辑或删除它。

感谢阅读！`,
      coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
      published: true,
      categoryId: category.id,
      tags: { connect: [{ id: tag.id }] },
    },
  });

  console.log("Seed complete!");
  console.log("Admin: admin@blog.com / admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
