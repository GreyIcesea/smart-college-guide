export interface ResourceCourse {
  slug: string
  title: string
  credits: number
  type: 'required' | 'elective'
  category?: string
}

export interface ResourceCurriculum {
  cohort: number
  major: string
  majorName: string
  note: string
  semesters: Array<{ year: number, semester: number, courses: string[] }>
  courseDetails?: Record<string, ResourceCourse>
}

const automationCourse = (year: number, semester: number, code: string, title: string, credits: number, category: string): ResourceCourse & { year: number, semester: number } => ({
  slug: `automation-${code}`,
  title,
  credits,
  type: 'required',
  category,
  year,
  semester
})

const automationCourses = [
  automationCourse(1, 1, '0701044', '思想道德与法治', 2.5, '大类基础课'),
  automationCourse(1, 1, '0701055', '形势与政策 I', 0.25, '大类基础课'),
  automationCourse(1, 1, '1101011', '体育 I', 1, '大类基础课'),
  automationCourse(1, 1, '1520111', '大学英语 I', 2, '大类基础课'),
  automationCourse(1, 1, '1001103', '高等数学 BI', 5, '大类平台课'),
  automationCourse(1, 1, 'c0601120', 'C 语言程序设计（混合式）', 3, '大类平台课'),
  automationCourse(1, 1, '2402003', '自动化专业导论（新生研讨课）', 1, '专业基础课'),
  automationCourse(1, 1, '2001007', '军事技能训练', 2, '实践教育课'),
  automationCourse(1, 2, '0701056', '形势与政策 II', 0.25, '大类基础课'),
  automationCourse(1, 2, '0701069', '中国近现代史纲要', 2.5, '大类基础课'),
  automationCourse(1, 2, '1101012', '体育 II', 1, '大类基础课'),
  automationCourse(1, 2, '1520112', '大学英语 II', 2, '大类基础课'),
  automationCourse(1, 2, '2001006', '军事理论', 2, '大类基础课'),
  automationCourse(1, 2, '1001104', '高等数学 BII', 6, '大类平台课'),
  automationCourse(1, 2, '1001152', '几何与线性代数', 3, '大类平台课'),
  automationCourse(1, 2, '1002151', '大学物理 AI', 4, '大类平台课'),
  automationCourse(1, 2, '0701071', '思想政治理论课实践 I', 1, '实践教育课'),
  automationCourse(1, 2, '1002803', '大学物理实验 BI', 1, '实践教育课'),
  automationCourse(1, 2, '2404052', '电子工艺实习', 1, '实践教育课'),
  automationCourse(1, 3, '2404011', '科技创新思维训练（创新创业）', 2, '专业主干课'),
  automationCourse(2, 1, '0701057', '形势与政策 III', 0.25, '大类基础课'),
  automationCourse(2, 1, '0701070', '马克思主义基本原理', 2.5, '大类基础课'),
  automationCourse(2, 1, '1101013', '体育 III', 1, '大类基础课'),
  automationCourse(2, 1, '1520113', '大学英语 III', 2, '大类基础课'),
  automationCourse(2, 1, '1001145', '概率论与数理统计', 3, '大类平台课'),
  automationCourse(2, 1, '1002152', '大学物理 II', 3, '大类平台课'),
  automationCourse(2, 1, '2401068', '人工智能通识导论 B', 2, '大类平台课'),
  automationCourse(2, 1, '2404002', '电路 A（混合式）', 4.5, '大类平台课'),
  automationCourse(2, 1, '2404008', '信号与系统', 3, '专业基础课'),
  automationCourse(2, 1, '2404067', '复变函数及其在自动控制中的应用', 2, '专业基础课'),
  automationCourse(2, 1, '1002804', '大学物理实验 BII', 1, '实践教育课'),
  automationCourse(2, 1, '2404038', '电路实验', 1, '实践教育课'),
  automationCourse(2, 2, '0701042', '毛泽东思想和中国特色社会主义理论体系概论', 2.5, '大类基础课'),
  automationCourse(2, 2, '0701058', '形势与政策 IV', 0.25, '大类基础课'),
  automationCourse(2, 2, '1101014', '体育 IV', 1, '大类基础课'),
  automationCourse(2, 2, '1520114', '大学英语 IV（专业英语）', 2, '大类基础课'),
  automationCourse(2, 2, '2404003', '模拟电子技术（混合式）', 3, '大类平台课'),
  automationCourse(2, 2, '2404004', '数字电子技术 I（混合式）', 2.5, '大类平台课'),
  automationCourse(2, 2, '2404006', '电机与拖动', 3, '专业基础课'),
  automationCourse(2, 2, '2404009', '自动控制原理', 4, '专业基础课'),
  automationCourse(2, 2, '2404014', '文献检索与应用', 1, '专业主干课'),
  automationCourse(2, 2, '0701072', '思想政治理论课实践 II', 1, '实践教育课'),
  automationCourse(2, 2, '2404039', '模拟电子技术实验', 1, '实践教育课'),
  automationCourse(2, 2, '2404040', '数字电子技术实验', 1, '实践教育课'),
  automationCourse(2, 2, '2404041', '电机与拖动实验', 1, '实践教育课'),
  automationCourse(2, 3, '2404051', '金工实习', 1.5, '实践教育课'),
  automationCourse(2, 3, '2404054', '劳动教育（劳动）', 1, '实践教育课'),
  automationCourse(3, 1, '0701048', '习近平新时代中国特色社会主义思想概论', 3, '大类基础课'),
  automationCourse(3, 1, '0701059', '形势与政策 V', 0.25, '大类基础课'),
  automationCourse(3, 1, '2404007', '微机原理与接口（含单片机）', 4.5, '专业基础课'),
  automationCourse(3, 1, '2404010', '现代控制理论', 2, '专业基础课'),
  automationCourse(3, 1, '2404015', '检测技术与仪表', 2, '专业主干课'),
  automationCourse(3, 1, '2404016', '数字信号处理（双语）', 1.5, '专业主干课'),
  automationCourse(3, 1, '2404042', '控制系统课程设计', 1, '实践教育课'),
  automationCourse(3, 1, '2404046', '电子技术综合设计', 1.5, '实践教育课'),
  automationCourse(3, 1, '2404047', '单片机应用实践', 1, '实践教育课'),
  automationCourse(3, 1, '2404053', '认识实习', 0.5, '实践教育课'),
  automationCourse(3, 2, '0701060', '形势与政策 VI', 0.25, '大类基础课'),
  automationCourse(3, 2, '2404012', '控制系统建模与仿真（双语）', 1.5, '专业主干课'),
  automationCourse(3, 2, '2404013', '系统工程与管理（交叉）', 1.5, '专业主干课'),
  automationCourse(3, 2, '2404017', '电气控制及 PLC 技术（混合式）', 2, '专业主干课'),
  automationCourse(3, 2, '2404019', '过程控制系统', 2, '专业主干课'),
  automationCourse(3, 2, '2404020', '电力电子技术及应用', 2, '专业主干课'),
  automationCourse(3, 2, '2404021', '运动控制系统', 2, '专业主干课'),
  automationCourse(3, 2, '2404043', '电力电子技术实验', 0.5, '实践教育课'),
  automationCourse(3, 2, '2404044', '运动控制系统实验', 0.5, '实践教育课'),
  automationCourse(3, 2, '2404045', 'PLC 技术课程设计', 1, '实践教育课'),
  automationCourse(3, 2, '2404049', '过程控制课程设计', 1, '实践教育课'),
  automationCourse(3, 3, '2401065', '国际人工智能与智能控制前沿讲座（国际化）', 1, '专业主干课'),
  automationCourse(4, 1, '0701061', '形势与政策 VII', 0.25, '大类基础课'),
  automationCourse(4, 1, '2404018', '计算机控制系统（混合式课程）', 2, '专业主干课'),
  automationCourse(4, 1, '2404048', '电力电子与运动控制综合设计', 1, '实践教育课'),
  automationCourse(4, 1, '2404050', '计算机控制系统课程设计（项目式）', 1, '实践教育课'),
  automationCourse(4, 2, '0701062', '形势与政策 VIII', 0.25, '大类基础课'),
  automationCourse(4, 2, '2404055', '毕业实习', 1, '实践教育课'),
  automationCourse(4, 2, '2404056', '毕业设计', 14, '实践教育课')
] 

const semesterMap = new Map<string, string[]>()
for (const course of automationCourses) {
  const key = `${course.year}-${course.semester}`
  semesterMap.set(key, [...(semesterMap.get(key) ?? []), course.slug])
}

export const automationCurriculum: ResourceCurriculum = {
  cohort: 2026,
  major: 'automation',
  majorName: '自动化',
  note: '来源：自动化专业本科人才培养方案（自动化_方案详细.doc）。原文件未标明适用届次，暂按 2026 级展示，请以学院最新正式文件为准。',
  semesters: Array.from(semesterMap, ([key, courses]) => {
    const [year, semester] = key.split('-').map(Number)
    if (!year || !semester) throw new Error(`Invalid automation semester key: ${key}`)
    return { year, semester, courses }
  }),
  courseDetails: Object.fromEntries(automationCourses.map(course => [course.slug, course]))
}
