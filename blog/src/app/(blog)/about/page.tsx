export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">关于我</h1>
      <div className="prose prose-neutral dark:prose-invert leading-relaxed">
        <p>
          欢迎来到我的博客！这里是我记录技术思考、生活感悟的个人空间。
        </p>
        <p>
          我热爱编程和写作，相信用文字梳理思路是最好的学习方式。
          如果你对我的文章有任何想法，欢迎在评论区留言交流。
        </p>
        <h2>联系方式</h2>
        <ul>
          <li>Email: hello@example.com</li>
          <li>GitHub: github.com/yourusername</li>
        </ul>
      </div>
    </div>
  );
}
