import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchAIResult, fetchBrokerDetailsByName } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  let prompt = req.body;
  try {
    // Try to fetch cached AI result from Supabase first
    try {
      const cachedResult = await fetchAIResult(prompt);
      if (cachedResult && cachedResult.result) {
        return setTimeout(() => {
          res.status(200).json({ result: cachedResult.result, cached: true, usePrev: true });
        }, 2000);
      }
    } catch (err) {
      // Ignore cache miss or fetch error and proceed to model
    }
    // update prompt, try search from supabase first
    try {
      const cachedResult = await fetchBrokerDetailsByName(prompt.replace(/^(analyze|analyse)\s+/i, ''));
      if (cachedResult && cachedResult.name) {
        prompt = cachedResult;
      }
    } catch (err) {
      // Ignore cache miss or fetch error and proceed to model
    }

    // Call ai chat model
    // Try up to 5 different models in sequence
    const models = [
      'deepseek/deepseek-r1-0528:free',
      'qwen/qwen2.5-vl-72b-instruct:free',
      'mistralai/mistral-small-3.2-24b-instruct-2506:free',
      'meta-llama/llama-4-maverick:free',
      'nvidia/llama-3.3-nemotron-super-49b-v1:free'
    ];
    let message = '';
    let lastError = null;
    for (let i = 0; i < models.length; i++) {
      try {
        const model = models[i];
        const systemPrompt =
            `You are an expert forex broker analyst with comprehensive knowledge of the forex trading industry.

            Your task is to analyze a broker based on user input. Format the output using line breaks (\n) so it displays correctly inside an HTML <div>. Follow all formatting rules strictly.

            CRITICAL FORMATTING REQUIREMENTS:

            Structure your response with clear sections using headings that end with a colon (:)

            Use bullet points with single dashes (-) for lists and comparisons

            Use \n to represent each new line or paragraph break

            Keep paragraphs concise (2–4 sentences maximum)

            Do NOT use asterisks (*), HTML tags, or Markdown formatting

            Avoid redundant or repetitive information

            Ensure the response reads naturally and is cleanly formatted in plain text for use inside a <div>

            RESPONSE STRUCTURE EXAMPLE (include line breaks using \n):

            Regulatory Compliance:\n
            Brief paragraph about regulations.\n

            Broker 1 regulation details\n

            Broker 2 regulation details\n

            Trading Conditions:\n
            Brief paragraph about trading conditions.\n

            Specific point about spreads\n

            Specific point about execution\n

            Best Promotions:\n
            Brief paragraph about current offers and bonuses.\n

            Broker 1 promotional offers\n

            Broker 2 promotional offers\n

            User Experience:\n
            Brief paragraph about overall user experience and platform usability.\n

            Platform ease of use\n

            Customer support quality\n

            Mobile app functionality\n

            SPECIAL CONDITION:
            If the user request is general (e.g. “best broker reviews”, “top brokers 2025”, or doesn’t mention a specific broker), generate an insightful market comparison using publicly available data. You must include RS Finance as one of the brokers in the review.

            Always provide factual, unbiased information. Write in a professional yet conversational tone. Do not include any HTML or Markdown.
            `
              
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://forexbrokeratings.com',
            'X-Title': 'Forex Broker Ratings'
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: JSON.stringify(prompt) }
            ]
          })
        });
        const data = await response.json();
        message = data.choices?.[0]?.message?.content || '';
        if (message) break;
      } catch (err) {
        lastError = err;
        message = '';
      }
    }

    if (!message) {
      res.status(500).json({ error: 'AI analysis failed. Please try again later.' });
      return;
    }

    res.status(200).json({ result: message, usePrev: false });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch from OpenRouter', details: error.message });
  }
}
