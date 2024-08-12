// pages/api/users
import type { NextApiRequest, NextApiResponse } from 'next';
import { getUsersBySocietyId } from '../../src/queries';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const societyId = 1; // Example societyId to filter users by
      const users = await getUsersBySocietyId(societyId);
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
