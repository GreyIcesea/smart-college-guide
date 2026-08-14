<script setup lang="ts">
import { ArrowLeft, ChevronRight, Download, ExternalLink, Eye, FileText, Folder, FolderOpen, Search, X } from '@lucide/vue'
import { automationCurriculum, type ResourceCourse, type ResourceCurriculum } from '~/data/additionalCurricula'
import { artificialIntelligenceCurriculum } from '~/data/artificialIntelligenceCurriculum'
import { courseMaterials, type CourseMaterial } from '~/data/courseMaterials'
import { intelligentScienceCurriculum } from '~/data/intelligentScienceCurriculum'

useSeoMeta({
  title: '学习资料下载',
  description: '按专业、学期和资料状态查找课程资料，并下载已获准公开的文件。'
})

const { data: curricula } = await useAsyncData('resource-curricula', () =>
  queryCollection('curricula').order('cohort', 'DESC').all()
)
const { data: courses } = await useAsyncData('resource-course-index', () =>
  queryCollection('courses').select('title', 'slug', 'credits', 'type').all()
)

const selectedMajor = ref(automationCurriculum.major)
const selectedCohort = ref<number | null>(automationCurriculum.cohort)
const selectedTerm = ref('all')
const selectedMaterialStatus = ref<'all' | 'available'>('all')
const dialog = ref<HTMLDialogElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const resourceFileList = ref<HTMLElement | null>(null)
const activeCourse = ref<{ title: string, slug: string } | null>(null)
const activePreview = ref<CourseMaterial | null>(null)
const materialSearch = ref('')
const currentFolder = ref('')
const visibleMaterialCount = ref(80)
const textPreview = ref('')
const textPreviewLoading = ref(false)
const textPreviewError = ref('')
const textPreviewTruncated = ref(false)

const allCurricula = computed<ResourceCurriculum[]>(() => {
  const entries = new Map<string, ResourceCurriculum>()
  const localCurricula = [automationCurriculum, artificialIntelligenceCurriculum, intelligentScienceCurriculum]

  for (const item of localCurricula) {
    entries.set(`${item.cohort}-${item.major}`, item)
  }

  for (const item of (curricula.value ?? []) as unknown as ResourceCurriculum[]) {
    if (!item.note.includes('示例')) {
      entries.set(`${item.cohort}-${item.major}`, item)
    }
  }

  return Array.from(entries.values())
})

const majorOptions = computed(() => {
  const options = new Map<string, string>()
  for (const item of allCurricula.value) {
    options.set(item.major, item.majorName)
  }
  return Array.from(options, ([value, label]) => ({ value, label }))
})

const cohortOptions = computed(() =>
  Array.from(new Set(
    allCurricula.value
      .filter(item => item.major === selectedMajor.value)
      .map(item => item.cohort)
  )).sort((a, b) => b - a)
)

watchEffect(() => {
  if (!majorOptions.value.some(option => option.value === selectedMajor.value)) {
    selectedMajor.value = majorOptions.value[0]?.value ?? ''
  }

  if (!cohortOptions.value.includes(selectedCohort.value ?? -1)) {
    selectedCohort.value = cohortOptions.value[0] ?? null
  }
})

const currentCurriculum = computed(() =>
  allCurricula.value.find(item =>
    item.major === selectedMajor.value && item.cohort === selectedCohort.value
  )
)

const courseBySlug = computed(() => new Map<string, ResourceCourse>([
  ...(courses.value ?? []).map(course => [course.slug, course as ResourceCourse] as const),
  ...Object.entries(automationCurriculum.courseDetails ?? {}),
  ...Object.entries(artificialIntelligenceCurriculum.courseDetails ?? {}),
  ...Object.entries(intelligentScienceCurriculum.courseDetails ?? {})
]))

const allCurriculumRows = computed(() =>
  currentCurriculum.value?.semesters.flatMap(term =>
    term.courses.flatMap((slug) => {
      const course = courseBySlug.value.get(slug) ?? currentCurriculum.value?.courseDetails?.[slug]
      return course ? [{ ...course, year: term.year, semester: term.semester }] : []
    })
  ) ?? []
)

