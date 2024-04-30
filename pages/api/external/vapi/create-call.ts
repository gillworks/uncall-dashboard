import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const options: RequestInit = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer 905a52ab-a8b2-4b59-af43-a83c203ea406',
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
    console.log('API Call Response:', data); // Log the response from a successful call
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data from external API' });
  }
}
