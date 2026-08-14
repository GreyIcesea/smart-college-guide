import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, extname, join, relative, resolve } from 'node:path'
import matter from 'gray-matter'
import { dump } from 'js-yaml'
import { normalizeReferenceMarkdown } from './reference-markdown-utils.mjs'

const sourceRoot = '/tmp/hh-guide-reference/src'
const projectRoot = process.cwd()
const contentRoot = join(projectRoot, 'content/guides/reference')
const publicRoot = join(projectRoot, 'public/reference')
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif'])
const markdownFiles = []
const routeMap = new Map()
const filenameMap = new Map()

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) walk(path)
    else if (extname(entry.name).toLowerCase() === '.md') markdownFiles.push(path)
  }
}

function routeFor(relativePath) {
  return routeMap.get(relativePath) ?? `/guides/reference/${hashSlug(relativePath)}`
}

function hashSlug(relativePath) {
  return `legacy-${createHash('sha1').update(relativePath).digest('hex').slice(0, 14)}`
}

function readableStem(title, relativePath) {
  const withoutControlCharacters = [...title]
    .map((character) => character.charCodeAt(0) < 32 ? '-' : character)
    .join('')
  const stem = withoutControlCharacters
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/[. ]+$/g, '')
    .trim()

  if (!stem || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(stem)) {
    return hashSlug(relativePath)
  }
  return stem
}

function destinationFor(relativePath) {
  return join(contentRoot, filenameMap.get(relativePath) ?? `${hashSlug(relativePath)}.md`)
}

function descriptionFor(content, relativePath) {
  const paragraph = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith('#') && !line.startsWith(':::') && !line.startsWith('![') && !line.startsWith('```') && !line.startsWith('>'))
  const clean = (paragraph ?? `来自参考项目的内容：${relativePath}`)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[*_~`]/g, '')
  return clean.length > 120 ? `${clean.slice(0, 117)}...` : clean
}

function resolveMarkdownTarget(currentFile, target) {
  const clean = target.split('#')[0].split('?')[0]
  if (!clean || clean.startsWith('/') || /^\w+:\/\//.test(clean)) return null
  const aliases = {
    '通识选修课（尔雅）/': '通识课程.md',
    '奖学金/': '常见奖学金.md'
  }
  let candidate = resolve(dirname(currentFile), aliases[clean] ?? clean)
  if (existsSync(candidate) && !extname(candidate) && existsSync(join(candidate, 'README.md'))) {
    candidate = join(candidate, 'README.md')
  }
  if (!candidate.startsWith(sourceRoot) || !existsSync(candidate)) return null
  if (extname(candidate).toLowerCase() !== '.md') return null
  return routeFor(relative(sourceRoot, candidate))
}

function resolveImageTarget(currentFile, target) {
  const clean = target.split('#')[0].split('?')[0]
  if (!clean || /^\w+:\/\//.test(clean)) return null
  const candidate = clean.startsWith('/')
    ? join(sourceRoot, clean.replace(/^\//, ''))
    : resolve(dirname(currentFile), clean)
  if (!candidate.startsWith(sourceRoot) || !existsSync(candidate)) return null
  if (!imageExtensions.has(extname(candidate).toLowerCase())) return null
  const assetPath = relative(sourceRoot, candidate).split(/[\\/]/).map((part) => encodeURIComponent(part)
    .replace(/[!'()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`)
  ).join('/')
  return `/reference/${assetPath}`
}

function transformLinks(body, currentFile) {
  return body.replace(/(!?\[[^\]]*\])\((<[^>]+>|[^)]+)\)/g, (full, label, rawTarget) => {
    const target = rawTarget.replace(/^<|>$/g, '')
    const imageTarget = label.startsWith('!') ? resolveImageTarget(currentFile, target) : null
    if (imageTarget) return `${label}(${imageTarget})`
    if (!label.startsWith('!')) {
      const markdownTarget = resolveMarkdownTarget(currentFile, target)
      if (markdownTarget) return `${label}(${markdownTarget})`
    }
    return full
  })
}

function transformBody(body, currentFile) {
  const links = transformLinks(body, currentFile)
  return normalizeReferenceMarkdown(
    links,
    (target) => resolveImageTarget(currentFile, target),
    relative(projectRoot, currentFile)
  )
}

walk(sourceRoot)
rmSync(contentRoot, { recursive: true, force: true })
mkdirSync(contentRoot, { recursive: true })
const usedFilenames = new Set()
for (const sourceFile of markdownFiles) {
  const relativePath = relative(sourceRoot, sourceFile)
  const parsed = matter(readFileSync(sourceFile, 'utf8'))
  const title = typeof parsed.data.title === 'string' ? parsed.data.title : relativePath.split('/').at(-1).replace(/\.md$/i, '')
  const stem = readableStem(title, relativePath)
  let filename = `${stem}.md`
  if (usedFilenames.has(filename.toLocaleLowerCase())) {
    filename = `${stem}-${hashSlug(relativePath).replace('legacy-', '')}.md`
  }
  usedFilenames.add(filename.toLocaleLowerCase())
  filenameMap.set(relativePath, filename)
  routeMap.set(relativePath, `/guides/reference/${encodeURIComponent(filename.replace(/\.md$/i, ''))}`)
}

for (const sourceFile of markdownFiles) {
  const relativePath = relative(sourceRoot, sourceFile)
  const parsed = matter(readFileSync(sourceFile, 'utf8'))
  const topLevel = relativePath.split('/')[0]
  const title = typeof parsed.data.title === 'string' ? parsed.data.title : relativePath.split('/').at(-1).replace(/\.md$/i, '')
  const frontmatter = {
    title,
    slug: hashSlug(relativePath),
    description: descriptionFor(parsed.content, relativePath),
    category: `参考内容 / ${topLevel}`,
    targetGrades: [1, 2, 3, 4],
    sourceStatus: 'unverified',
    lastVerified: '2026-08-10',
    order: 100,
    sourcePath: relativePath
  }
  const output = `---\n${dump(frontmatter, { noRefs: true })}---\n\n${transformBody(parsed.content, sourceFile).trim()}\n`
  const destination = destinationFor(relativePath)
  mkdirSync(dirname(destination), { recursive: true })
  writeFileSync(destination, output)
}

function copyAssets(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const source = join(directory, entry.name)
    const target = join(publicRoot, relative(sourceRoot, source))
    if (entry.isDirectory()) copyAssets(source)
    else if (imageExtensions.has(extname(entry.name).toLowerCase())) {
      mkdirSync(dirname(target), { recursive: true })
      writeFileSync(target, readFileSync(source))
    }
  }
}

copyAssets(sourceRoot)
console.log(`Imported ${markdownFiles.length} reference Markdown files and copied image assets.`)