const activeMaterials = computed(() =>
  activeCourse.value ? (courseMaterials[activeCourse.value.slug] ?? []) : []
)

const searchResults = computed(() => {
  const query = materialSearch.value.trim().normalize('NFKC').toLocaleLowerCase('zh-CN')
  if (!query) return []
  return activeMaterials.value.filter(material =>
    `${material.name} ${material.relativePath} ${material.extension}`
      .normalize('NFKC')
      .toLocaleLowerCase('zh-CN')
      .includes(query)
  )
})

interface MaterialFolderEntry {
  name: string
  path: string
  fileCount: number
}

const currentDirectory = computed(() => {
  const prefix = currentFolder.value ? `${currentFolder.value}/` : ''
  const folders = new Map<string, MaterialFolderEntry>()
  const files: CourseMaterial[] = []

  for (const material of activeMaterials.value) {
    if (!material.relativePath.startsWith(prefix)) continue
    const remainder = material.relativePath.slice(prefix.length)
    const separator = remainder.indexOf('/')
    if (separator === -1) {
      files.push(material)
      continue
    }

    const name = remainder.slice(0, separator)
    const path = prefix ? `${currentFolder.value}/${name}` : name
    const folder = folders.get(path) ?? { name, path, fileCount: 0 }
    folder.fileCount += 1
    folders.set(path, folder)
  }

  const compareNames = (left: { name: string }, right: { name: string }) =>
    left.name.localeCompare(right.name, 'zh-CN', { numeric: true })

  return {
    folders: Array.from(folders.values()).sort(compareNames),
    files: files.sort(compareNames)
  }
})

const displayedFolders = computed(() => materialSearch.value.trim() ? [] : currentDirectory.value.folders)
const displayedMaterials = computed(() => materialSearch.value.trim() ? searchResults.value : currentDirectory.value.files)
const visibleMaterials = computed(() => displayedMaterials.value.slice(0, visibleMaterialCount.value))
const listingResultCount = computed(() => materialSearch.value.trim()
  ? searchResults.value.length
  : displayedFolders.value.length + displayedMaterials.value.length)

const folderBreadcrumbs = computed(() => {
  const breadcrumbs = [{ label: '根目录', path: '' }]
  let path = ''
  for (const segment of currentFolder.value.split('/').filter(Boolean)) {
    path = path ? `${path}/${segment}` : segment
    breadcrumbs.push({ label: segment, path })
  }
  return breadcrumbs
})

watch(materialSearch, () => {
  visibleMaterialCount.value = 80
})

const semesterLabel = (year: number, semester: number) => {
  const yearLabel = ['一', '二', '三', '四'][year - 1] ?? year
  if (semester === 3) return `大${yearLabel}暑期学期`
  return `大${yearLabel}${semester === 1 ? '上' : '下'}`
}

const materialCount = (slug: string) => courseMaterials[slug]?.length ?? 0

const semesterOptions = computed(() => {
  const terms = new Map<string, string>()
  for (const term of currentCurriculum.value?.semesters ?? []) {
    const value = `${term.year}-${term.semester}`
    terms.set(value, semesterLabel(term.year, term.semester))
  }
  return Array.from(terms, ([value, label]) => ({ value, label }))
})

watchEffect(() => {
  if (selectedTerm.value !== 'all' && !semesterOptions.value.some(term => term.value === selectedTerm.value)) {
    selectedTerm.value = 'all'
  }
})

const curriculumRows = computed(() =>
  allCurriculumRows.value.filter(course => {
    const matchesTerm = selectedTerm.value === 'all' || selectedTerm.value === `${course.year}-${course.semester}`
    const matchesMaterial = selectedMaterialStatus.value === 'all' || materialCount(course.slug) > 0
    return matchesTerm && matchesMaterial
  })
)

const openMaterials = async (course: { title: string, slug: string }) => {
  activeCourse.value = { title: course.title, slug: course.slug }
  activePreview.value = null
  materialSearch.value = ''
  currentFolder.value = ''
  visibleMaterialCount.value = 80
  await nextTick()
  dialog.value?.showModal()
  await nextTick()
  searchInput.value?.focus()
}

