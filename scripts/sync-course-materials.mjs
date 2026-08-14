import { createHash } from 'node:crypto'
import { createWriteStream, existsSync, mkdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, extname, relative, resolve, sep } from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

const baseUrl = 'http://106.15.237.224:5244'
const sourceRoot = '/pan/存储1'
const projectRoot = process.cwd()
const outputRoot = resolve(projectRoot, 'public/materials/files')
const manifestPath = resolve(projectRoot, 'app/data/courseMaterialFiles.json')
const dryRun = process.argv.includes('--dry-run')
const force = process.argv.includes('--force')

const bothMajors = code => [`automation-${code}`, `artificial-intelligence-${code}`]

const universityPhysicsSource = `${sourceRoot}/物理类/大学物理`
const universityPhysicsExcluded = `${universityPhysicsSource}/大学物理实验/老版(不建议参考)`

function universityPhysicsGroup(filePath) {
  const relativePath = filePath.slice(universityPhysicsSource.length + 1)
  if (relativePath.startsWith('大学物理实验/')) return 'experiment'

  if (
    relativePath.startsWith('大学物理课件/24-25-2名师殿堂')
    || relativePath.startsWith('大学物理课件/大物B1')
    || relativePath.startsWith('大学物理课件/大学物理A1课件')
  ) return 'physics-1'

  if (
    !relativePath.includes('/')
    && /大学物理BI|大学物理AI(?!I)|大学物理A1|大物A1|力学/.test(relativePath)
  ) return 'physics-1'

  return 'physics-2'
}

const packages = [
  { id: 'ideology-morality-law', label: '思想道德与法治', sourcePath: `${sourceRoot}/思政类/思想道德与法治`, courseSlugs: bothMajors('0701044') },
  { id: 'modern-chinese-history', label: '中国近现代史纲要', sourcePath: `${sourceRoot}/思政类/中国近现代史纲要`, courseSlugs: bothMajors('0701069') },
  { id: 'military-theory', label: '军事理论', sourcePath: `${sourceRoot}/思政类/军事理论`, courseSlugs: bothMajors('2001006') },
  { id: 'maoism', label: '毛泽东思想和中国特色社会主义理论体系概论', sourcePath: `${sourceRoot}/思政类/毛概`, courseSlugs: bothMajors('0701042') },
  { id: 'marxism', label: '马克思主义基本原理', sourcePath: `${sourceRoot}/思政类/马原`, courseSlugs: bothMajors('0701070') },
  { id: 'calculus', label: '高等数学', sourcePath: `${sourceRoot}/数学类/高数`, courseSlugs: [...bothMajors('1001103'), ...bothMajors('1001104')] },
  { id: 'linear-algebra', label: '几何与线性代数', sourcePath: `${sourceRoot}/数学类/几何与线性代数`, courseSlugs: bothMajors('1001152') },
  { id: 'probability-statistics', label: '概率论与数理统计', sourcePath: `${sourceRoot}/数学类/概率论与数理统计`, courseSlugs: bothMajors('1001145') },
  { id: 'discrete-mathematics', label: '离散数学', sourcePath: `${sourceRoot}/数学类/离散数学`, courseSlugs: ['artificial-intelligence-2401018'] },
  { id: 'complex-analysis', label: '复变函数', sourcePath: `${sourceRoot}/数学类/复变函数`, courseSlugs: ['automation-2404067'] },
  {
    id: 'university-physics-1',
    storageId: 'university-physics',
    label: '大学物理 I',
    sourcePath: universityPhysicsSource,
    excludePrefixes: [universityPhysicsExcluded],
    includeFile: filePath => universityPhysicsGroup(filePath) === 'physics-1',
    courseSlugs: bothMajors('1002151')
  },
  {
    id: 'university-physics-2',
    storageId: 'university-physics',
    label: '大学物理 II',
    sourcePath: universityPhysicsSource,
    excludePrefixes: [universityPhysicsExcluded],
    includeFile: filePath => universityPhysicsGroup(filePath) === 'physics-2',
    courseSlugs: bothMajors('1002152')
  },
  {
    id: 'university-physics-experiment',
    storageId: 'university-physics',
    label: '大学物理实验',
    sourcePath: universityPhysicsSource,
    excludePrefixes: [universityPhysicsExcluded],
    includeFile: filePath => universityPhysicsGroup(filePath) === 'experiment',
    courseSlugs: [...bothMajors('1002803'), ...bothMajors('1002804')]
  },
  { id: 'circuits', label: '电路', sourcePath: `${sourceRoot}/物理类/电路`, courseSlugs: ['automation-2404002'] },
  { id: 'signals-systems', label: '信号与系统', sourcePath: `${sourceRoot}/其他/信号与线性系统`, courseSlugs: ['automation-2404008', 'artificial-intelligence-2404066'] },
  { id: 'c-programming', label: 'C 语言程序设计', sourcePath: `${sourceRoot}/计算机相关/c语言`, courseSlugs: ['automation-c0601120', 'artificial-intelligence-2401004', 'artificial-intelligence-2401005'] },
  { id: 'python-programming', label: 'Python 程序设计', sourcePath: `${sourceRoot}/计算机相关/python`, courseSlugs: ['artificial-intelligence-2401012'] },
  { id: 'introduction-to-ai', label: '人工智能导论', sourcePath: `${sourceRoot}/计算机相关/人工智能导论`, courseSlugs: ['artificial-intelligence-2401003', 'artificial-intelligence-2401021'] },
  { id: 'digital-image-processing', label: '数字图像处理', sourcePath: `${sourceRoot}/计算机相关/数字图像`, courseSlugs: ['artificial-intelligence-2401013', 'artificial-intelligence-2401014'] },
  { id: 'machine-learning', label: '机器学习', sourcePath: `${sourceRoot}/计算机相关/机器学习寒假大礼包`, courseSlugs: ['artificial-intelligence-2401029', 'artificial-intelligence-2401030'] },
  { id: 'electronic-technology', label: '电子技术基础', sourcePath: `${sourceRoot}/计算机相关/电子技术基础`, courseSlugs: ['automation-2404003', 'automation-2404004'] },
  { id: 'numerical-methods', label: '数值计算方法', sourcePath: `${sourceRoot}/计算机相关/计算方法`, courseSlugs: ['artificial-intelligence-2401036'] },
  { id: 'computer-organization', label: '计算机组成原理', sourcePath: `${sourceRoot}/计算机相关/计算机组成原理`, courseSlugs: ['artificial-intelligence-2401023', 'artificial-intelligence-2401024'] },
  { id: 'computer-networks', label: '计算机网络', sourcePath: `${sourceRoot}/计算机相关/计算机网络`, courseSlugs: ['artificial-intelligence-2401007', 'artificial-intelligence-2401008'] },
  { id: 'college-english', label: '大学英语', sourcePath: `${sourceRoot}/英语`, courseSlugs: [
    ...bothMajors('1520111'),
    ...bothMajors('1520112'),
    ...bothMajors('1520113'),
    ...bothMajors('1520114')
  ] }
]

