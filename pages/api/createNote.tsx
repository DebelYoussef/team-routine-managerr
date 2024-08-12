import { note } from '../../src/schema'; // Adjust the path to your schema file
import { db } from '../../src/db'; // Adjust the path to your db connection file
import { NextApiRequest, NextApiResponse } from 'next';
import { deleteNote } from '../../src/queries';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { title, text, employeId,tags } = req.body;
      console.log("Incoming request data:", req.body);

      if (!title) {
        return res.status(400).json({ error: 'Missing required field: title' });
      }
      if (!text) {
        return res.status(400).json({ error: 'Missing required field: text' });
      }
     
      if (!employeId) {
        return res.status(400).json({ error: 'Missing required field: employe id' });
      }

      // Insert the reminder into the reminder table
       await db.insert(note).values({
        title,
        text,
        date: new Date(),
        employeeId:employeId,
      })

      

     

      res.status(200).json({ message: 'Note added successfully' });
    } catch (error: any) {
      console.error('Error Note:', error);

      
    }
  } 
  else if (req.method === 'DELETE'){
    try{
            const idNote = parseInt(req.query.idNote as string, 10); 
            await deleteNote(idNote);
            res.status(200).json("note deleted successfully");
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
  }
  
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
