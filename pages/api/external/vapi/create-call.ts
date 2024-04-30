import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { callId } = req.body;

  const options: RequestInit = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      maxDurationSeconds: 1800,
      assistantId: '523cf456-b44d-41f2-82de-c23114e0dda6',
      customer: {
        number: '+14702903741',
        name: 'Courtesy Ford'
      },
      phoneNumberId: '7cf912a6-025c-412b-95a5-c5edd0020b52'
    })
  };

  try {
    const response = await fetch('https://api.vapi.ai/call/phone', options);
    const data = await response.json();

    if (response.ok) {
      // Update the call record in the database with the VAPI call ID using Prisma
      const updateCall = await prisma.calls.update({
        where: { id: parseInt(callId) },
        data: { vapiId: data.id }
      });

      if (!updateCall) {
        throw new Error('Failed to update call record with VAPI ID');
      }
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data from external API' });
  }
}
