import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const assistantId = parseInt(req.query.assistantId as string);
    if (isNaN(assistantId)) {
      res.status(400).json({ error: 'Invalid Assistant ID' });
      return;
    }
    const assistant = await prisma.assistants.findUnique({
      where: {
        id: assistantId,
        deletedAt: null
      }
    });
    if (assistant) {
      res.status(200).json(assistant);
    } else {
      res.status(404).json({ error: 'Assistant not found' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
