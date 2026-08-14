import type { ResourceCourse, ResourceCurriculum } from './additionalCurricula'

type ScheduledCourse = ResourceCourse & { year: number, semester: number }

const aiCourse = (
  year: number,
  semester: number,
  code: string,
  title: string,
  credits: number,
  type: ResourceCourse['type'],
  category: string
): ScheduledCourse => ({
  slug: `artificial-intelligence-${code}`,
  title,
  credits,
  type,
  category,
  year,
  semester
})

const artificialIntelligenceCourses = [
  aiCourse(1, 1, '0701044', '思想道德与法治', 2.5, 'required', '大类基础课'),
  aiCourse(1, 1, '0701055', '形势与政策 I', 0.25, 'required', '大类基础课'),
  aiCourse(1, 1, '1101011', '体育 I', 1, 'required', '大类基础课'),
  aiCourse(1, 1, '1520111', '大学英语 I', 2, 'required', '大类基础课'),
  aiCourse(1, 1, '1001103', '高等数学 BI', 5, 'required', '大类平台课'),
  aiCourse(1, 1, '1001152', '几何与线性代数', 3, 'required', '大类平台课'),
  aiCourse(1, 1, '2401003', '人工智能导论（新生研讨课）', 1, 'required', '专业基础课'),
  aiCourse(1, 1, '2401004', '程序设计基础（混合式）', 3, 'required', '专业基础课'),
  aiCourse(1, 1, '2001007', '军事技能训练', 2, 'required', '实践教育课'),
  aiCourse(1, 1, '2401005', '程序设计基础实践', 0.5, 'required', '实践教育课'),
  aiCourse(1, 2, '0701056', '形势与政策 II', 0.25, 'required', '大类基础课'),
  aiCourse(1, 2, '0701069', '中国近现代史纲要', 2.5, 'required', '大类基础课'),
  aiCourse(1, 2, '1101012', '体育 II', 1, 'required', '大类基础课'),
  aiCourse(1, 2, '1520112', '大学英语 II', 2, 'required', '大类基础课'),
  aiCourse(1, 2, '2001006', '军事理论', 2, 'required', '大类基础课'),
  aiCourse(1, 2, '1001104', '高等数学 BII', 6, 'required', '大类平台课'),
  aiCourse(1, 2, '1002151', '大学物理 AI', 4, 'required', '大类平台课'),
  aiCourse(1, 2, '2401012', 'Python 程序设计', 1.5, 'required', '专业主干课'),
  aiCourse(1, 2, '2401013', '数字图像处理', 2, 'required', '专业主干课'),
  aiCourse(1, 2, '0701071', '思想政治理论课实践 I', 1, 'required', '实践教育课'),
  aiCourse(1, 2, '1002803', '大学物理实验 BI', 1, 'required', '实践教育课'),
  aiCourse(1, 2, '2401014', '数字图像处理实践', 0.5, 'required', '实践教育课'),
  aiCourse(2, 1, '0701057', '形势与政策 III', 0.25, 'required', '大类基础课'),
  aiCourse(2, 1, '0701070', '马克思主义基本原理', 2.5, 'required', '大类基础课'),
  aiCourse(2, 1, '1101013', '体育 III', 1, 'required', '大类基础课'),
  aiCourse(2, 1, '1520113', '大学英语 III', 2, 'required', '大类基础课'),
  aiCourse(2, 1, '1001145', '概率论与数理统计 A', 3, 'required', '大类平台课'),
  aiCourse(2, 1, '1002152', '大学物理 AII', 3, 'required', '大类平台课'),
  aiCourse(2, 1, '2401018', '离散数学', 3, 'required', '专业基础课'),
  aiCourse(2, 1, '2401019', '数据结构', 3, 'required', '专业基础课'),
  aiCourse(2, 1, '2401016', '数字逻辑电路', 2, 'required', '专业主干课'),
  aiCourse(2, 1, '1002804', '大学物理实验 BII', 1, 'required', '实践教育课'),
  aiCourse(2, 1, '2401017', '数字逻辑电路实验', 0.5, 'required', '实践教育课'),
  aiCourse(2, 1, '2401020', '数据结构课程设计', 1, 'required', '实践教育课'),
  aiCourse(2, 2, '0701042', '毛泽东思想和中国特色社会主义理论体系概论', 2.5, 'required', '大类基础课'),
  aiCourse(2, 2, '0701058', '形势与政策 IV', 0.25, 'required', '大类基础课'),
  aiCourse(2, 2, '1101014', '体育 IV', 1, 'required', '大类基础课'),
  aiCourse(2, 2, '1520114', '大学英语 IV（专业英语）', 2, 'required', '大类基础课'),
  aiCourse(2, 2, '2401021', '人工智能概论', 3, 'required', '专业基础课'),
  aiCourse(2, 2, '2401022', '算法设计与分析', 2, 'required', '专业基础课'),
  aiCourse(2, 2, '2401023', '计算机组成原理', 2, 'required', '专业基础课'),
  aiCourse(2, 2, '2401025', '计算机视觉与模式识别', 3, 'required', '专业主干课'),
  aiCourse(2, 2, '0701072', '思想政治理论课实践 II', 1, 'required', '实践教育课'),
  aiCourse(2, 2, '2401015', '电子工艺实习（劳动）', 1, 'required', '实践教育课'),
  aiCourse(2, 2, '2401024', '计算机组成原理实验', 1, 'required', '实践教育课'),
  aiCourse(2, 2, '2401026', '计算机视觉综合实践', 1, 'required', '实践教育课'),
  aiCourse(3, 1, '0701048', '习近平新时代中国特色社会主义思想概论', 3, 'required', '大类基础课'),
  aiCourse(3, 1, '0701059', '形势与政策 V', 0.25, 'required', '大类基础课'),
  aiCourse(3, 1, '2401006', '操作系统', 2, 'required', '专业基础课'),
  aiCourse(3, 1, '2401029', '机器学习（项目式）', 3, 'required', '专业主干课'),
  aiCourse(3, 1, '2401032', '神经网络与深度学习', 2, 'required', '专业主干课'),
  aiCourse(3, 1, '2404066', '信号与系统', 2, 'required', '专业主干课'),
  aiCourse(3, 1, '2401030', '机器学习实践', 1, 'required', '实践教育课'),
  aiCourse(3, 1, '2401031', 'Linux 操作系统实践', 1, 'required', '实践教育课'),
  aiCourse(3, 1, '2401033', '深度学习应用实践', 2, 'required', '实践教育课'),
  aiCourse(3, 2, '0701060', '形势与政策 VI', 0.25, 'required', '大类基础课'),
  aiCourse(3, 2, '2401007', '计算机网络', 2, 'required', '专业主干课'),
  aiCourse(3, 2, '2401039', '智能机器人基础（交叉）', 2.5, 'required', '专业主干课'),
  aiCourse(3, 2, '2401008', '计算机网络实验', 0.5, 'required', '实践教育课'),
  aiCourse(3, 2, '2401040', '智能机器人课程设计', 1, 'required', '实践教育课'),
  aiCourse(3, 2, '2401041', '人工智能专业课程设计', 2, 'required', '实践教育课'),
  aiCourse(3, 2, '2401042', '计算机系统设计综合实验', 2, 'required', '实践教育课'),
  aiCourse(3, 2, '2401059', '创新创业实践与训练（创新创业）', 2, 'required', '实践教育课'),
  aiCourse(3, 3, '2401065', '国际人工智能与智能控制前沿讲座（国际化）', 1, 'required', '专业主干课'),
  aiCourse(4, 1, '0701061', '形势与政策 VII', 0.25, 'required', '大类基础课'),
  aiCourse(4, 1, '2401051', '人工智能的工程经济与伦理', 1, 'required', '专业主干课'),
  aiCourse(4, 1, '2401052', '生成式人工智能技术（本研贯通）', 2, 'required', '专业主干课'),
  aiCourse(4, 1, '2401049', '认识实习', 1, 'required', '实践教育课'),
  aiCourse(4, 1, '2401060', '人工智能劳动实践（社会实践）', 2, 'required', '实践教育课'),
  aiCourse(4, 2, '0701062', '形势与政策 VIII', 0.25, 'required', '大类基础课'),
  aiCourse(4, 2, '2401050', '毕业设计', 14, 'required', '实践教育课'),
  aiCourse(2, 2, '2401027', '面向对象设计模式与方法', 2, 'elective', '专业选修课'),
  aiCourse(2, 2, '2401061', '智能生成式艺术', 2, 'elective', '专业选修课'),
  aiCourse(2, 2, '2401062', 'FPGA 技术与应用', 2, 'elective', '专业选修课'),
  aiCourse(3, 1, '2401036', '数值计算方法', 2, 'elective', '专业选修课'),
  aiCourse(3, 1, '2401037', '3D 计算机图形学', 2, 'elective', '专业选修课'),
  aiCourse(3, 1, '2401038', '控制工程基础', 2, 'elective', '专业选修课'),
  aiCourse(3, 1, '2401063', '数据库原理及应用', 2, 'elective', '专业选修课'),
  aiCourse(3, 1, '2401064', '嵌入式系统与应用', 2, 'elective', '专业选修课'),
  aiCourse(3, 1, '2404065', '数据挖掘', 2, 'elective', '专业选修课'),
  aiCourse(3, 2, '2401043', '知识工程与专家系统（荣誉）', 2, 'elective', '专业选修课'),
  aiCourse(3, 2, '2401044', 'AI 医学影像分析与应用', 2, 'elective', '专业选修课'),
  aiCourse(3, 2, '2401045', '游戏 AI 设计与开发', 2, 'elective', '专业选修课'),
  aiCourse(3, 2, '2401046', '编译原理', 2, 'elective', '专业选修课'),
  aiCourse(3, 2, '2401047', '水下智能探测与定位技术', 2, 'elective', '专业选修课'),
  aiCourse(3, 2, '2401048', '水下机器人', 2, 'elective', '专业选修课'),
  aiCourse(4, 1, '2401054', '情感计算', 2, 'elective', '专业选修课'),
  aiCourse(4, 1, '2401055', '云计算与大数据技术', 2, 'elective', '专业选修课'),
  aiCourse(4, 1, '2401056', '计算机辅助设计', 2, 'elective', '专业选修课'),
  aiCourse(4, 1, '2401057', '脑科学概论', 2, 'elective', '专业选修课'),
  aiCourse(4, 1, '2401058', '多智能体系统（荣誉）', 2, 'elective', '专业选修课'),
  aiCourse(4, 1, '2401069', '自然语言处理（荣誉、本研贯通）', 2, 'elective', '专业选修课')
]

const semesterMap = new Map<string, string[]>()
for (const course of artificialIntelligenceCourses) {
  const key = `${course.year}-${course.semester}`
  semesterMap.set(key, [...(semesterMap.get(key) ?? []), course.slug])
}

export const artificialIntelligenceCurriculum: ResourceCurriculum = {
  cohort: 2026,
  major: 'artificial-intelligence',
  majorName: '人工智能',
  note: '来源：人工智能专业本科人才培养方案（人工智能_方案详细.doc）。',
  semesters: Array.from(semesterMap, ([key, courses]) => {
    const [year, semester] = key.split('-').map(Number)
    if (!year || !semester) throw new Error(`Invalid artificial intelligence semester key: ${key}`)
    return { year, semester, courses }
  }),
  courseDetails: Object.fromEntries(artificialIntelligenceCourses.map(course => [course.slug, course]))
}
