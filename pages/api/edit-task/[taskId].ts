import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    const taskId = parseInt(req.query.taskId as string);
    if (isNaN(taskId)) {
      res.status(400).json({ error: 'Invalid Task ID' });
      return;
    }

    try {
      const { name, instructions, type, assistantId } = req.body;
      const updatedTask = await prisma.tasks.update({
        where: {
          id: taskId,
          deletedAt: null
        },
        data: {
          name,
          instructions,
          type,
          assistantId: assistantId ? parseInt(assistantId) : null
        }
      });
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(404).json({ error: 'Task not found or update failed' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
