@AGENTS.md

# 项目背景

这是一个用 Vibe Coding 方式搭建的个人博客网站，全程由 AI 写代码，用户不写一行代码。
用户是技术小白，正在学习 Vibe Coding，目标是通过自然语言描述需求让 AI 完成所有开发工作。

## 在线地址

- 前台：https://my-blog-ten-virid.vercel.app
- 后台：https://my-blog-ten-virid.vercel.app/admin（默认账号 admin，密码用户已自行修改）

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 16.2.6 | 全栈框架（App Router） |
| Tailwind CSS | v4 | 样式，Apple 风格极简设计 |
| Prisma | 6.19.3 | 数据库 ORM |
| PostgreSQL | - | 云数据库，托管在 Neon |
| NextAuth.js | v4 | 登录认证，JWT 策略 |
| bcryptjs | - | 密码哈希 |
| React Markdown + remark-gfm | - | Markdown 渲染 |
| @vercel/blob | - | 图片存储 |
| Vercel | - | 部署托管 |

## 环境变量（配置在 Vercel Dashboard）

- `POSTGRES_URL` / `POSTGRES_URL_NON_POOLING` — Neon 数据库
- `NEXTAUTH_SECRET` — NextAuth 密钥
- `NEXTAUTH_URL` — 部署地址
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob 图片存储

## Git 远程仓库

- `origin` — 任务远程（127.0.0.1），开发分支：`claude/blog-website-setup-WgTv5`
- `github` — GitHub（https://github.com/15995836590/my-blog.git），Vercel 从 `main` 分支自动部署

每次推送命令：
```
git push github claude/blog-website-setup-WgTv5:main && git push -u origin claude/blog-website-setup-WgTv5
```

## 项目结构

```
blog/
  prisma/         数据库 schema
  public/         静态资源
  screenshots/    教程截图（18个占位文件，待替换）
  src/
    app/
      (blog)/     前台页面（首页、文章详情、分类、标签）
      admin/      后台管理（文章、分类、评论、设置）
      api/        API 路由
    components/   公共组件（AdminShell、ImageUpload、PostCard 等）
    lib/          工具函数（prisma、auth 配置）
```

## 重要技术细节（踩过的坑）

- **Next.js 16 breaking changes**：`params` 是 Promise，必须 `await params`；`cookies()`/`headers()` 也是异步的
- **强制动态渲染**：用 `await headers()` from `next/headers`（不要用 `export const dynamic` 或 `connection()`，在 Next.js 16 里不生效）
- **中文 slug 问题**：文章 slug 只用 ASCII 字符，避免 URL 编码问题
- **AdminShell 模式**：admin layout 只包 SessionProvider，每个 admin 页面自己引入 `<AdminShell>` 组件

## 已完成功能

- 前台：文章列表/详情、分类/标签浏览、评论、暗色模式、响应式
- 后台：文章 CRUD（Markdown 编辑器）、封面图本地上传、分类管理、评论管理、数据统计、密码修改
- 教程：`blog/tutorial.md`（从0到1搭建博客的完整教程，面向零基础用户）

## 待办 / 未来计划

- [ ] 替换 `blog/screenshots/` 里的18个占位截图为真实截图
- [ ] 清理临时接口：`/api/seed`、`/api/debug`
- [ ] 新项目：推特长文章封面图自动生成工具（基于文章标题，用 `@vercel/og`）

## 用户偏好

- 解释要简单直白，类比生活中的例子，像给10岁小孩讲
- 不喜欢太多技术术语，遇到专有名词要顺带解释
- 代码改动后要同时推送到 `github` 和 `origin` 两个远程
