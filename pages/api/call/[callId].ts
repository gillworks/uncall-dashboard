import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const callId = parseInt(req.query.callId as string);
    if (isNaN(callId)) {
      res.status(400).json({ error: 'Invalid Call ID' });
      return;
    }
    const call = await prisma.calls.findUnique({
      where: {
        id: callId,
        deletedAt: null
      }
    });
    if (call) {
      res.status(200).json(call);
    } else {
      res.status(404).json({ error: 'Call not found' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
