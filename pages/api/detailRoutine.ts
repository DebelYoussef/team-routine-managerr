import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../src/db'; // Adjust the import path based on your project structure
import { asc, between, count, eq, getTableColumns, sql, inArray } from 'drizzle-orm';
import { routine, question, option, membership } from '../../src/schema'; // Adjust the import path

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { routineId } = req.query;

    if (routineId) {
      // Fetch a specific routine by ID
      const routines = await db.select().from(routine).where(eq(routine.id, Number(routineId)));

      if (routines.length === 0) {
        return res.status(404).json({ message: 'Routine not found' });
      }

      // Fetch related data for the specific routine
      const routineDetails = await Promise.all(routines.map(async (r) => {
        const routineQuestions = await db.select().from(question).where(eq(question.routineId, r.id));
        const routineOptions = await db.select().from(option).where(inArray(option.questionId, routineQuestions.map(q => q.id)));
        const routineMemberships = await db.select().from(membership).where(eq(membership.routineId, r.id));

        return {
          ...r,
          questions: routineQuestions.map(q => ({
            ...q,
            options: routineOptions.filter(o => o.questionId === q.id),
          })),
          memberships: routineMemberships,
        };
      }));

      return res.status(200).json(routineDetails[0]);
    } else {
      // Fetch all routines
      const routines = await db.select().from(routine);

      // Fetch related data for all routines
      const routineDetails = await Promise.all(routines.map(async (r) => {
        const routineQuestions = await db.select().from(question).where(eq(question.routineId, r.id));
        const routineOptions = await db.select().from(option).where(inArray(option.questionId, routineQuestions.map(q => q.id)));
        const routineMemberships = await db.select().from(membership).where(eq(membership.routineId, r.id));

        return {
          ...r,
          questions: routineQuestions.map(q => ({
            ...q,
            options: routineOptions.filter(o => o.questionId === q.id),
          })),
          memberships: routineMemberships,
        };
      }));

      return res.status(200).json(routineDetails);
    }
  } catch (error) {
    console.error('Error fetching routines:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
