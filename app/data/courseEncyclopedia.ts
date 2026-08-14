import { automationCurriculum, type ResourceCourse, type ResourceCurriculum } from './additionalCurricula'
import { artificialIntelligenceCurriculum } from './artificialIntelligenceCurriculum'
import { intelligentScienceCurriculum } from './intelligentScienceCurriculum'

export interface CoursePlacement {
  major: string
  majorName: string
  year: number
  semester: number
  order: number
}

export interface CourseAssessmentItem {
  label: string
  detail: string
}

export interface CourseEncyclopediaEntry extends ResourceCourse {
  path: string
  description: string
  categories: string[]
  placements: CoursePlacement[]
  assessment: CourseAssessmentItem[]
  assessmentNote: string
  advice: string[]
  tags: string[]
}

const curricula: ResourceCurriculum[] = [
  artificialIntelligenceCurriculum,
  automationCurriculum,
  intelligentScienceCurriculum
]

const includesAny = (value: string, keywords: string[]) => keywords.some(keyword => value.includes(keyword))

const isPracticalCourse = (course: ResourceCourse) =>
  course.category === '实践教育课'
  || includesAny(course.title, ['实验', '实践', '实习', '课程设计', '综合设计', '技能训练', '毕业设计'])

const courseProfile = (course: ResourceCourse) => {
  const title = course.title

  if (isPracticalCourse(course)) return 'practice'
  if (includesAny(title, ['体育'])) return 'sports'
  if (includesAny(title, ['大学英语', '专业英语'])) return 'english'
  if (includesAny(title, ['思想', '马克思', '形势与政策', '史纲要', '毛泽东'])) return 'politics'
  if (includesAny(title, ['高等数学', '线性代数', '概率论', '复变函数', '离散数学', '数值计算'])) return 'math'
  if (includesAny(title, ['电路', '电子技术', '数字逻辑', '电机', '电力电子', '微机原理', '单片机', 'FPGA', '检测技术'])) return 'hardware'
  if (includesAny(title, ['控制', '信号与系统', '系统建模', '运动控制', '过程控制', '机器人'])) return 'control'
  if (includesAny(title, ['程序设计', '数据结构', '算法', '操作系统', '计算机网络', '数据库', '编译原理', 'Linux', '面向对象'])) return 'software'
  if (includesAny(title, ['人工智能', '机器学习', '深度学习', '计算机视觉', '图像处理', '模式识别', '数据挖掘', '自然语言', '知识工程', '情感计算', '生成式'])) return 'ai'
  return 'general'
}

const descriptions: Record<string, string> = {
  practice: '以动手完成实验、项目或工程任务为主，重点看过程记录、调试能力和最终成果。',
  sports: '通过日常练习和专项训练提升体能与运动技能，过程参与通常和最终测试同样重要。',
  english: '围绕听、说、读、写和专业表达持续训练，平时积累比期末突击更有效。',
  politics: '帮助理解课程中的基本概念、历史脉络和现实议题，兼顾过程学习与期末考核。',
  math: '建立后续工程和专业课需要的数学工具，既要求理解概念，也要求稳定的计算熟练度。',
  hardware: '连接电路原理与真实硬件，学习分析、设计、测量和排查电子系统问题。',
  control: '围绕系统建模、分析和控制器设计展开，是自动化方向的重要专业基础。',
  software: '训练把问题拆解为可执行程序，并逐步建立算法、调试和工程实现能力。',
  ai: '学习从数据、任务和模型出发构建智能系统，重视原理理解、实验设计和结果分析。',
  general: '培养方案中的组成课程，具体教学重点与考核安排以当学期任课教师说明为准。'
}

