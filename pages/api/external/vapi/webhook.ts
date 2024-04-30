import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Validate the X-VAPI-SECRET header
  const secret = req.headers['x-vapi-secret'];
  if (!secret || secret !== process.env.VAPI_SECRET) {
    return res.status(401).json({ error: 'Unauthorized: Invalid VAPI secret' });
  }

  if (req.method === 'POST') {
    const { message } = req.body;

    try {
      const callId = message.call.id;
      const existingCall = await prisma.calls.findUnique({
        where: { vapiId: callId }
      });
      if (!existingCall) {
        return res.status(404).json({ error: 'Call not found' });
      }

      if (
        message.type !== 'status-update' &&
        message.type !== 'end-of-call-report'
      ) {
        return res.status(400).json({ error: 'Invalid message type' });
      }

      const updateData = {
        status:
          message.type === 'end-of-call-report'
            ? 'completed'
            : message.type === 'status-update'
              ? message.status
              : existingCall.status,
        summary: message.summary || undefined,
        transcript: message.transcript || undefined,
        recordingUrl: message.recordingUrl || undefined
      };

      const updatedCall = await prisma.calls.update({
        where: { id: existingCall.id },
        data: updateData
      });

      res.status(200).json(updatedCall);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update call record' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
