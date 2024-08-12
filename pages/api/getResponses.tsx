import { response } from '../../src/schema'; // Adjust the path to your schema file
import { db } from '../../src/db'; // Adjust the path to your db connection file
import { NextApiRequest, NextApiResponse } from 'next';
import { and, eq } from 'drizzle-orm';

function isDateMatching(date: string, timestamp: Date): boolean {
  // Extract the date part from the timestamp
  const datePart = timestamp.toISOString().split('T')[0];

  // Compare the extracted date part with the provided date
  return date == datePart;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { RoutineId, employeeId, date } = req.body;
      console.log("Incoming request data:", req.body);

      if (!RoutineId || !employeeId || !date) {
        return res.status(400).json({ error: 'Missing required fields: RoutineId, employeeId, date' });
      }

      const responses = await db.select().from(response).where(
        and(
          eq(response.employeeId, employeeId),
          eq(response.routineId, RoutineId)
        )
      );

      const filteredResponses = responses.filter((resp) => isDateMatching(date, resp.date));

      res.status(200).json({ filteredResponses });
    } catch (error: any) {
      console.error('Error filtering responses', error);
      res.status(500).json({ error: 'Failed to filter responses' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
