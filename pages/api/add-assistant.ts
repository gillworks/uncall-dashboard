import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { name, identity, style, voice } = req.body;
      const assistant = await prisma.assistants.create({
        data: {
          name,
          identity,
          style,
          voice: voice ? JSON.parse(voice) : null
        }
      });
      res.status(200).json(assistant);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add assistant' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
