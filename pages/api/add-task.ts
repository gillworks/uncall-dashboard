import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const {
        name,
        instructions,
        type,
        assistant,
        contactName,
        contactPhoneNumber
      } = req.body;
      const task = await prisma.tasks.create({
        data: {
          name,
          instructions,
          type,
          assistantId: assistant,
          contactName,
          contactPhoneNumber
        }
      });
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add task' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
