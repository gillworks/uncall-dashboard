import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const tasks = await prisma.tasks.findMany({
      where: {
        deletedAt: null // Only select tasks where deletedAt is null
      },
      include: {
        assistants: {
          select: {
            name: true // Selecting the name of the assistant
          }
        }
      }
    });
    res.status(200).json(tasks);
  } else {
    // Handle other HTTP methods or return an error
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
