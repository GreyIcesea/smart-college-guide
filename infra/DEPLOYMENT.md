# Linux 部署说明

本项目使用 Nuxt 静态生成，生产环境不需要长期运行 Nuxt 开发服务器。

## 首次部署

服务器需要 Node.js 22+、pnpm 10+、Git 和 Git LFS。克隆私有 GitHub 仓库前，还需要配置具有仓库读取权限的 GitHub 凭据或 SSH 密钥。

```bash
git lfs install
git clone <GitHub 仓库地址> smart-college-guide
cd smart-college-guide
git lfs pull
pnpm install --frozen-lockfile
pnpm generate
```

将 `.output/public` 发布到：

```text
/var/www/smart-college-guide/current
```

Caddy 配置示例见 `infra/Caddyfile.guide`。

## 更新部署

```bash
cd smart-college-guide
git pull --ff-only
git lfs pull
pnpm install --frozen-lockfile
pnpm generate
```

然后用新生成的 `.output/public` 更新站点目录。建议先生成到新的发布目录，再通过符号链接原子切换 `current`，以避免更新期间出现不完整页面。
