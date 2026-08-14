import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const status = z.enum(['official', 'experience', 'unverified'])

export default defineContentConfig({
  collections: {
    guides: defineCollection({
      type: 'page',
      source: 'guides/**/*.md',
      schema: z.object({
        title: z.string(),
        slug: z.string(),
        description: z.string(),
        category: z.string(),
        targetGrades: z.array(z.number().int().min(1).max(4)),
        sourceStatus: status,
        lastVerified: z.string(),
        order: z.number().int(),
        sourcePath: z.string().optional()
      })
    }),
    courses: defineCollection({
      type: 'page',
      source: 'courses/*.md',
      schema: z.object({
        title: z.string(),
        slug: z.string(),
        description: z.string(),
        credits: z.number().positive(),
        type: z.enum(['required', 'elective']),
        grade: z.array(z.number().int().min(1).max(4)),
        semester: z.array(z.number().int().min(1).max(2)),
        majors: z.array(z.string()),
        prerequisites: z.array(z.string()),
        nextCourses: z.array(z.string()),
        tags: z.array(z.string()),
        lastVerified: z.string(),
        applicableCohorts: z.array(z.number().int().min(2000).max(2100)),
        sourceStatus: status
      })
    }),
    competitions: defineCollection({
      type: 'page',
      source: 'competitions/*.md',
      schema: z.object({
        title: z.string(),
        slug: z.string(),
        description: z.string(),
        category: z.array(z.string()),
        recommendedGrades: z.array(z.number().int().min(1).max(4)),
        difficulty: z.number().int().min(1).max(5),
        teamSize: z.string(),
        recommendedSkills: z.array(z.string()),
        officialUrl: z.string().url(),
        lastVerified: z.string(),
        tags: z.array(z.string()),
        sourceStatus: status
      })
    }),
    curricula: defineCollection({
      type: 'data',
      source: 'curricula/*.yml',
      schema: z.object({
        cohort: z.number().int().min(2000).max(2100),
        major: z.string(),
        majorName: z.string(),
        note: z.string(),
        semesters: z.array(
          z.object({
            year: z.number().int().min(1).max(4),
            semester: z.number().int().min(1).max(2),
            courses: z.array(z.string())
          })
        )
      })
    }),
    faq: defineCollection({
      type: 'page',
      source: 'faq/*.md',
      schema: z.object({
        title: z.string(),
        slug: z.string(),
        description: z.string(),
        category: z.string(),
        order: z.number().int(),
        lastVerified: z.string(),
        sourceStatus: status
      })
    })
  }
})
