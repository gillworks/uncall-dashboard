import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
      const { data: existingCall, error: findError } = await supabase
        .from('calls')
        .select('*')
        .eq('vapiId', callId)
        .single();

      if (findError || !existingCall) {
        return res.status(404).json({ error: 'Call not found' });
      }

      if (
        message.type !== 'status-update' &&
        message.type !== 'end-of-call-report'
      ) {
        return res.status(400).json({ error: 'Invalid message type' });
      }

      let timestamps = {};
      if (
        message.type === 'status-update' ||
        message.type === 'end-of-call-report'
      ) {
        const response = await fetch(`https://api.vapi.ai/call/${callId}`);
        const callDetails = await response.json();
        timestamps = {
          startedAt: callDetails.startedAt,
          endedAt: callDetails.endedAt
        };
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
        recordingUrl: message.recordingUrl || undefined,
        transcribed: message.transcript ? true : existingCall.transcribed,
        ...timestamps
      };

      const { data: updatedCall, error: updateError } = await supabase
        .from('calls')
        .update(updateData)
        .match({ id: existingCall.id });

      if (updateError) {
        throw new Error('Failed to update call record');
      }

      // Update related task status to 'complete' if the call report is 'end-of-call-report'
      if (message.type === 'end-of-call-report' && existingCall.taskId) {
        const { error: taskUpdateError } = await supabase
          .from('tasks')
          .update({ status: 'complete' })
          .match({ id: existingCall.taskId });

        if (taskUpdateError) {
          console.error(
            'Failed to update task status:',
            taskUpdateError.message
          );
        }
      }

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
