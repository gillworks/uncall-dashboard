import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    const assistantId = parseInt(req.query.assistantId as string);
    if (isNaN(assistantId)) {
      res.status(400).json({ error: 'Invalid Assistant ID' });
      return;
    }

    try {
      const { name, identity, style, voice } = req.body;
      const updatedAssistant = await prisma.assistants.update({
        where: {
          id: assistantId,
          deletedAt: null
        },
        data: {
          name,
          identity,
          style,
          voice: voice ? JSON.parse(voice) : null
        }
      });
      res.status(200).json(updatedAssistant);
    } catch (error) {
      res.status(404).json({ error: 'Assistant not found or update failed' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
