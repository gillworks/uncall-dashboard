import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    const callId = parseInt(req.query.callId as string);
    if (isNaN(callId)) {
      res.status(400).json({ error: 'Invalid Call ID' });
      return;
    }

    try {
      const { read } = req.body;
      const updatedCall = await prisma.calls.update({
        where: {
          id: callId,
          deletedAt: null
        },
        data: {
          read
        }
      });
      res.status(200).json(updatedCall);
    } catch (error) {
      res.status(404).json({ error: 'Call not found or update failed' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
