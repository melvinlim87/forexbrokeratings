// pages/api/ai.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const prompt = req.body;
  try {

    // const response = await fetch('https://api.anthropic.com/v1/messages', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'x-api-key': process.env.ANTHROPIC_API_KEY!,
    //       'anthropic-version': '2023-06-01'
    //     },
    //     body: JSON.stringify({
    //       model: 'claude-3-5-sonnet-20241022',
    //       max_tokens: 1024,
    //       messages: [
    //         {
    //           role: 'user',
    //           content: `
    //             You are a professional AI analyst tasked with evaluating forex brokers.
                
    //             You will be provided with a JSON input that may contain partial or complete information about a broker. In some cases, only the broker name will be given.
                
    //             Your responsibilities:
                
    //             Analyze the available broker data provided in the JSON.
                
    //             If key details are missing (e.g. regulation, trading conditions, platform types, or only the name is given), you may autonomously search the public web to collect relevant information from the broker’s official website or trusted sources.
                
    //             Based on all available and retrieved information, write a concise, professional summary report for retail traders and analysts.
                
    //             Your report must cover:
    //             • Broker Overview
    //             • Regulation & Safety
    //             • Trading Conditions (platforms, spreads, execution model)
    //             • Account Requirements & Promotions
    //             • Suitability (e.g. beginner, experienced, algo traders)
    //             • Any Red Flags
    //             • Final Verdict (include a 0–10 rating if possible)
                
    //             ✍️ Important:
    //             Keep the tone objective, factual, and clear.
    //             Do not output raw data, notes, or JSON — only return the final summary report.
                
    //             Prompt:
    //             ${JSON.stringify(prompt)}
    //             `
    //         }
    //       ]
    //     })
    //   });

    // const data = await response.json();
    // const message = data.content?.[0]?.text || '';

      
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

            You will be provided with a JSON input that may contain partial or complete information about a broker. In some cases, only the broker name will be given.

            Your responsibilities:

            Analyze the available broker data provided in the JSON.

            If key details are missing (e.g. regulation, trading conditions, platform types, or only the name is given), you may autonomously search the public web to collect relevant information from the broker’s official website or trusted sources.

            Based on all available and retrieved information, write a concise, professional summary report for retail traders and analysts.

            Your report must cover:
            Broker Overview

            Regulation & Safety

            Trading Conditions (platforms, spreads, execution model)

            Account Requirements & Promotions

            Suitability (e.g. beginner, experienced, algo traders)

            Any Red Flags

            Final Verdict (include a 0–10 rating if possible)

            ✍️ Important:

            Keep the tone objective, factual, and clear.

            Do not output raw data, notes, or JSON — only return the final summary report.
 
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