const assessmentByProfile: Record<string, CourseAssessmentItem[]> = {
  practice: [
    { label: '过程表现', detail: '出勤、操作规范、阶段检查与调试过程。' },
    { label: '实验或作品', detail: '任务完成度、结果正确性和系统运行效果。' },
    { label: '报告与答辩', detail: '实验记录、课程报告、展示或现场答辩。' }
  ],
  sports: [
    { label: '平时参与', detail: '出勤、课堂练习和学习态度。' },
    { label: '专项技能', detail: '所选运动项目的动作与专项测试。' },
    { label: '体能测试', detail: '体能项目或课程规定的综合测试。' }
  ],
  english: [
    { label: '平时学习', detail: '出勤、课堂活动、作业与在线学习。' },
    { label: '阶段任务', detail: '听说、阅读、写作或小组展示。' },
    { label: '期末考核', detail: '笔试、口试或课程统一安排的综合测试。' }
  ],
  politics: [
    { label: '学习过程', detail: '出勤、课堂参与、线上任务与平时作业。' },
    { label: '专题任务', detail: '课程论文、调研、展示或实践材料。' },
    { label: '期末考核', detail: '开卷或闭卷考试，形式以教学班通知为准。' }
  ],
  math: [
    { label: '平时过程', detail: '作业、出勤、课堂练习或在线任务。' },
    { label: '阶段考核', detail: '章节测验、期中考试或阶段练习。' },
    { label: '期末考试', detail: '重点考查概念理解、计算和综合应用。' }
  ],
  hardware: [
    { label: '平时过程', detail: '作业、课堂练习、预习或随堂测试。' },
    { label: '实验与设计', detail: '电路分析、仿真、测量或硬件任务。' },
    { label: '期末考核', detail: '笔试或综合任务，考查原理与工程应用。' }
  ],
  control: [
    { label: '平时过程', detail: '作业、课堂练习和模型分析。' },
    { label: '实验或仿真', detail: 'MATLAB / Simulink 仿真、参数设计或报告。' },
    { label: '期末考核', detail: '系统建模、稳定性分析和控制器设计。' }
  ],
  software: [
    { label: '平时过程', detail: '作业、随堂练习、代码阅读或小测。' },
    { label: '编程任务', detail: '上机实验、课程项目或代码验收。' },
    { label: '期末考核', detail: '笔试、机试或综合编程任务。' }
  ],
  ai: [
    { label: '平时过程', detail: '作业、论文阅读、课堂任务或阶段测验。' },
    { label: '实验与项目', detail: '数据处理、模型训练、结果分析与复现。' },
    { label: '期末考核', detail: '考试、项目答辩或课程报告。' }
  ],
  general: [
    { label: '平时过程', detail: '出勤、作业、课堂参与或在线任务。' },
    { label: '阶段任务', detail: '测验、报告、展示或课程实践。' },
    { label: '期末考核', detail: '考试、论文或综合成果验收。' }
  ]
}

const adviceByProfile: Record<string, string[]> = {
  practice: [
    '开始前先读任务书和评分要求，把验收项拆成一张可勾选的清单。',
    '保留原始数据、关键参数、代码版本和故障排查记录，报告不要等到最后一天再补。',
    '先保证基本功能稳定，再做性能和展示效果；答辩前完整走一遍演示流程。'
  ],
  sports: [
    '出勤和持续练习通常很重要，不要把全部压力留给最后一次测试。',
    '尽早确认本教学班的测试项目和标准，针对薄弱项安排每周固定练习。',
    '有伤病及时与老师沟通，按学校流程处理，不要在不适状态下强行测试。'
  ],
  english: [
    '先确认教学班使用的平台、作业截止时间和口语展示安排，避免漏掉过程分。',
    '把单词和阅读分散到每周完成，同时保留一份常见写作与翻译错误清单。',
    '期末前按题型限时训练，比只背词表更容易发现速度和表达上的问题。'
  ],
  politics: [
    '先按章节整理“概念—背景—意义”的关系，不要只背孤立句子。',
    '平时作业、在线学习和展示容易被忽略，开学后先把所有截止时间记下来。',
    '复习时以老师划定范围和课堂材料为主，再用题目检查自己能否完整表达。'
  ],
  math: [
    '每周把例题和作业独立重做一次，重点记录“为什么会选这个方法”。',
    '概念、定理条件和计算熟练度要一起练，不能只看懂答案而不动笔。',
    '期末前按章节补漏洞，再做限时综合卷；错题要隔几天重新独立完成。'
  ],
  hardware: [
    '画清信号流和关键节点，再开始列公式或接线；遇到故障时按模块逐段排查。',
    '熟悉万用表、示波器和仿真工具，记录正常波形与异常波形之间的差别。',
    '课后整理常用电路、器件限制和典型题型，实验课与理论课要分开复习。'
  ],
  control: [
    '先把系统框图、输入输出和每个变量的物理意义画清楚，再推公式。',
    '手算和 MATLAB / Simulink 仿真配合进行，用仿真检查结论而不是替代理解。',
    '复习时围绕建模、稳定性、动态性能和校正方法建立一条完整问题链。'
  ],
  software: [
    '所有示例都亲手运行并修改，不要把“看懂代码”当成“会写代码”。',
    '遇到错误时缩小输入规模、打印关键状态，并主动测试空输入和边界条件。',
    '课程项目尽早建立版本管理和任务拆分，留出时间整理代码与说明文档。'
  ],
  ai: [
    '先补齐线性代数、概率和 Python 基础，再进入模型细节，学习会轻松很多。',
    '每个实验都保存数据处理、参数、指标和结果，确保换一台电脑仍能复现。',
    '不要只追最终分数，要能解释数据、评价指标、过拟合现象和模型选择理由。'
  ],
  general: [
    '开课第一周先确认教学大纲、考核方式和所有重要截止时间。',
    '每周固定一次短复盘，把没理解的内容及时解决，不要拖到期末集中补。',
    '具体复习范围优先听任课教师安排，再结合教材、作业和往年经验准备。'
  ]
}