const closeMaterials = () => dialog.value?.close()

const resetDialog = () => {
  activeCourse.value = null
  activePreview.value = null
  materialSearch.value = ''
  currentFolder.value = ''
  textPreview.value = ''
  textPreviewError.value = ''
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KiB', 'MiB', 'GiB']
  let value = bytes / 1024
  let unit = units[0]
  for (let index = 1; index < units.length && value >= 1024; index += 1) {
    value /= 1024
    unit = units[index]
  }
  return `${value.toFixed(value >= 10 ? 1 : 2)} ${unit}`
}

const folderLabel = (material: CourseMaterial) => {
  const separator = material.relativePath.lastIndexOf('/')
  return separator > -1 ? material.relativePath.slice(0, separator) : '根目录'
}

const previewAvailable = (material: CourseMaterial) => material.previewKind !== 'unsupported'

const goToFolder = async (path: string) => {
  currentFolder.value = path
  visibleMaterialCount.value = 80
  await nextTick()
  if (resourceFileList.value) resourceFileList.value.scrollTop = 0
}

const openPreview = async (material: CourseMaterial) => {
  if (!previewAvailable(material)) return
  activePreview.value = material
  textPreview.value = ''
  textPreviewError.value = ''
  textPreviewTruncated.value = false

  if (material.previewKind !== 'text') return
  if (material.size > 2 * 1024 ** 2) {
    textPreviewError.value = '文件超过 2 MiB，请下载后查看。'
    return
  }

  textPreviewLoading.value = true
  try {
    const response = await fetch(material.href)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const content = await response.text()
    textPreviewTruncated.value = content.length > 240000
    textPreview.value = content.slice(0, 240000)
  } catch {
    textPreviewError.value = '文本加载失败，请下载后查看。'
  } finally {
    textPreviewLoading.value = false
  }
}

const closePreview = async () => {
  activePreview.value = null
  textPreview.value = ''
  textPreviewError.value = ''
  await nextTick()
  searchInput.value?.focus()
}
</script>

