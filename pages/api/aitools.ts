import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchAIResult, supabase } from '@/lib/supabase';
import { rateLimit } from '@/lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!(await rateLimit(req, res))) return;
  const prompt = req.body;

  try {
    // Step 1: Check if cached AI result exists
    try {
      const cachedResult = await fetchAIResult(prompt);
      if (cachedResult && cachedResult.result) {
        return setTimeout(() => {
          res.status(200).json({ result: cachedResult.result, cached: true, usePrev: true, user_id: cachedResult.user_id });
        }, 2000);
      }
    } catch (err) {
      // Ignore cache errors
    }

    // Step 2: Extract brokers, fields, prompt using AI agent
    const contentExtractionPrompt = `
        You are a forex broker request interpreter.

        Your task is to analyze the user's message and return a structured JSON object that breaks the request into 4 parts:
        1. Recognized broker names
        2. Mapped fields found in your internal database
        3. Remaining fields that must be searched online
        4. A clean rewritten version of the user request as a prompt

        Your current broker database fields are:

        id, name, slug, website, description, summary, rating, year_published, headquarters, country, offices, employees, address, regulators, is_regulated, instruments, spread_eur_usd, leverage_max, account_types, base_currencies, platforms, deposit_methods, withdraw_methods, min_deposit, min_withdrawl, deposit_fees, withdrawal_fees, deposit_process_time, withdrawal_process_time, languages, availability, channels, phone_numbers, email, response_time, pros, cons

        Respond strictly in this JSON format:

        {
        "brokers": ["exact broker name 1", "exact broker name 2"],
        "fields_in_db": ["mapped_field_1", "mapped_field_2"] or ["*"] if none matched,
        "fields_search_online": ["unknown_field_1", "unknown_field_2"],
        "prompt": "cleaned and rephrased version of the user’s question"
        }

        Instructions:
        - Extract exact broker names from the user message (return in all lowercase)
        - Match any keywords in the message to your database fields
        - If no fields match, set "fields_in_db": ["*"]
        - Any extra info not in the DB should go under fields_search_online
        - The prompt should be a clean version of the user request
        - Return only the JSON — no comments or markdown

        Begin your analysis based on the following user request:
        `;

    const extract_response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://forexbrokeratings.com',
        'X-Title': 'Forex Broker Ratings'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-small-3.2-24b-instruct-2506:free',
        messages: [
          { role: 'system', content: contentExtractionPrompt },
          { role: 'user', content: prompt },
        ]
      })
    });
    
    const extract_response_data = await extract_response.json();
    const contents = extract_response_data.choices?.[0]?.message?.content || '';
    let cleanedRaw = contents
    .replace(/```/g, '')
    .replace(/^json\s*/i, '')
    .trim();
    const cleaned = JSON.parse(cleanedRaw);
    if (cleaned.brokers.length == 0) {
      // add rs finance to brokers
        await cleaned.brokers.push('rs finance');
    }
    // Step 3: Query broker data using ilike filter
    const filters = cleaned.brokers
      .map((name: string) => `name.ilike.%${name}%`)
      .join(',');
    const broker_details = await supabase
      .from('broker_details')
      .select(cleaned.fields_in_db.join(','))
      .or(`${filters}`);
    // Step 4: Build prompt for final analysis
    let data_prompt = '';
    for (const broker of broker_details.data as any || []) {
      Object.keys(broker).map(k => {
        data_prompt += `${k}:\n`;
        data_prompt += `${broker[k]}\n`;
      })
    }

    // Step 5: Call main AI model to generate analysis with fallback
    const models = [
      'deepseek/deepseek-r1-0528:free',
      'qwen/qwen2.5-vl-72b-instruct:free',
      'mistralai/mistral-small-3.2-24b-instruct-2506:free',
      'meta-llama/llama-4-maverick:free',
      'nvidia/llama-3.3-nemotron-super-49b-v1:free',
      'qwen/qwen3-235b-a22b:free',
      'google/gemma-3-12b-it:free',
      'qwen/qwen3-30b-a3b:free',
    ];
    
    // Define the system prompt for AI analysis
    const systemPrompt = `You are an expert forex broker analyst with comprehensive knowledge of the forex trading industry.

    CRITICAL FORMATTING REQUIREMENTS:
    1. Structure your response with clear sections using headings that end with a colon (:)
    2. Use bullet points with single dashes (-) for lists and comparisons
    3. Keep paragraphs concise (2-4 sentences maximum)
    4. Add blank lines between different sections
    5. NO asterisks (*), NO excessive formatting symbols
    6. Avoid repetitive content or redundant information
    
    RESPONSE STRUCTURE EXAMPLE:
    Regulatory Compliance:
    - Broker 1: Primary licenses (FCA, ASIC, etc.)
    - Broker 2: Primary licenses, corporate structure
    
    Trading Conditions:
    - Specific point about spreads
    - Specific point about execution
    
    Trading Platforms:
    - Platform availability (MT4, MT5, cTrader, etc.)
    - Mobile app availability
    
    Always provide factual, unbiased information. Write in a professional yet conversational tone.`;

    // Function to try a model with error handling
    const tryModel = async (model: string) => {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://forexbrokeratings.com',
            'X-Title': 'Forex Broker Ratings'
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: cleaned.prompt + '\n\nBroker Data:\n' + data_prompt },
            ],
            temperature: 0.7,
            max_tokens: 2000
          })
        });

        if (!response.ok) {
          throw new Error(`Model ${model} returned status ${response.status}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
      } catch (error) {
        console.error(`Error with model ${model}:`, error);
        return null;
      }
    };

    // Try models sequentially until one succeeds
    let aiResponse = '';
    for (const model of models) {
      const result = await tryModel(model);
      if (result) {
        aiResponse = result;
        break;
      }
    }

    if (!aiResponse) {
      throw new Error('All AI models failed to respond');
    }

    return res.status(200).json({ result: aiResponse, usePrev: false });
  } catch (error: any) {
    console.error('Error in AI tools handler:', error);
    return res.status(500).json({ 
      error: 'AI analysis failed', 
      details: error.message 
    });
  }
}
