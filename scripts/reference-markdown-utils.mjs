import { basename } from 'node:path'

const containerTypes = new Set(['info', 'tip', 'warning', 'caution', 'important', 'details'])

function titleProp(rawTitle) {
  if (!rawTitle) return ''
  const title = rawTitle.trim().replace(/^(['"])(.*)\1$/, '$2')
  return title ? ` title=${JSON.stringify(title)}` : ''
}

function linesOutsideCodeFences(markdown, transform) {
  let fence
  return markdown.split(/\r?\n/).map((line) => {
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/)
    if (fenceMatch) {
      const marker = fenceMatch[1][0]
      if (!fence) fence = marker
      else if (fence === marker) fence = undefined
      return line
    }
    return fence ? line : transform(line)
  }).join('\n')
}

export function transformLegacyContainers(markdown, source = 'Markdown') {
  const stack = []
  const output = linesOutsideCodeFences(markdown, (line) => {
    const opening = line.match(/^(\s*):::(\w+)(?:\s+(.*?))?\s*$/)
    if (opening && containerTypes.has(opening[2])) {
      const [, indent, type, rawTitle] = opening
      stack.push({ type, line })
      if (type === 'details') {
        const props = titleProp(rawTitle).trim()
        return `${indent}::guide-details${props ? `{${props}}` : ''}`
      }
      return `${indent}::guide-callout{type=${JSON.stringify(type)}${titleProp(rawTitle)}}`
    }

    const closing = line.match(/^(\s*):::\s*$/)
    if (!closing) return line
    if (!stack.length) throw new Error(`${source}: found a closing ::: without an opening container`)
    stack.pop()
    return `${closing[1]}::`
  })

  if (stack.length) {
    throw new Error(`${source}: ${stack.length} legacy container(s) are not closed`)
  }
  return output
}

function imageAltFromTarget(target) {
  const clean = target.split(/[?#]/)[0]
  try {
    return decodeURIComponent(basename(clean)).replace(/\.[^.]+$/, '')
  } catch {
    return basename(clean).replace(/\.[^.]+$/, '')
  }
}

function parseHtmlAttributes(source) {
  const attributes = {}
  const pattern = /([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g
  for (const match of source.matchAll(pattern)) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? ''
  }
  return attributes
}

export function transformLegacyImages(markdown, resolveImage) {
  let output = markdown.replace(/<img\b([^>]*?)\s*\/?>/gi, (full, rawAttributes) => {
    const attributes = parseHtmlAttributes(rawAttributes)
    const source = attributes.src
    if (!source) return full
    const target = resolveImage(source)
    if (!target) {
      if (/^(?:https?:)?\/\//.test(source) || source.startsWith('/')) return full
      throw new Error(`Unable to resolve legacy image: ${source}`)
    }
    const alt = (attributes.alt || imageAltFromTarget(target)).replace(/]/g, '\\]')
    const zoom = attributes.style?.match(/zoom\s*:\s*(\d+(?:\.\d+)?)%/i)?.[1]
    const sizing = zoom ? `{style="width: ${zoom}%;"}` : ''
    return `![${alt}](${target})${sizing}`
  })

  output = output.replace(/!\[([^\]]*?)\s*=(\d*)x(\d*)\]\(([^)]+)\)/g, (_, rawAlt, width, height, target) => {
    const styles = [width && `width: ${width}px;`, height && `height: ${height}px;`].filter(Boolean).join(' ')
    const alt = rawAlt.trim() || imageAltFromTarget(target)
    return `![${alt}](${target})${styles ? `{style="${styles}"}` : ''}`
  })

  return output.replace(/!\[\s*\]\(([^)]+)\)/g, (_, target) =>
    `![${imageAltFromTarget(target)}](${target})`
  )
}

export function transformLegacyInlineSyntax(markdown) {
  return linesOutsideCodeFences(markdown, (line) => line
    .replace(/<br\s*\/?>/gi, '')
    .replace(/<font\b[^>]*>(.*?)<\/font>/gi, '$1')
    .replace(/==(?=\S)([^=\r\n]*?\S)==/g, '**$1**')
    .replace(/\]\(#{2,}([^)]+)\)/g, '](#$1)')
    .replace(/:yum:/g, '😋')
    .replace(/:heart_eyes:/g, '😍'))
}

export function normalizeReferenceMarkdown(markdown, resolveImage, source) {
  const withContainers = transformLegacyContainers(markdown, source)
  const withImages = transformLegacyImages(withContainers, resolveImage)
  return transformLegacyInlineSyntax(withImages)
}