const previewExtensions = {
  pdf: new Set(['pdf']),
  image: new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'svg', 'bmp']),
  text: new Set(['txt', 'md', 'csv', 'json', 'ipynb', 'xml', 'yml', 'yaml', 'log', 'py', 'c', 'cc', 'cpp', 'h', 'hpp', 'java', 'js', 'ts', 'vue', 'html', 'css', 'sql', 'ini', 'toml']),
  audio: new Set(['mp3', 'wav', 'ogg', 'm4a', 'flac']),
  video: new Set(['mp4', 'webm', 'mov', 'm4v']),
  office: new Set(['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'])
}

function assertInside(path, root) {
  const resolvedPath = resolve(path)
  const resolvedRoot = resolve(root)
  if (resolvedPath !== resolvedRoot && !resolvedPath.startsWith(`${resolvedRoot}${sep}`)) {
    throw new Error(`Unsafe path outside ${resolvedRoot}: ${resolvedPath}`)
  }
}

const wait = milliseconds => new Promise(resolvePromise => setTimeout(resolvePromise, milliseconds))

async function fetchWithRetry(url, options, attempts = 4) {
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, options)
      if (response.ok) return response
      lastError = new Error(`${url}: HTTP ${response.status}`)
    } catch (error) {
      lastError = error
    }
    if (attempt < attempts) await wait(attempt * 1000)
  }
  throw lastError
}

