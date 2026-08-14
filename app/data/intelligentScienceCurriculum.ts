import type { ResourceCourse, ResourceCurriculum } from './additionalCurricula'
import { artificialIntelligenceCurriculum } from './artificialIntelligenceCurriculum'

type ScheduledCourse = ResourceCourse & { year: number, semester: number }

interface CourseOverride {
  sourceCode?: string
  type?: ResourceCourse['type']
  category?: string
}

const intelligentScienceCourse = (
  year: number,
  semester: number,
  code: string,
  override: CourseOverride = {}
): ScheduledCourse => {
  const sourceCode = override.sourceCode ?? code
  const source = artificialIntelligenceCurriculum.courseDetails?.[`artificial-intelligence-${sourceCode}`]
    ?? (sourceCode === '2401028'
      ? {
          slug: 'artificial-intelligence-2401028',
          title: '人工智能创新与专业前沿（创新创业）',
          credits: 1,
          type: 'required' as const,
          category: '专业主干课'
        }
      : undefined)

  if (!source) throw new Error(`Missing source course for intelligent science and technology: ${sourceCode}`)

  return {
    ...source,
    slug: `intelligent-science-and-technology-${code}`,
    type: override.type ?? source.type,
    category: override.category ?? source.category,
    year,
    semester
  }
}

