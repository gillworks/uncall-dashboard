import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const taskId = parseInt(req.query.taskId as string);
    if (isNaN(taskId)) {
      res.status(400).json({ error: 'Invalid Task ID' });
      return;
    }
    const task = await prisma.tasks.findUnique({
      where: {
        id: taskId,
        deletedAt: null
      }
    });
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
