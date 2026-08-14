# 课程资料目录

同步后的独立文件位于 `public/materials/files/<资料组>/`。原始目录层级会保留，Windows 不支持的文件名字符会被安全替换。

资料与课程的映射维护在 `scripts/sync-course-materials.mjs`，运行 `pnpm sync:materials` 后会自动生成 `app/data/courseMaterialFiles.json`。页面会据此提供文件搜索、单文件下载和预览，不需要手工登记每个文件。

只收录允许公开、来源清楚且适用范围明确的文件。不要上传盗版教材、付费内容或未经许可的内部材料。
