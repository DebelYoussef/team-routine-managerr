// pages/api/example.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createUser } from '../../src/queries'; // Assuming you'll create a function to insert user

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Extract data from request body
      const { firstName, lastName, email, societyId, role } = req.body;

      // Validate input (optional)
      if (!firstName || !lastName || !email || !societyId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Create user in database
      const newUser = await createUser(firstName, lastName, email, societyId, role);

      // Send success response with created user data and message
      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
