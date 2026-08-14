export type GuideNavigationSource = {
  title: string
  slug: string
  path: string
  stem: string
  category: string
  order: number
}

export type GuideNavigationItem = GuideNavigationSource & {
  label: string
  depth: number
  role: 'overview' | 'article'
}

export type GuideNavigationGroup = {
  title: string
  items: GuideNavigationItem[]
}

export type GuideNavigationSection = {
  title: string
  overview?: GuideNavigationItem
  groups: GuideNavigationGroup[]
}

export function guidePathFromStem(stem: string) {
  return `/${stem}`
}

type BlueprintItem = string | {
  slug: string
  label?: string
  depth?: number
  role?: GuideNavigationItem['role']
}

type BlueprintSection = {
  title: string
  overview?: BlueprintItem
  groups: Array<{
    title: string
    items: BlueprintItem[]
  }>
}

const blueprint: BlueprintSection[] = [
  {
    title: '开始阅读',
    groups: [
      {
        title: '项目序言',
        items: ['legacy-8349e22fbe23ab', 'legacy-7be5bf2943f0c4']
      }
    ]
  },
  {
    title: '新生准备',
    overview: { slug: 'legacy-f5e8f7e6b17a55', label: '新生指南概览', role: 'overview' },
    groups: [
      {
        title: '入校与安全',
        items: [
          'prepare-before-arrival',
          'legacy-6f190987961c2d',
          'legacy-b5c05e569cdb87',
          'legacy-9428e86bef4c65',
          'legacy-1ff27b6d1f4601',
          'legacy-335c25963e8288',
          'legacy-b5fe3eadf9a014'
        ]
      },
      {
        title: '宿舍生活',
        items: [
          { slug: 'legacy-21b348eba8eb6b', label: '宿舍概览', role: 'overview' },
          { slug: 'legacy-7f5670a9f058c6', depth: 1 },
          { slug: 'legacy-85f9324c074ebc', depth: 1 },
          { slug: 'legacy-70b310326bf603', depth: 1 }
        ]
      },
      {
        title: '电脑与设备',
        items: [
          'choose-a-laptop',
          { slug: 'legacy-d60163ec1f5a9f', label: '电脑选择概览', role: 'overview' },
          { slug: 'legacy-05b159d25aba54', depth: 1 },
          { slug: 'legacy-746731934ab88a', depth: 1 }
        ]
      }
    ]
  },
  {
    title: '校园生活',
    overview: { slug: 'legacy-b2e22396795fca', label: '校园生活概览', role: 'overview' },
    groups: [
      {
        title: '日常与活动',
        items: [
          'legacy-90051e6b7d7cac',
          'legacy-289c62148f6ddd',
          'legacy-ec075629f9c902',
          'legacy-1b91672782f97d',
          'legacy-9dcab52b8b1969',
          'legacy-bb2e10288596ae'
        ]
      },
      {
        title: '食堂百科',
        items: [
          { slug: 'legacy-d018a46c9c7c62', label: '食堂总览', role: 'overview' },
          { slug: 'legacy-55fc90972f151f', depth: 1 },
          { slug: 'legacy-fc4786e01686fa', depth: 1 },
          { slug: 'legacy-5e8c25b544dc13', depth: 1 }
        ]
      }
    ]
  },
  {
    title: '校内设施',
    overview: { slug: 'legacy-211a0b46d4f66f', label: '校内设施概览', role: 'overview' },
    groups: [
      {
        title: '地点与服务',
        items: [
          'legacy-821daf22502af7',
          'legacy-cf1c095daf0991',
          'legacy-eafed12c0dded9',
          'legacy-01256fb33a02bd'
        ]
      }
    ]
  },
  {
    title: '校外生活',
    overview: { slug: 'legacy-a5348f6f257b29', label: '商业与吃饭概览', role: 'overview' },
    groups: [
      {
        title: '购物与餐饮',
        items: ['legacy-ed076388f11bd4', 'legacy-992d093533bc5a']
      }
    ]
  },
  {
    title: '学习与发展',
    overview: { slug: 'legacy-fe5c5bd0604cdd', label: '学习与发展概览', role: 'overview' },
    groups: [
      {
        title: '学业规则',
        items: [
          'read-curriculum',
          'legacy-817c2dfae50c14',
          'legacy-f4c7de46e6f636',
          'legacy-4a6feecd49bfb9',
          'legacy-a1780873551107',
          'legacy-b24026623b00cb',
          'legacy-195bca7de80e30',
          'legacy-3f4085a63b0ede'
        ]
      },
      {
        title: '成长选择',
        items: [
          'legacy-acbda1511b7798',
          'legacy-5c9ff183762726',
          'legacy-4d5e2498e4f95b',
          'legacy-9cba7bed2beede',
          'legacy-621a1ed34cdac1'
        ]
      },
      {
        title: '竞赛',
        items: [
          'legacy-beeecb2cc13559',
          'legacy-e4815192b62774',
          'legacy-c057bf5ba244b6',
          'legacy-299c15427f10a1'
        ]
      }
    ]
  }
]

function materializeItem(
  source: BlueprintItem,
  guideBySlug: Map<string, GuideNavigationSource>,
  consumed: Set<string>
) {
  const definition = typeof source === 'string' ? { slug: source } : source
  const guide = guideBySlug.get(definition.slug)
  if (!guide) return undefined

  consumed.add(guide.slug)
  return {
    ...guide,
    label: definition.label ?? guide.title,
    depth: definition.depth ?? 0,
    role: definition.role ?? 'article'
  } satisfies GuideNavigationItem
}

export function buildGuideNavigation(guides: GuideNavigationSource[]) {
  const normalizedGuides = guides.map((guide) => ({
    ...guide,
    path: guidePathFromStem(guide.stem)
  }))
  const guideBySlug = new Map(normalizedGuides.map((guide) => [guide.slug, guide]))
  const consumed = new Set<string>()

  const sections = blueprint.map((section) => {
    const overview = section.overview
      ? materializeItem(section.overview, guideBySlug, consumed)
      : undefined
    const groups = section.groups
      .map((group) => ({
        title: group.title,
        items: group.items
          .map((item) => materializeItem(item, guideBySlug, consumed))
          .filter((item): item is GuideNavigationItem => Boolean(item))
      }))
      .filter((group) => group.items.length > 0)

    return { ...section, overview, groups }
  }).filter((section) => section.overview || section.groups.length > 0)

  const remaining = normalizedGuides
    .filter((guide) => !consumed.has(guide.slug))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'zh-CN'))

  if (remaining.length > 0) {
    sections.push({
      title: '其他内容',
      overview: undefined,
      groups: [{
        title: '尚未归类',
        items: remaining.map((guide) => ({ ...guide, label: guide.title, depth: 0, role: 'article' }))
      }]
    })
  }

  return sections
}
