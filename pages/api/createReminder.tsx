import { reminder, peopleToRemind } from '../../src/schema'; // Adjust the path to your schema file
import { db } from '../../src/db'; // Adjust the path to your db connection file
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { title, description, reminderTime, selectedMembers } = req.body;
      console.log("Incoming request data:", req.body);

      if (!title) {
        return res.status(400).json({ error: 'Missing required field: title' });
      }
      if (!description) {
        return res.status(400).json({ error: 'Missing required field: description' });
      }
      if (!reminderTime || reminderTime.length === 0) {
        return res.status(400).json({ error: 'Missing or invalid required field: reminderTime' });
      }
      if (!selectedMembers || selectedMembers.length === 0) {
        return res.status(400).json({ error: 'Missing required field: selectedMembers' });
      }

      // Insert the reminder into the reminder table
      const reminderResult = await db.insert(reminder).values({
        title,
        description,
        reminder_time: new Date(reminderTime),
      }).returning({
        id: reminder.id,
      });

      if (!reminderResult || reminderResult.length === 0) {
        throw new Error('Failed to insert reminder');
      }

      const reminderId = reminderResult[0].id;

      // Insert each selected member into the peopleToRemind table
      for (const member of selectedMembers) {
        if (!member.id) {
          return res.status(400).json({ error: 'Missing required field in selected member: id' });
        }

        await db.insert(peopleToRemind).values({
          employeeId: member.id,
          reminderId: reminderId,
        });
      }

      res.status(200).json({ message: 'Reminder and people to remind added successfully' });
    } catch (error: any) {
      console.error('Error creating reminder and people to remind:', error);

      if (error.message.includes('insert reminder')) {
        res.status(500).json({ error: 'Failed to insert reminder', details: error.message });
      } else if (error.message.includes('peopleToRemind')) {
        res.status(500).json({ error: 'Failed to insert people to remind', details: error.message });
      } else {
        res.status(500).json({ error: 'Failed to create reminder and people to remind', details: error.message });
      }
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
