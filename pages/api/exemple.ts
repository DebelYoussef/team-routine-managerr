// pages/api/example.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserById } from '../../src/queries';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const userId = parseInt(req.query.id as string, 10); 
      const user = await getUserById(userId);
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