<template>
  <div class="resource-page">
    <PageHeading
      title="学习资料下载"
      description="按培养方案定位课程，查看并下载已获准公开的学习资料。"
    />

    <main class="resource-browser page-wrap">
      <aside class="resource-source" aria-label="资料来源说明">
        <div>
          <strong>资料来源</strong>
          <p>资料来自开源的“河海大学入门指北编辑部资料库”。版权归原作者所有，请遵守开源协议，勿作商业用途。</p>
        </div>
        <a
          href="http://106.15.237.224:5244/pan/%E5%AD%98%E5%82%A81"
          target="_blank"
          rel="noreferrer"
        >
          前往原资料库
          <ExternalLink :size="17" aria-hidden="true" />
        </a>
      </aside>

      <section class="resource-catalog" aria-labelledby="resource-catalog-title">
        <div class="resource-toolbar">
          <div>
            <span class="resource-section-index">01 / 培养方案</span>
            <h2 id="resource-catalog-title">选择课程范围</h2>
          </div>
          <div class="resource-filters">
            <label>
              <span>专业</span>
              <select v-model="selectedMajor">
                <option v-for="major in majorOptions" :key="major.value" :value="major.value">
                  {{ major.label }}
                </option>
              </select>
            </label>
            <label>
              <span>学期</span>
              <select v-model="selectedTerm">
                <option value="all">全部学期</option>
                <option v-for="term in semesterOptions" :key="term.value" :value="term.value">
                  {{ term.label }}
                </option>
              </select>
            </label>
            <label>
              <span>资料状态</span>
              <select v-model="selectedMaterialStatus">
                <option value="all">全部</option>
                <option value="available">仅有资料</option>
              </select>
            </label>
          </div>
        </div>

        <div class="resource-table-wrap">
          <table class="resource-table">
            <thead>
              <tr>
                <th scope="col">学期</th>
                <th scope="col">课程名称</th>
                <th scope="col">课程性质</th>
                <th scope="col">学分</th>
                <th scope="col"><span class="sr-only">查看资料</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="course in curriculumRows" :key="`${course.year}-${course.semester}-${course.slug}`">
                <td data-label="学期">{{ semesterLabel(course.year, course.semester) }}</td>
                <td data-label="课程名称">
                  <strong>{{ course.title }}</strong>
                  <span v-if="course.category" class="resource-course-category">{{ course.category }}</span>
                </td>
                <td data-label="课程性质">{{ typeLabels[course.type] }}</td>
                <td data-label="学分">{{ course.credits }}</td>
                <td class="resource-action-cell">
                  <span :class="['resource-availability', { 'has-files': materialCount(course.slug) > 0 }]">
                    {{ materialCount(course.slug) ? `${materialCount(course.slug)} 份` : '待补充' }}
                  </span>
                  <button
                    class="resource-view-button"
                    type="button"
                    :aria-label="`查看${course.title}的学习资料`"
                    :title="`查看${course.title}的学习资料`"
                    @click="openMaterials(course)"
                  >
                    <FolderOpen :size="20" aria-hidden="true" />
                  </button>
                </td>
              </tr>
              <tr v-if="!curriculumRows.length">
                <td colspan="5" class="resource-table-empty">
                  {{ allCurriculumRows.length ? '没有符合当前筛选条件的课程。' : '当前培养方案尚未录入课程。' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <dialog
      ref="dialog"
      class="resource-dialog"
      aria-labelledby="resource-dialog-title"
      @click.self="closeMaterials"
      @close="resetDialog"
    >
      <header>
        <div class="resource-dialog-heading">
          <button
            v-if="activePreview"
            class="resource-dialog-back"
            type="button"
            aria-label="返回资料列表"
            title="返回资料列表"
            @click="closePreview"
          >
            <ArrowLeft :size="20" aria-hidden="true" />
          </button>
          <div>
            <span>{{ activePreview ? '资料预览' : `${activeMaterials.length} 份资料` }}</span>
            <h2 id="resource-dialog-title">{{ activePreview?.name ?? activeCourse?.title }}</h2>
          </div>
        </div>
        <button class="resource-dialog-close" type="button" aria-label="关闭资料窗口" title="关闭" @click="closeMaterials">
          <X :size="21" aria-hidden="true" />
        </button>
      </header>

      <section v-if="activePreview" class="resource-preview" aria-label="资料预览区域">
        <div class="resource-preview-toolbar">
          <div>
            <span class="resource-file-type">{{ activePreview.extension.toUpperCase() }}</span>
            <span>{{ formatFileSize(activePreview.size) }}</span>
            <span>{{ folderLabel(activePreview) }}</span>
          </div>
          <a :href="activePreview.href" download :aria-label="`下载${activePreview.name}`">
            <Download :size="18" aria-hidden="true" />
            下载
          </a>
        </div>

        <iframe
          v-if="activePreview.previewKind === 'pdf'"
          class="resource-preview-frame"
          :src="activePreview.href"
          :title="`${activePreview.name} PDF 预览`"
        />
        <div v-else-if="activePreview.previewKind === 'image'" class="resource-preview-image">
          <img :src="activePreview.href" :alt="activePreview.name">
        </div>
        <div v-else-if="activePreview.previewKind === 'text'" class="resource-preview-text">
          <p v-if="textPreviewLoading">正在读取文本...</p>
          <p v-else-if="textPreviewError">{{ textPreviewError }}</p>
          <template v-else>
            <p v-if="textPreviewTruncated" class="resource-preview-notice">内容较长，当前仅显示前 240,000 个字符。</p>
            <pre>{{ textPreview }}</pre>
          </template>
        </div>
        <div v-else-if="activePreview.previewKind === 'audio'" class="resource-preview-media">
          <audio :src="activePreview.href" controls preload="metadata" />
        </div>
        <div v-else-if="activePreview.previewKind === 'video'" class="resource-preview-media">
          <video :src="activePreview.href" controls preload="metadata" />
        </div>
        <div v-else-if="activePreview.previewKind === 'office'" class="resource-preview-office">
          <ClientOnly>
            <ResourceOfficePreview
              :key="activePreview.href"
              :url="activePreview.href"
            />
          </ClientOnly>
        </div>
      </section>

      <section v-else-if="activeMaterials.length" class="resource-dialog-browser" aria-label="资料文件列表">
        <div class="resource-dialog-search">
          <Search :size="18" aria-hidden="true" />
          <label class="sr-only" for="material-search">搜索文件名或目录</label>
          <input
            id="material-search"
            ref="searchInput"
            v-model="materialSearch"
            type="search"
            placeholder="搜索文件名或目录"
            autocomplete="off"
          >
          <span aria-live="polite">{{ listingResultCount }} 项</span>
        </div>

        <nav v-if="!materialSearch.trim()" class="resource-breadcrumb" aria-label="文件夹路径">
          <ol>
            <li v-for="(breadcrumb, index) in folderBreadcrumbs" :key="breadcrumb.path || 'root'">
              <ChevronRight v-if="index" :size="14" aria-hidden="true" />
              <button
                type="button"
                :aria-current="index === folderBreadcrumbs.length - 1 ? 'page' : undefined"
                :title="`前往${breadcrumb.label}`"
                @click="goToFolder(breadcrumb.path)"
              >
                {{ breadcrumb.label }}
              </button>
            </li>
          </ol>
        </nav>

        <div v-if="listingResultCount" ref="resourceFileList" class="resource-file-list">
          <button
            v-for="folder in displayedFolders"
            :key="folder.path"
            class="resource-folder-row"
            type="button"
            :aria-label="`打开文件夹${folder.name}，包含${folder.fileCount}个文件`"
            @click="goToFolder(folder.path)"
          >
            <Folder :size="22" aria-hidden="true" />
            <span class="resource-file-copy">
              <strong>{{ folder.name }}</strong>
              <span>{{ folder.fileCount }} 个文件</span>
            </span>
            <ChevronRight :size="18" aria-hidden="true" />
          </button>

          <article v-for="material in visibleMaterials" :key="material.id" class="resource-file-row">
            <FileText :size="22" aria-hidden="true" />
            <div class="resource-file-copy">
              <strong>{{ material.name }}</strong>
              <span>
                <b>{{ material.extension.toUpperCase() }}</b>
                {{ formatFileSize(material.size) }} · {{ folderLabel(material) }}
              </span>
            </div>
            <div class="resource-file-actions">
              <button
                v-if="previewAvailable(material)"
                type="button"
                :aria-label="`预览${material.name}`"
                :title="`预览${material.name}`"
                @click="openPreview(material)"
              >
                <Eye :size="19" aria-hidden="true" />
              </button>
              <a
                :href="material.href"
                download
                :aria-label="`下载${material.name}`"
                :title="`下载${material.name}`"
              >
                <Download :size="19" aria-hidden="true" />
              </a>
            </div>
          </article>
          <button
            v-if="visibleMaterials.length < displayedMaterials.length"
            class="resource-load-more"
            type="button"
            @click="visibleMaterialCount += 80"
          >
            继续显示（剩余 {{ displayedMaterials.length - visibleMaterials.length }} 项）
          </button>
        </div>

        <div v-else class="resource-empty-state resource-search-empty">
          <Search :size="30" aria-hidden="true" />
          <h3>{{ materialSearch.trim() ? '没有找到匹配的资料' : '这个文件夹是空的' }}</h3>
          <p>{{ materialSearch.trim() ? '换一个文件名、类型或目录关键词试试。' : '返回上一级文件夹继续浏览。' }}</p>
        </div>
      </section>

      <div v-else class="resource-empty-state">
        <FolderOpen :size="32" aria-hidden="true" />
        <h3>这门课的资料还在整理</h3>
        <p>文件上传并通过来源与版权检查后，会在这里提供直接下载。</p>
      </div>
    </dialog>
  </div>
</template>
