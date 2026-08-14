# 本地开发

## 环境

- Node.js 22 或更高版本
- pnpm 10 或更高版本

## 启动

解压后进入项目目录：

```bash
pnpm install
pnpm dev
```

默认打开 `http://localhost:3000`。如果端口被占用，Nuxt 会自动选择其他端口。

## 修改内容

- 新生指南和参考文章：`content/guides/`
- 课程：`content/courses/`
- 培养方案：`content/curricula/`
- 竞赛：`content/competitions/`
- FAQ：`content/faq/`
- 迁移后的参考图片：`public/reference/`

修改 Markdown 后运行：

```bash
pnpm lint
pnpm typecheck
pnpm validate
pnpm generate
```

参考项目的导入规则保存在 `scripts/import-reference.mjs`，一般不需要重新运行；如果重新导入，会覆盖 `content/guides/reference/` 下的迁移文件。
