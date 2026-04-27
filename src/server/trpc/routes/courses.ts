import { z } from 'zod';
import { publicProcedure, protectedProcedure, router } from '@/server/trpc';
import { db } from '@/server/db';
import { coursesTable, cardsTable } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const courseRouter = router({
  getCourses: publicProcedure.query(async () => {
    return db.query.coursesTable.findMany();
  }),

  getCourseById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const course = await db.query.coursesTable.findFirst({
      where: eq(coursesTable.id, input.id),
    });

    if (!course) {
      throw new Error('Course not found');
    }

    const cards = await db.query.cardsTable.findMany({
      where: eq(cardsTable.courseId, course.id),
    });

    return { ...course, cards };
  }),

  createCourse: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        difficulty: z.enum(['easy', 'medium', 'hard']),
        timePerCard: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const course = await db.insert(coursesTable).values({
        name: input.name,
        description: input.description,
        difficulty: input.difficulty,
        cardsCount: 0,
        timePerCard: input.timePerCard,
      });

      return course;
    }),
});
