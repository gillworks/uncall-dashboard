import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { taskId, status, vapiId, type } = req.body;
      const call = await prisma.calls.create({
        data: {
          taskId,
          status,
          vapiId,
          type
        }
      });
      res.status(200).json(call);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add call' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
