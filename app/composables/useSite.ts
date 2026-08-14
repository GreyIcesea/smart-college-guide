export const statusLabels = {
  official: '官方信息',
  experience: '学生经验',
  unverified: '尚未核实'
} as const

export const typeLabels = {
  required: '必修',
  elective: '选修'
} as const

export function formatDate(date: string | Date) {
  const parsed = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(parsed)
}

export function gradeLabel(grades: number[]) {
  return grades.map((grade) => `大${['一', '二', '三', '四'][grade - 1]}`).join('、')
}
