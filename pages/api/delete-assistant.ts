import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      await prisma.assistants.update({
        where: { id: Number(id) },
        data: { deletedAt: new Date() } // Setting 'deletedAt' to the current timestamp for soft deletion
      });
      res.status(200).json({ message: 'Assistant deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete assistant' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
