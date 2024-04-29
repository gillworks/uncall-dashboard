import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { type } = req.query;
    const whereClause: { deletedAt: null; type?: string } = {
      deletedAt: null
    };

    if (type) {
      whereClause['type'] = Array.isArray(type) ? type[0] : type;
    }

    const calls = await prisma.calls.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        tasks: {
          select: {
            name: true,
            assistants: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });
    res.status(200).json(calls);
  } else {
    // Handle other HTTP methods or return an error
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
