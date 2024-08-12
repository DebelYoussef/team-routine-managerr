import { NextApiRequest, NextApiResponse } from 'next';
import { asc, between, count, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from '../../src/db'; // Adjust the import based on your setup
import { routine, question, option, membership } from '../../src/schema'; // Adjust the import based on your schema

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { routineData, questionsData, selectedParticipants } = req.body;

      // Validate input
      if (!routineData || !questionsData || questionsData.length === 0 || !selectedParticipants || selectedParticipants.length === 0) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Step 1: Insert routine data
      const routineResult = await db.insert(routine).values({
        routineName: routineData.routineName,
        startTime: new Date(routineData.startTime), // Ensure routineData.startTime is a Date object or valid timestamp string
        type: routineData.type,
        reminder: routineData.reminder,
        userId: routineData.userId,
        active: routineData.active,
        privacy: routineData.privacy,
        description: routineData.description,
        email: routineData.email, // New column
        frequency: routineData.frequency // New column
      }).returning({
        id: routine.id,
      });

      var routineId = routineResult[0].id;

      // Step 2: Insert each question
      const questionIds = [];
      for (const q of questionsData) {
        const questionResult = await db.insert(question).values({
          routineId: routineId,
          question: q.text,
          type: q.type,
        }).returning({
          id: question.id,
        });

        questionIds.push(questionResult[0].id);

        // Insert options if any
        if (q.options && q.options.length > 0) {
          for (const opt of q.options) {
            await db.insert(option).values({
              value: opt,
              questionId: questionResult[0].id,
            });
          }
        }
      }

      // Step 3: Insert selected participants into membership table
      for (const participantId of selectedParticipants) {
        await db.insert(membership).values({
          employeeId: participantId,
          routineId: routineId,
        });
      }

      res.status(201).json({ message: 'Routine created successfully' });
    } catch (error:any) {
      console.error('Error creating routine:', error);

      // Rollback routine and associated data if an error occurs
      

      res.status(500).json({ error: 'Failed to create routine', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