async function alistRequest(endpoint, body) {
  const response = await fetchWithRetry(`${baseUrl}${endpoint}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  })
  const result = await response.json()
  if (result.code !== 200) throw new Error(`${endpoint}: ${result.code} ${result.message}`)
  return result.data
}

async function listFiles(source) {
  const queue = [source.sourcePath]
  const files = []
  while (queue.length > 0) {
    const path = queue.shift()
    const data = await alistRequest('/api/fs/list', {
      path,
      password: '',
      page: 1,
      per_page: 0,
      refresh: false
    })
    for (const item of data.content ?? []) {
      const itemPath = `${path}/${item.name}`
      if (source.excludePrefixes?.some(prefix => itemPath === prefix || itemPath.startsWith(`${prefix}/`))) continue
      if (item.is_dir) queue.push(itemPath)
      else if (!source.includeFile || source.includeFile(itemPath)) files.push({ path: itemPath, size: item.size })
    }
  }
  return files.sort((a, b) => a.path.localeCompare(b.path, 'zh-CN'))
}

function safeSegment(segment, sourcePath) {
  const cleaned = segment
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/[. ]+$/g, '')
    .trim()
  const reserved = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(cleaned)
  if (cleaned && cleaned === segment && !reserved) return cleaned
  const extension = extname(cleaned)
  const basename = (extension ? cleaned.slice(0, -extension.length) : cleaned) || 'file'
  const suffix = createHash('sha1').update(sourcePath).digest('hex').slice(0, 8)
  return `${basename}-${suffix}${extension}`
}

function sourceRelativePath(file, source) {
  return file.path.slice(source.sourcePath.length + 1)
}

function localPathFor(file, source, packageRoot) {
  const segments = sourceRelativePath(file, source).split('/').map(segment => safeSegment(segment, file.path))
  const target = resolve(packageRoot, ...segments)
  assertInside(target, packageRoot)
  return target
}

function localHref(target) {
  const path = relative(outputRoot, target).split(sep).map(encodeURIComponent).join('/')
  return `/materials/files/${path}`
}

function previewKindFor(extension) {
  for (const [kind, extensions] of Object.entries(previewExtensions)) {
    if (extensions.has(extension)) return kind
  }
  return 'unsupported'
}

async function downloadFile(file, source, packageRoot) {
  const target = localPathFor(file, source, packageRoot)
  if (!force && existsSync(target) && statSync(target).size === file.size) return
  mkdirSync(dirname(target), { recursive: true })
  const temporaryTarget = `${target}.part`
  let lastError
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    rmSync(temporaryTarget, { force: true })
    try {
      const data = await alistRequest('/api/fs/get', { path: file.path, password: '' })
      const response = await fetchWithRetry(data.raw_url)
      if (!response.body) throw new Error(`${file.path}: empty response body`)
      await pipeline(Readable.fromWeb(response.body), createWriteStream(temporaryTarget))
      const downloadedSize = statSync(temporaryTarget).size
      if (downloadedSize !== file.size) {
        throw new Error(`${file.path}: expected ${file.size} bytes, received ${downloadedSize}`)
      }
      rmSync(target, { force: true })
      renameSync(temporaryTarget, target)
      return
    } catch (error) {
      lastError = error
      rmSync(temporaryTarget, { force: true })
      if (attempt < 4) await wait(attempt * 1000)
    }
  }
  throw lastError
}

async function runPool(items, worker, concurrency = 6) {
  let nextIndex = 0
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (nextIndex < items.length) {
      const item = items[nextIndex]
      nextIndex += 1
      await worker(item)
    }
  }))
}

function fileRecord(file, source, packageRoot) {
  const target = localPathFor(file, source, packageRoot)
  const relativePath = sourceRelativePath(file, source)
  const name = relativePath.split('/').at(-1) ?? relativePath
  const extension = extname(name).slice(1).toLowerCase()
  return {
    id: createHash('sha1').update(file.path).digest('hex').slice(0, 12),
    name,
    relativePath,
    href: localHref(target),
    size: file.size,
    extension: extension || 'file',
    previewKind: previewKindFor(extension)
  }
}

mkdirSync(outputRoot, { recursive: true })
assertInside(outputRoot, projectRoot)

const manifest = []
let totalFiles = 0
let totalBytes = 0

for (const source of packages) {
  const files = await listFiles(source)
  const sourceBytes = files.reduce((sum, file) => sum + file.size, 0)
  totalFiles += files.length
  totalBytes += sourceBytes
  console.log(`${source.label}: ${files.length} files, ${(sourceBytes / 1024 ** 2).toFixed(1)} MiB`)
  if (dryRun) continue

  const packageRoot = resolve(outputRoot, source.storageId ?? source.id)
  mkdirSync(packageRoot, { recursive: true })
  await runPool(files, file => downloadFile(file, source, packageRoot))

  const records = files.map(file => fileRecord(file, source, packageRoot))
  for (const [index, record] of records.entries()) {
    const target = localPathFor(files[index], source, packageRoot)
    if (!existsSync(target) || statSync(target).size !== record.size) {
      throw new Error(`Local file verification failed: ${target}`)
    }
  }

  manifest.push({
    id: source.id,
    label: source.label,
    fileCount: records.length,
    sourceBytes,
    sourcePath: source.sourcePath,
    courseSlugs: source.courseSlugs,
    files: records
  })
}

console.log(`Matched ${totalFiles} files, ${(totalBytes / 1024 ** 3).toFixed(2)} GiB.`)

if (!dryRun) {
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  console.log(`Wrote ${totalFiles} individual files to ${relative(projectRoot, manifestPath)}.`)
}
