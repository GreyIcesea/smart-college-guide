import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import matter from 'gray-matter'
import { load } from 'js-yaml'

const root = process.cwd()
const content = join(root, 'content')
const errors = []

function filesIn(directory, extension) {
  if (!existsSync(directory)) return []
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? filesIn(path, extension) : path.endsWith(extension) ? [path] : []
  })
}

function required(frontmatter, fields, file) {
  for (const field of fields) {
    if (frontmatter[field] === undefined || frontmatter[field] === null || frontmatter[field] === '') {
      errors.push(`${file}: missing required field '${field}'`)
    }
  }
}

const courseFiles = filesIn(join(content, 'courses'), '.md')
const courseIds = new Map()
const courses = []

for (const file of courseFiles) {
  const label = relative(root, file)
  const data = matter(readFileSync(file, 'utf8')).data
  required(data, ['title', 'slug', 'description', 'credits', 'type', 'grade', 'semester', 'majors', 'prerequisites', 'nextCourses', 'tags', 'lastVerified', 'applicableCohorts', 'sourceStatus'], label)
  const slug = String(data.slug ?? '')
  if (courseIds.has(slug)) errors.push(`${label}: duplicate slug '${slug}' (also ${courseIds.get(slug)})`)
  else if (slug) courseIds.set(slug, label)
  courses.push({ file: label, data })
}

const validCourses = new Set(courseIds.keys())
for (const course of courses) {
  for (const field of ['prerequisites', 'nextCourses']) {
    const values = Array.isArray(course.data[field]) ? course.data[field] : []
    for (const value of values) {
      if (typeof value !== 'string' || !validCourses.has(value)) errors.push(`${course.file}: ${field} references missing course '${String(value)}'`)
    }
  }
}

for (const file of filesIn(join(content, 'curricula'), '.yml')) {
  const label = relative(root, file)
  const data = load(readFileSync(file, 'utf8')) ?? {}
  required(data, ['cohort', 'major', 'majorName', 'semesters'], label)
  if (typeof data.cohort !== 'number' || data.cohort < 2000 || data.cohort > 2100) errors.push(`${label}: cohort must be a valid year`)
  for (const semester of Array.isArray(data.semesters) ? data.semesters : []) {
    if (![1, 2, 3, 4].includes(semester.year) || ![1, 2].includes(semester.semester)) errors.push(`${label}: invalid semester ${semester.year}-${semester.semester}`)
    for (const course of Array.isArray(semester.courses) ? semester.courses : []) {
      if (!validCourses.has(course)) errors.push(`${label}: semester references missing course '${course}'`)
    }
  }
}

const seenSlugs = new Map()
for (const directory of ['guides', 'competitions', 'faq']) {
  for (const file of filesIn(join(content, directory), '.md')) {
    const label = relative(root, file)
    const raw = readFileSync(file, 'utf8')
    const data = matter(raw).data
    required(data, ['title', 'slug', 'description', 'sourceStatus', 'lastVerified'], label)
    const slug = String(data.slug ?? '')
    if (seenSlugs.has(slug)) errors.push(`${label}: duplicate slug '${slug}' (also ${seenSlugs.get(slug)})`)
    else if (slug) seenSlugs.set(slug, label)

    for (const match of raw.matchAll(/!\[[^\]]*\]\((\/reference\/[^)]+)\)/g)) {
      const target = match[1].split(/[?#]/)[0]
      let decoded
      try {
        decoded = decodeURIComponent(target)
      } catch {
        errors.push(`${label}: image path is not valid URL encoding '${target}'`)
        continue
      }
      const imageFile = join(root, 'public', decoded.replace(/^\//, ''))
      if (!existsSync(imageFile)) errors.push(`${label}: image does not exist '${target}'`)
    }
  }
}

if (errors.length) {
  console.error(`Content validation failed with ${errors.length} error(s):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log(`Content validation passed: ${courseFiles.length} courses, ${filesIn(join(content, 'curricula'), '.yml').length} curricula.`)
}
