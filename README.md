# 人工智能与自动化学院不完全指南

一个由学生共同维护的非官方学习与成长指南。项目使用 Nuxt 4、Vue 3 和 Nuxt Content 构建。

## 开始开发

环境要求：Node.js 22 或更高版本，pnpm 10 或更高版本。

```bash
pnpm install
pnpm dev
```

默认访问 `http://localhost:3000`。常用检查命令：

```bash
pnpm lint
pnpm typecheck
pnpm validate
pnpm generate
```

## 项目结构

```text
smart-college-guide/
|-- app/                    网站界面与前端逻辑
|   |-- assets/css/         全站样式
|   |-- components/         页头、页脚、搜索、指南布局等复用组件
|   |-- composables/        搜索和站点信息等可复用逻辑
|   |-- data/               补充培养方案与课程资料下载清单
|   |-- pages/              页面路由，每个 Vue 文件对应一个网址
|   |-- utils/              指南目录等通用工具
|   |-- app.vue             全站页面外壳
|   `-- error.vue           错误页面
|-- content/                可直接编辑的结构化内容
|   |-- competitions/       竞赛介绍
|   |-- courses/            课程百科
|   |-- curricula/          培养方案
|   |-- faq/                常见问题
|   `-- guides/             新生指南、老生指南及迁移参考文章
|-- public/                 浏览器可直接访问的静态文件
|   |-- branding/           学院标志和首页图片
|   |-- materials/          学习资料下载文件
|   `-- reference/          迁移指南使用的原始图片资源
|-- scripts/                内容导入、规范化和校验脚本
|-- infra/                  Caddy 部署配置与部署说明
|-- content.config.ts       Nuxt Content 内容集合与字段规则
|-- nuxt.config.ts          Nuxt 模块、页面标题和构建配置
|-- package.json            依赖与常用命令
|-- pnpm-lock.yaml          依赖版本锁定文件，不手工修改
|-- pnpm-workspace.yaml     pnpm 本地构建依赖许可
|-- eslint.config.mjs       代码检查配置
|-- tsconfig.json           TypeScript 配置入口
|-- CONTENT_GUIDE.md        内容字段和写作规则
|-- CONTRIBUTING.md         参与贡献说明
`-- LOCAL_DEVELOPMENT.md    本地开发与内容导入说明
```

## 主要编辑入口

### 修改页面

进入 `app/pages/` 找到对应路由：

- `/resources`：`app/pages/resources.vue`
- `/courses`：`app/pages/courses/index.vue`
- `/competitions`：`app/pages/competitions/index.vue`
- `/community`：`app/pages/community.vue`
- 首页：`app/pages/index.vue`

通用页头和页脚分别位于 `app/components/AppHeader.vue` 与 `app/components/AppFooter.vue`。全站样式集中在 `app/assets/css/main.css`。

### 修改文章和课程

日常内容主要编辑 `content/` 下的 Markdown 或 YAML 文件：

- 新生指南和参考文章：`content/guides/`
- 课程：`content/courses/`
- 培养方案：`content/curricula/`
- 竞赛：`content/competitions/`
- FAQ：`content/faq/`

`content/guides/reference/` 中的文件使用文章标题命名，方便直接查找和维护。每篇文章 frontmatter 内的 `slug` 是导航使用的稳定标识，调整标题或文件名时不要同步修改 `slug`。

### 添加学习资料

课程资料以独立文件保存在 `public/materials/files/<资料组>/`，页面按课程展示文件列表，并提供搜索、单文件下载及可用格式的在线预览。同一个资料组可以映射给多个专业中的同名课程，文件不会重复占用磁盘。

- `pnpm sync:materials:dry`：扫描资料站并统计待同步文件，不写入项目。
- `pnpm sync:materials`：补齐匹配课程的独立文件并更新 `app/data/courseMaterialFiles.json`。
- `pnpm sync:materials:force`：重新下载所有匹配文件并更新清单。
- `scripts/sync-course-materials.mjs`：维护资料站目录与培养方案课程 slug 的对应关系。
- `app/data/courseMaterials.ts`：读取生成清单，向页面提供下载项；通常不需要手工登记。

PDF、图片、文本、音频和视频使用浏览器本地预览；Office 文档通过原资料库页面预览。同步脚本会排除已标注为“不建议参考”的旧版资料。新增映射前应检查来源、版权和课程对应关系。

自动化培养方案的补充课程数据位于 `app/data/additionalCurricula.ts`，人工智能培养方案位于 `app/data/artificialIntelligenceCurriculum.ts`。

## 自动生成目录

以下目录不是源码，通常不需要查看或手工修改：

- `node_modules/`：`pnpm install` 安装的依赖，删除后可重新安装。
- `.nuxt/`：开发和类型检查产生的 Nuxt 缓存。
- `.data/`：Nuxt Content 的本地索引数据库。
- `.output/`：生产构建输出，由 `pnpm build` 或 `pnpm generate` 重新生成。
- `dist/`：静态生成输出的兼容入口，存在时同样属于构建结果。

这些目录已写入 `.gitignore`。清理磁盘时可以在停止开发服务后删除，重新运行命令会自动生成。

## 外层原始资料

项目外层的 PDF、DOC 和 JPG 文件是培养方案、竞赛政策与首页图片的原始来源，不属于网站运行目录。`smart-college-guide-20260810.tar.gz` 是旧版本备份；当前项目尚未建立 Git 仓库，因此暂时保留。

## 内容原则

涉及培养方案、课程安排、考试、竞赛和奖学金的信息，应区分官方信息、学生经验和未核实内容，并提醒读者以学校和学院最新通知为准。不要上传盗版资料、个人隐私、考试泄题或未经许可的内部文件。
