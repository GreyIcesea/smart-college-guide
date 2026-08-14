import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import { normalizeReferenceMarkdown } from './reference-markdown-utils.mjs'

const projectRoot = process.cwd()
const contentRoot = join(projectRoot, 'content/guides/reference')
const publicRoot = join(projectRoot, 'public/reference')
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif'])
const checkOnly = process.argv.includes('--check')

function filesIn(directory, predicate) {
  if (!existsSync(directory)) return []
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? filesIn(path, predicate) : predicate(path) ? [path] : []
  })
}

function encodePath(path) {
  return path.split(/[\\/]/).map((part) => encodeURIComponent(part)
    .replace(/[!'()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`)
  ).join('/')
}

const publicImages = filesIn(publicRoot, (path) => imageExtensions.has(extname(path).toLowerCase()))
  .map((path) => ({ path, relativePath: relative(publicRoot, path).replaceAll('\\', '/') }))

function resolveCurrentImage(source) {
  if (source.startsWith('/')) return source
  const suffix = source.replaceAll('\\', '/').replace(/^(?:\.\.\/|\.\/)+/, '')
  const matches = publicImages.filter((image) => image.relativePath.endsWith(suffix))
  if (matches.length !== 1) return undefined
  return `/reference/${encodePath(matches[0].relativePath)}`
}

let changed = 0
for (const file of filesIn(contentRoot, (path) => extname(path).toLowerCase() === '.md')) {
  const before = readFileSync(file, 'utf8')
  const after = normalizeReferenceMarkdown(before, resolveCurrentImage, relative(projectRoot, file))
  if (after === before) continue
  changed += 1
  if (!checkOnly) writeFileSync(file, after)
}

if (checkOnly && changed) {
  console.error(`${changed} reference Markdown file(s) still use legacy syntax.`)
  process.exitCode = 1
} else {
  console.log(checkOnly
    ? 'Reference Markdown syntax is normalized.'
    : `Normalized legacy syntax in ${changed} reference Markdown file(s).`)
}
