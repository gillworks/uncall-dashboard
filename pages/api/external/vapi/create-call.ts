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
  const { taskId, callId } = req.body;

  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', parseInt(taskId))
    .single();

  if (taskError || !task) {
    return res.status(404).json({ error: 'Task not found' });
  } else {
    console.log(task);
  }

  const { data: assistant, error: assistantError } = await supabase
    .from('assistants')
    .select('*')
    .eq('id', task.assistantId ?? undefined)
    .single();

  if (assistantError || !assistant) {
    return res.status(404).json({ error: 'Assistant not found' });
  }

  const modelMessageContent = `[Identity]
  ${assistant.identity}

  ${
    assistant.style
      ? `[Style]
  ${assistant.style}`
      : ''
  }

  ${
    task.responseGuidelines
      ? `[Response Guidelines]
  ${task.responseGuidelines}`
      : ''
  }

  [Task]
  ${task.instructions}`;

  const options: RequestInit = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      maxDurationSeconds: task.maxCallDuration || 600,
      assistant: {
        transcriber: {
          provider: 'deepgram',
          model: 'nova-2',
          language: 'en'
        },
        model: {
          messages: [
            {
              content: modelMessageContent,
              role: 'assistant'
            }
          ],
          provider: 'openai',
          model: 'gpt-4-1106-preview',
          fallbackModels: ['gpt-4-0125-preview', 'gpt-4-0613'],
          semanticCachingEnabled: true,
          temperature: 0.7,
          maxTokens: 250
        },
        voice: assistant.voice,
        recordingEnabled: true,
        endCallFunctionEnabled: true,
        dialKeypadFunctionEnabled: true,
        hipaaEnabled: false,
        clientMessages: [
          'transcript',
          'hang',
          'function-call',
          'speech-update',
          'metadata',
          'conversation-update'
        ],
        serverMessages: [
          'end-of-call-report',
          'status-update',
          'hang',
          'function-call'
        ],
        silenceTimeoutSeconds: 30,
        responseDelaySeconds: 0.1,
        llmRequestDelaySeconds: 0.1,
        numWordsToInterruptAssistant: 2,
        maxDurationSeconds: 1800,
        backgroundSound: 'office',
        name: assistant.name,
        firstMessage: 'Hello?',
        voicemailDetectionEnabled: true,
        voicemailMessage: '',
        endCallMessage: 'Goodbye.',
        metadata: {},
        serverUrl: process.env.VAPI_SERVER_URL,
        serverUrlSecret: process.env.VAPI_SECRET
      },
      customer: {
        number: '+1' + task.contactPhoneNumber,
        name: task.contactName
      },
      phoneNumberId: '7cf912a6-025c-412b-95a5-c5edd0020b52'
    })
  };

  try {
    const response = await fetch('https://api.vapi.ai/call/phone', options);
    const data = await response.json();

    if (response.ok) {
      // Update the call record in the database with the VAPI call ID and the model message content using Supabase
      const { error: updateError } = await supabase
        .from('calls')
        .update({ vapiId: data.id, prompt: modelMessageContent })
        .match({ id: parseInt(callId) });

      if (updateError) {
        throw new Error('Failed to update call record with VAPI ID and prompt');
      }
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data from external API' });
  }
}
