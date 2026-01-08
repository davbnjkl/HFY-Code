# GitHub Pages 缓存控制方案

由于 GitHub Pages 对服务器端缓存控制有限制，我们采用以下方案解决缓存问题：

## 1. 版本控制系统（已实现）

网页使用 localStorage 存储版本号，每次更新时修改 `CACHE_VERSION` 即可：

```javascript
const CACHE_VERSION = '2025-01-08-v3'; // 每次更新修改这个版本号
```

**修改版本号的位置**：`index.html` 第 246 行

## 2. 使用刷新页面（推荐）

创建了一个专门的刷新页面 `refresh.html`，访问此页面会：
- 自动清除所有缓存（localStorage、sessionStorage、Service Worker）
- 跳转到主页（带时间戳强制刷新）

**使用方法**：
1. 告诉用户访问 `https://你的用户名.github.io/仓库名/refresh.html`
2. 点击"清除缓存并进入主页"按钮
3. 自动清除缓存后跳转到主页

## 3. 用户手动清除

告诉用户以下任一方法：
- 按 `Ctrl + F5` 或 `Cmd + Shift + R` 强制刷新
- 按 `Ctrl + Shift + Delete` 打开清除浏览器数据
- 访问 `refresh.html` 页面

## 4. 每次更新后的操作流程

1. 修改 `index.html` 中的 `CACHE_VERSION`（第 246 行）
   ```javascript
   const CACHE_VERSION = '2025-01-08-v4'; // 改成新版本号
   ```

2. 提交代码到 GitHub
   ```bash
   git add .
   git commit -m "更新版本号清除缓存"
   git push
   ```

3. 等待 GitHub Pages 部署完成（约 1-2 分钟）

4. 通知用户访问 `refresh.html` 清除缓存

## 5. GitHub Actions 自动部署（可选）

如果使用 GitHub Actions 自动部署，可以在 workflow 中添加缓存控制：

```yaml
# 在 .github/workflows/pages.yml 中添加
- name: Add no-cache headers
  run: |
    echo "Cache-Control: no-store" >> $GITHUB_WORKSPACE/_headers
```

## 6. 最佳实践建议

- ✅ **使用 `refresh.html` 作为官方入口**：将 `refresh.html` 作为主链接分享给用户
- ✅ **每次更新修改版本号**：确保更新能被检测到
- ✅ **添加更新提示**：在主页添加一个"清除缓存"按钮
- ✅ **定期检查缓存问题**：特别是发布重大更新时

## 7. 文件说明

- `index.html` - 主页面（带缓存控制）
- `refresh.html` - 缓存清除页面（推荐使用）
- `cache_bust.html` - 另一个缓存清除工具

---

**提示**：GitHub Pages 的 CDN 缓存通常会在几小时内自动更新，但如果用户浏览器缓存了旧版本，建议使用 `refresh.html` 页面。