const intelligentScienceCourses = [
  intelligentScienceCourse(1, 1, '0701044'),
  intelligentScienceCourse(1, 1, '0701055'),
  intelligentScienceCourse(1, 1, '1101011'),
  intelligentScienceCourse(1, 1, '1520111'),
  intelligentScienceCourse(1, 1, '1001103'),
  intelligentScienceCourse(1, 1, '1001152'),
  intelligentScienceCourse(1, 1, '2401003'),
  intelligentScienceCourse(1, 1, '2401004'),
  intelligentScienceCourse(1, 1, '2001007'),
  intelligentScienceCourse(1, 1, '2401005'),

  intelligentScienceCourse(1, 2, '0701056'),
  intelligentScienceCourse(1, 2, '0701069'),
  intelligentScienceCourse(1, 2, '1101012'),
  intelligentScienceCourse(1, 2, '1520112'),
  intelligentScienceCourse(1, 2, '2001006'),
  intelligentScienceCourse(1, 2, '1001104'),
  intelligentScienceCourse(1, 2, '1002151'),
  intelligentScienceCourse(1, 2, '2401012'),
  intelligentScienceCourse(1, 2, '2401013'),
  intelligentScienceCourse(1, 2, '0701071'),
  intelligentScienceCourse(1, 2, '1002803'),
  intelligentScienceCourse(1, 2, '2401014'),

  intelligentScienceCourse(1, 3, '2401015'),

  intelligentScienceCourse(2, 1, '0701057'),
  intelligentScienceCourse(2, 1, '0701070'),
  intelligentScienceCourse(2, 1, '1101013'),
  intelligentScienceCourse(2, 1, '1520113'),
  intelligentScienceCourse(2, 1, '1001145'),
  intelligentScienceCourse(2, 1, '1002152'),
  intelligentScienceCourse(2, 1, '2401018'),
  intelligentScienceCourse(2, 1, '2401019'),
  intelligentScienceCourse(2, 1, '2401016'),
  intelligentScienceCourse(2, 1, '1002804'),
  intelligentScienceCourse(2, 1, '2401017'),
  intelligentScienceCourse(2, 1, '2401020'),

  intelligentScienceCourse(2, 2, '0701042'),
  intelligentScienceCourse(2, 2, '0701058'),
  intelligentScienceCourse(2, 2, '1101014'),
  intelligentScienceCourse(2, 2, '1520114'),
  intelligentScienceCourse(2, 2, '2401021'),
  intelligentScienceCourse(2, 2, '2401022'),
  intelligentScienceCourse(2, 2, '2401023'),
  intelligentScienceCourse(2, 2, '2401025'),
  intelligentScienceCourse(2, 2, '0701072'),
  intelligentScienceCourse(2, 2, '2401024'),
  intelligentScienceCourse(2, 2, '2401026'),
  intelligentScienceCourse(2, 2, '2401059'),
  intelligentScienceCourse(2, 2, '2401027'),
  intelligentScienceCourse(2, 2, '2401061'),
  intelligentScienceCourse(2, 2, '2401062'),

  intelligentScienceCourse(2, 3, '2401028'),

  intelligentScienceCourse(3, 1, '0701048'),
  intelligentScienceCourse(3, 1, '0701059'),
  intelligentScienceCourse(3, 1, '2401029'),
  intelligentScienceCourse(3, 1, '2401032'),
  intelligentScienceCourse(3, 1, '2401034', {
    sourceCode: '2404065',
    type: 'required',
    category: '专业主干课'
  }),
  intelligentScienceCourse(3, 1, '2401030'),
  intelligentScienceCourse(3, 1, '2401031'),
  intelligentScienceCourse(3, 1, '2401033'),
  intelligentScienceCourse(3, 1, '2401036'),
  intelligentScienceCourse(3, 1, '2401037'),
  intelligentScienceCourse(3, 1, '2401038'),
  intelligentScienceCourse(3, 1, '2401063'),
  intelligentScienceCourse(3, 1, '2401064'),
  intelligentScienceCourse(3, 1, '2403001', {
    sourceCode: '2401006',
    type: 'elective',
    category: '专业选修课'
  }),
  intelligentScienceCourse(3, 1, '2404064', {
    sourceCode: '2404066',
    type: 'elective',
    category: '专业选修课'
  }),

  intelligentScienceCourse(3, 2, '0701060'),
  intelligentScienceCourse(3, 2, '2401039'),
  intelligentScienceCourse(3, 2, '2401040'),
  intelligentScienceCourse(3, 2, '2401041'),
  intelligentScienceCourse(3, 2, '2401042'),
  intelligentScienceCourse(3, 2, '2401043'),
  intelligentScienceCourse(3, 2, '2401044'),
  intelligentScienceCourse(3, 2, '2401045'),
  intelligentScienceCourse(3, 2, '2401046'),
  intelligentScienceCourse(3, 2, '2401047'),
  intelligentScienceCourse(3, 2, '2401048'),
  intelligentScienceCourse(3, 2, '2403002', {
    sourceCode: '2401007',
    type: 'elective',
    category: '专业选修课'
  }),

  intelligentScienceCourse(3, 3, '2401065'),

  intelligentScienceCourse(4, 1, '0701061'),
  intelligentScienceCourse(4, 1, '2401051'),
  intelligentScienceCourse(4, 1, '2401052'),
  intelligentScienceCourse(4, 1, '2401049'),
  intelligentScienceCourse(4, 1, '2401060'),
  intelligentScienceCourse(4, 1, '2401054'),
  intelligentScienceCourse(4, 1, '2401055'),
  intelligentScienceCourse(4, 1, '2401056'),
  intelligentScienceCourse(4, 1, '2401057'),
  intelligentScienceCourse(4, 1, '2401058'),
  intelligentScienceCourse(4, 1, '2401069'),

  intelligentScienceCourse(4, 2, '0701062'),
  intelligentScienceCourse(4, 2, '2401050')
]

const semesterMap = new Map<string, string[]>()
for (const course of intelligentScienceCourses) {
  const key = `${course.year}-${course.semester}`
  semesterMap.set(key, [...(semesterMap.get(key) ?? []), course.slug])
}

export const intelligentScienceCurriculum: ResourceCurriculum = {
  cohort: 2026,
  major: 'intelligent-science-and-technology',
  majorName: '智能科学与技术',
  note: '来源：智能科学与技术专业本科人才培养方案（智能科学与技术_方案详细.doc）。原文件未标明适用届次，暂按 2026 级展示，请以学院最新正式文件为准。',
  semesters: Array.from(semesterMap, ([key, courses]) => {
    const [year, semester] = key.split('-').map(Number)
    if (!year || !semester) throw new Error(`Invalid intelligent science semester key: ${key}`)
    return { year, semester, courses }
  }),
  courseDetails: Object.fromEntries(intelligentScienceCourses.map(course => [course.slug, course]))
}
