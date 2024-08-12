import { response } from '../../src/schema'; // Adjust the path to your schema file
import { db } from '../../src/db'; // Adjust the path to your db connection file
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { responses,employeeId } = req.body;
      console.log("Incoming request data:", req.body);

      if (!responses) {
        return res.status(400).json({ error: 'Missing required field: responses' });
      }
    const date=new Date()
      for (const R of responses) {
        await db.insert(response).values({
          routineId:R.idRoutine,
          employeeId:employeeId,
          value:R.value,
          questionId:R.idQuestion,
          date:date,
        });
      }
      

      res.status(200).json({ message: 'Responses added successfully' });
    } catch (error: any) {
      console.error('Error adding responses', error);

      
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
