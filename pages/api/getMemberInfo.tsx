// pages/api/example.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getNotes } from '../../src/queries';
import { membership,user } from '../../src/schema'; 
import { db } from '../../src/db';
import { asc, between, count, eq, getTableColumns, sql, inArray } from 'drizzle-orm';
import { integer, numeric } from 'drizzle-orm/pg-core';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const routineId = parseInt(req.query.RoutineId as string, 10); 
      const members=await db.select().from(membership).where(eq(membership.routineId,routineId))

    const memberIds = members.map(member => member.employeeId);
    const participants=await db.select().from(user).where(inArray(user.id,memberIds));
      res.status(200).json(participants);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch members' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
