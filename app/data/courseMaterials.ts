import materialCollections from './courseMaterialFiles.json'

export type CourseMaterialPreviewKind = 'pdf' | 'image' | 'text' | 'audio' | 'video' | 'office' | 'unsupported'

export interface CourseMaterial {
  id: string
  name: string
  relativePath: string
  href: string
  size: number
  extension: string
  previewKind: CourseMaterialPreviewKind
  collectionLabel: string
}

interface MaterialCollection {
  id: string
  label: string
  fileCount: number
  sourceBytes: number
  sourcePath: string
  courseSlugs: string[]
  files: Omit<CourseMaterial, 'collectionLabel'>[]
}

export const courseMaterials: Record<string, CourseMaterial[]> = {}

for (const collection of materialCollections as MaterialCollection[]) {
  const files = collection.files.map(file => ({
    ...file,
    collectionLabel: collection.label
  }))

  for (const slug of collection.courseSlugs) {
    courseMaterials[slug] = [...(courseMaterials[slug] ?? []), ...files]
  }
}

const intelligentSciencePrefix = 'intelligent-science-and-technology-'
for (const [slug, materials] of Object.entries(courseMaterials)) {
  if (!slug.startsWith('artificial-intelligence-')) continue
  courseMaterials[`${intelligentSciencePrefix}${slug.slice('artificial-intelligence-'.length)}`] = [...materials]
}

const intelligentScienceMaterialAliases: Record<string, string> = {
  [`${intelligentSciencePrefix}2401034`]: 'artificial-intelligence-2404065',
  [`${intelligentSciencePrefix}2403001`]: 'artificial-intelligence-2401006',
  [`${intelligentSciencePrefix}2403002`]: 'artificial-intelligence-2401007',
  [`${intelligentSciencePrefix}2404064`]: 'artificial-intelligence-2404066'
}

for (const [target, source] of Object.entries(intelligentScienceMaterialAliases)) {
  if (courseMaterials[source]) courseMaterials[target] = [...courseMaterials[source]]
}
