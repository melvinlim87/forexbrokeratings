// pages/api/ai.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const prompt = req.body;
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://forexbrokeratings.com',
        'X-Title': 'Forex Broker Ratings'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528:free',
        messages: [
          { role: 'system', content: `
            You are a professional AI analyst tasked with evaluating forex brokers.

            You will be provided with structured JSON input about a broker. Your job is to:

            1. Analyze the available broker data.
            2. If important details are missing (e.g. regulation, trading conditions, platform types), assume you can access the public web to search for additional context.
            3. Write a concise, professional **summary report** for retail traders and analysts. Keep the tone objective, informative, and readable.

            🔎 Your summary must cover:
            - Broker Overview
            - Regulation & Safety
            - Trading Conditions (platforms, spreads, execution)
            - Account Requirements & Promotions
            - Suitability (beginner / experienced / algo trader etc.)
            - Any Red Flags
            - Final Verdict (with optional score out of 10)

            🎯 Output only the final summary report — no notes, code blocks, or raw JSON.
 
          `},
          { role: 'user', content: JSON.stringify(prompt) }
        ]
      })
    });

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content || '';
    res.status(200).json({ result: message });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch from OpenRouter', details: error.message });
  }
}