const tagsByProfile: Record<string, string[]> = {
  practice: ['实践', '项目'],
  sports: ['体育', '公共基础'],
  english: ['英语', '公共基础'],
  politics: ['思政', '公共基础'],
  math: ['数学', '基础课'],
  hardware: ['电路', '硬件'],
  control: ['控制', '专业课'],
  software: ['编程', '计算机'],
  ai: ['人工智能', '专业课'],
  general: ['培养方案课程']
}

const entries = new Map<string, CourseEncyclopediaEntry>()

for (const curriculum of curricula) {
  for (const semester of curriculum.semesters) {
    for (const [order, slug] of semester.courses.entries()) {
      const course = curriculum.courseDetails?.[slug]
      if (!course) continue

      const key = course.title.normalize('NFKC').toLocaleLowerCase('zh-CN')
      const placement: CoursePlacement = {
        major: curriculum.major,
        majorName: curriculum.majorName,
        year: semester.year,
        semester: semester.semester,
        order
      }
      const existing = entries.get(key)

      if (existing) {
        if (!existing.placements.some(item =>
          item.major === placement.major
          && item.year === placement.year
          && item.semester === placement.semester
        )) {
          existing.placements.push(placement)
        }
        if (course.category && !existing.categories.includes(course.category)) existing.categories.push(course.category)
        continue
      }

      const profile = courseProfile(course)
      entries.set(key, {
        ...course,
        path: `/courses/${course.slug}`,
        description: descriptions[profile] ?? descriptions.general!,
        categories: course.category ? [course.category] : [],
        placements: [placement],
        assessment: assessmentByProfile[profile] ?? assessmentByProfile.general!,
        assessmentNote: '不同教师、教学班和学期的具体项目与比例可能不同，请以开课后公布的教学大纲和任课教师说明为准。',
        advice: adviceByProfile[profile] ?? adviceByProfile.general!,
        tags: tagsByProfile[profile] ?? tagsByProfile.general!
      })
    }
  }
}

export const courseEncyclopedia = Array.from(entries.values()).sort((left, right) =>
  left.title.localeCompare(right.title, 'zh-CN', { numeric: true })
)

export const courseEncyclopediaBySlug = new Map(courseEncyclopedia.map(course => [course.slug, course]))

const legacyCourseTitles: Record<string, string> = {
  'calculus-a1': '高等数学 BI',
  'programming-basics': '程序设计基础（混合式）',
  'linear-algebra': '几何与线性代数',
  'data-structures': '数据结构',
  'probability-theory': '概率论与数理统计 A',
  'python-programming': 'Python 程序设计',
  'machine-learning': '机器学习（项目式）'
}

for (const [legacySlug, title] of Object.entries(legacyCourseTitles)) {
  const course = courseEncyclopedia.find(item => item.title === title)
  if (course) courseEncyclopediaBySlug.set(legacySlug, course)
}

export const courseMajorOptions = [
  { value: 'all', label: '全部专业' },
  { value: artificialIntelligenceCurriculum.major, label: artificialIntelligenceCurriculum.majorName },
  { value: automationCurriculum.major, label: automationCurriculum.majorName },
  { value: intelligentScienceCurriculum.major, label: intelligentScienceCurriculum.majorName }
]
