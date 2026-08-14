export interface CompetitionGuideItem {
  name: string
  aliases: string[]
  description: string
  time: string
  format: string
  skills: string[]
  advice: string
  recognition: string
  officialUrl: string
}

export interface CompetitionGuideSection {
  id: string
  index: string
  kicker: string
  title: string
  description: string
  items: CompetitionGuideItem[]
}

export const competitionGuideSections: CompetitionGuideSection[] = [
  {
    id: 'major-related',
    index: '01',
    kicker: '自动化与人工智能',
    title: '专业相关竞赛',
    description: '更贴近控制、电子、嵌入式与人工智能方向，通常需要较长准备周期和稳定团队。',
    items: [
      {
        name: '全国大学生电子设计竞赛',
        aliases: ['电赛', '国电赛', 'NUEDC'],
        description: '围绕电子系统完成方案设计、硬件制作、软件调试和现场测评，是智能院最典型的工程实践赛事之一。',
        time: '奇数年举办，通常在 7 月末至 8 月初集中竞赛',
        format: '3 人一队，约 4 天现场完成命题作品并参加测评',
        skills: ['模拟与数字电路', '单片机 / FPGA', '传感器', '焊接与调试'],
        advice: '先从电源、运放、ADC/DAC 和常用通信接口练起。组队时最好覆盖硬件、嵌入式和文档表达，并至少完整复刻一道往届题。',
        recognition: '2025 认定 · 一级',
        officialUrl: 'https://www.nuedc-training.com.cn/'
      },
      {
        name: '江苏省大学生电子设计竞赛',
        aliases: ['省电赛'],
        description: '面向江苏省高校学生的电子设计与工程实践竞赛，通常与国电赛错年举行，围绕给定任务完成电子系统设计、制作和现场测试。',
        time: '偶数年举办，通常在 7 月末至 8 月初集中竞赛，之后安排现场测试',
        format: '3 人一队，校内组队并由学校统一报名，完成命题作品、设计报告和现场测试',
        skills: ['模拟与数字电路', '单片机 / FPGA', '传感器', '焊接与调试'],
        advice: '准备方法与国电赛相近。先通过校内选拔进入队伍，再按信号、电源、控制小车或飞行器等方向积累可测量的作品；训练时同时记录电路、程序、参数和故障排查过程。',
        recognition: '江苏省级赛事',
        officialUrl: 'https://www.eelab.org.cn/jsuedc'
      },
      {
        name: '全国大学生智能汽车竞赛',
        aliases: ['智能车竞赛', '智能车'],
        description: '以自主运行的智能车为载体，综合考察感知、控制、嵌入式开发和整车工程调试。',
        time: '赛季通常从年初启动，7 月分赛区选拔，7—8 月全国总决赛',
        format: '按赛道组队，经历方案制作、现场调试与赛道竞速',
        skills: ['嵌入式开发', '自动控制', '计算机视觉', '机械与电路调试'],
        advice: '尽早确定赛道与硬件平台，把“稳定完赛”放在极限速度之前。建立日志、版本和参数表，避免所有经验只留在某一位队员脑中。',
        recognition: '2025 认定 · 一级',
        officialUrl: 'https://www.caa.org.cn/Content/260.html'
      },
      {
        name: '“西门子杯”中国智能制造挑战赛',
        aliases: ['西门子杯', 'CIMC'],
        description: '包含流程行业自动化、离散行业自动化、智能制造创新研发等方向，强调工业场景中的系统集成。',
        time: '通常春季报名与准备，7 月分赛区初赛，8 月前后全国总决赛',
        format: '按赛项组队，完成工程设计、编程调试、答辩或现场任务',
        skills: ['PLC / 工业控制', '系统建模', '工业网络', '工程文档与答辩'],
        advice: '先根据实验室设备与指导条件选赛项，再研究评分细则。把现场操作步骤做成清单，并针对设备、网络和程序异常准备回退方案。',
        recognition: '2025 认定 · 一级',
        officialUrl: 'https://www.siemenscup-cimc.org.cn/'
      },
      {
        name: '全球校园人工智能算法精英大赛',
        aliases: ['AI+算法精英赛', 'AIC'],
        description: '设置算法挑战、算法应用、产业命题和智能体开发等赛道，适合把机器学习能力落到真实题目中。',
        time: '多数赛道在 7—11 月报名与选拔，11—12 月完成决赛',
        format: '个人或团队参赛；提交算法结果、作品材料并参加答辩或决赛',
        skills: ['Python', '机器学习', '数据处理', '模型评估与展示'],
        advice: '不要只追模型分数。先搭好可复现的数据处理、训练与验证流程，再做特征、模型和工程优化；全程记录实验结果。',
        recognition: '2025 认定 · 二级',
        officialUrl: 'https://www.aicomp.cn/'
      }
    ]
  },
  {
    id: 'general',
    index: '02',
    kicker: '建模与程序设计',
    title: '其他竞赛',
    description: '不局限于单一专业方向，适合训练建模、编程、写作与高强度团队协作。',
    items: [
      {
        name: '全国大学生数学建模竞赛',
        aliases: ['数模国赛', 'CUMCM'],
        description: '把现实问题转化为数学模型，在限定时间内完成求解、验证和论文写作。',
        time: '通常在每年 9 月上旬，连续约 3 天',
        format: '1—3 人组队，从给定问题中选题并提交完整论文',
        skills: ['数学建模', 'Python / MATLAB', '数据分析', '论文写作'],
        advice: '三人最好分别偏建模、编程和写作，但每个人都要理解完整方案。赛前至少做一次连续三天的往届题模拟。',
        recognition: '2025 认定 · 一级',
        officialUrl: 'https://www.mcm.edu.cn/'
      },
      {
        name: '美国大学生数学建模竞赛',
        aliases: ['美赛', 'MCM / ICM'],
        description: '面向真实开放问题的国际建模竞赛，英文论文表达和规范引用与模型本身同样重要。',
        time: '通常在 1 月末至 2 月初，连续约 4 天',
        format: '同校最多 3 人组队，选择一道题并提交英文解决方案',
        skills: ['数学建模', '英文科技写作', '数据可视化', '文献检索'],
        advice: '提前准备英文论文模板、图表规范和引用流程。建模完成后要留足时间检查摘要、假设、敏感性分析和结论闭环。',
        recognition: '2025 认定 · 二级',
        officialUrl: 'https://contest.comap.com/undergraduate/contests/mcm/instructions.html'
      },
      {
        name: '国际大学生程序设计竞赛',
        aliases: ['ICPC', 'ACM-ICPC'],
        description: '经典团队算法竞赛，强调在有限时间内完成问题分析、代码实现和错误定位。',
        time: '区域赛季通常集中在 9—12 月，校内选拔时间更早',
        format: '3 人一队共用 1 台电脑，通常在 5 小时内解决多道算法题',
        skills: ['C++ / Java', '数据结构', '算法设计', '协作与快速调试'],
        advice: '先建立稳定的基础题正确率，再逐步补图论、动态规划和数学专题。固定队伍后要练习读题分工、口头讲算法和共用电脑。',
        recognition: '2025 认定 · 一级',
        officialUrl: 'https://icpc.global/'
      },
      {
        name: '蓝桥杯全国软件和信息技术专业人才大赛',
        aliases: ['蓝桥杯'],
        description: '覆盖软件、电子与项目类赛道，其中软件个人赛是较常见的算法竞赛入门选择。',
        time: '软件类省赛通常在 4 月，全国总决赛通常在 6 月',
        format: '软件算法赛多为个人机考；电子与项目赛按对应赛道规则进行',
        skills: ['程序设计', '基础算法', '数据结构', '时间管理'],
        advice: '先确认语言、组别和评分方式，再按真题限时训练。重点减少读题失误、边界遗漏和不必要的复杂实现。',
        recognition: '2025 认定 · 二级',
        officialUrl: 'https://dasai.lanqiao.cn/'
      }
    ]
  },
  {
    id: 'course-based',
    index: '03',
    kicker: '数学与英语基础',
    title: '课内学科类竞赛',
    description: '与公共基础课程衔接最紧，准备路径清楚，适合用一场比赛检验课堂学习成果。',
    items: [
      {
        name: '“高教社杯”江苏省高等学校高等数学竞赛',
        aliases: ['高数省赛'],
        description: '面向江苏高校学生的高等数学笔试竞赛，题目在课程基础上提高综合性与技巧性。',
        time: '通常在 5 月前后举行，以当届江苏赛区通知为准',
        format: '个人闭卷笔试，由学校统一组织报名和考点',
        skills: ['高等数学', '极限与微积分', '综合计算', '书面推导'],
        advice: '先补齐课本定义、定理和常见计算，再按章节刷历年题。错题要区分知识盲点、方法选择和计算失误。',
        recognition: '江苏省级赛事',
        officialUrl: 'https://www.cmathc.org.cn/sqtz/384.html'
      },
      {
        name: '全国大学生数学竞赛',
        aliases: ['高数国赛', 'CMC'],
        description: '由中国数学会主办，设数学专业类和非数学专业类，强调数学基本功与分析解决问题的能力。',
        time: '初赛通常在 10 月末至 11 月初，决赛在次年 3—4 月',
        format: '个人笔试，先参加赛区初赛，优秀选手进入全国决赛',
        skills: ['高等数学', '线性代数', '数学思维', '严谨推导'],
        advice: '智能院学生通常关注非数学专业组。准备顺序建议是教材基础、专题方法、历年真题和严格限时模拟。',
        recognition: '2025 认定 · 二级',
        officialUrl: 'https://www.cmathc.org.cn/'
      },
      {
        name: '全国大学生英语竞赛',
        aliases: ['大英赛', 'NECCS'],
        description: '全国性大学英语综合能力竞赛，覆盖听力、词汇语法、阅读、翻译和写作等题型。',
        time: '通常 2—3 月报名、4 月初赛、5 月决赛',
        format: '个人笔试，按参赛类别统一考试并由初赛选拔决赛',
        skills: ['英语听力', '词汇与语法', '阅读', '翻译与写作'],
        advice: '先用一套真题判断薄弱题型，再安排稳定的听力与限时阅读训练。写作和翻译要积累可复用表达并主动订正。',
        recognition: '2025 认定 · 二级',
        officialUrl: 'https://www.chinaneccs.cn/'
      }
    ]
  }
]
