import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchAIResult, supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const prompt = req.body;

  try {
    // Step 1: Check if cached AI result exists
    try {
      const cachedResult = await fetchAIResult(prompt);
      if (cachedResult && cachedResult.result) {
        return setTimeout(() => {
          res.status(200).json({ result: cachedResult.result, cached: true, usePrev: true, user_id: cachedResult.user_id });
        }, 8000);
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

        id, name, slug, website, description, summary, rating, year_published, headquarters, country, offices, employees, address, regulators, licenses, is_regulated, instruments, spread_eur_usd, leverage_max, account_types, base_currencies, platforms, deposit_methods, withdraw_methods, min_deposit, min_withdrawl, deposit_fees, withdrawal_fees, deposit_process_time, withdrawal_process_time, languages, availability, channels, phone_numbers, email, response_time, pros, cons

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
      data_prompt += `${broker.name.toLowerCase()}:\n`;
      data_prompt += `${JSON.stringify(broker)}\n`;
    }

    // Step 5: Call main AI model to generate analysis
    const models = [
      'deepseek/deepseek-r1-0528:free',
      'qwen/qwen2.5-vl-72b-instruct:free',
      'mistralai/mistral-small-3.2-24b-instruct-2506:free',
      'meta-llama/llama-4-maverick:free',
      'nvidia/llama-3.3-nemotron-super-49b-v1:free'
    ];

    `You are an expert forex broker analyst with comprehensive knowledge of the forex trading industry.

    CRITICAL FORMATTING REQUIREMENTS:
    1. Structure your response with clear sections using headings that end with a colon (:)
    2. Use bullet points with single dashes (-) for lists and comparisons
    3. Keep paragraphs concise (2-4 sentences maximum)
    4. Add blank lines between different sections
    5. NO asterisks (*), NO excessive formatting symbols
    6. Avoid repetitive content or redundant information
    
    RESPONSE STRUCTURE EXAMPLE:
    Regulatory Compliance:
    Provide a comprehensive and detailed analysis of the broker's regulatory framework and corporate background. Include extensive information about licensing authorities, company incorporation details, operational jurisdictions, geographical restrictions, regulatory history, and compliance track record.
    
    - Broker 1: Primary licenses (FCA, ASIC, etc.), parent company incorporation country, operational jurisdictions, restricted countries
    - Broker 2: Primary licenses, corporate structure, regulatory history, geographical limitations
    - Broker 2 regulation details
    
    Trading Conditions:
    Comprehensive analysis of trading conditions including detailed breakdown of costs, execution quality, and trading environment.
    
    - Specific point about spreads
    - Specific point about execution
    - Specific point about leverage
    - Specific point about trading instruments
    
    Trading Platforms:
    Detailed evaluation of all available trading platforms, their features, performance, and suitability for different trading styles.
    
    - Platform availability (MT4, MT5, cTrader, TradingView, proprietary platforms)
    - Platform-specific features and tools
    - Mobile app availability and functionality
    - Web-based trading options
    - API access and algorithmic trading support
    
    Best Promotions:
    Comprehensive overview of current promotional offers, bonuses, and special programs available to new and existing clients.
    
    - Broker 1 promotional offers
    - Broker 2 promotional offers
    
    User Experience:
    Detailed assessment of the overall user experience including platform usability, customer service quality, educational resources, and client satisfaction.
    
    - Platform ease of use
    - Customer support quality
    - Mobile app functionality
    
    Summary and Rating Matrix:
    Detailed comparative analysis with comprehensive scoring matrix evaluating all key aspects of each broker's offering.
    
    Rating Matrix (0-100 scale):
    - Broker 1: Regulation (X/100), Trading Costs (X/100), Platform Quality (X/100), Customer Support (X/100), Overall Score (X/100)
    - Broker 2: Regulation (X/100), Trading Costs (X/100), Platform Quality (X/100), Customer Support (X/100), Overall Score (X/100)
    
    Final Recommendation:
    Provide a clear, actionable recommendation based on the comprehensive analysis above. Include which broker is better suited for different types of traders (beginners, experienced, scalpers, swing traders, etc.) and explain the reasoning behind the recommendation.
    
    Disclaimer:
    This analysis is generated by AI based on available data and may not reflect the most current market conditions or broker offerings. Information provided may be outdated or incomplete. Trading forex involves significant risk and may not be suitable for all investors. Broker conditions, regulations, and offerings change frequently. Always verify current information directly with brokers and conduct your own research before making trading decisions. Past performance does not guarantee future results.
    
    Always provide factual, unbiased information. Write in a professional yet conversational tone.`;
    

    let message = '';
    for (let i = 0; i < models.length; i++) {
      try {
        const model = models[i];
        const systemPrompt = `
            You are an expert forex broker analyst with deep knowledge of the forex trading industry.

            Your task is to respond to the user's request using the broker data provided. Be factual, unbiased, and structured in your analysis.

            FORMAT & STYLE REQUIREMENTS:
            - Organize your response using **section headings** ending with a colon (e.g. Regulatory Compliance:)
            - Use bullet points with single dashes (-) for details, comparisons, or lists
            - Add **blank lines between sections** for clarity
            - Keep all paragraphs concise (2–4 sentences maximum)
            - Use \n for all line and paragraph breaks
            - Do NOT use asterisks (*), Markdown, or HTML tags
            - Avoid redundancy or repeated facts already visible in the input data
            - Maintain a professional yet conversational tone

            RESPONSE SECTIONS TO COVER WHEN APPLICABLE:
            - Regulatory Compliance:
              Provide detailed analysis of licenses, company registration, jurisdictional coverage, compliance history, and restrictions.

            - Trading Conditions:
              Include breakdowns of spreads, execution quality, leverage, available instruments, and overall trading environment.

            - Trading Platforms:
              Evaluate available platforms (MT4, MT5, cTrader, proprietary), mobile/web access, key features, and algo-trading tools.

            - Best Promotions:
              List current promotional offers, bonuses, or loyalty programs available to traders.

            - User Experience:
              Discuss platform usability, customer support quality, education resources, mobile app functionality, and user feedback.

            - Summary and Rating Matrix:
              Provide a side-by-side comparative score matrix using a 0–100 scale across key areas (Regulation, Costs, Platform, Support, Overall).

            - Final Recommendation:
              Suggest which broker may be best for different trader types (beginners, scalpers, swing traders, etc.) based on the analysis.

            If certain requested data is missing from the source, state briefly that the field may need to be searched online.
            
            Disclaimer: This analysis was generated by AI based on available data and may not reflect the most current broker conditions. Please verify information directly with the brokers. Trading forex carries risk and may not be suitable for all investors. Always do your own due diligence before making financial decisions.

            Begin your analysis based on the following user request:
            ${cleaned.prompt}


        `;

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
              { role: 'user', content: data_prompt }
            ]
          })
        });

        const data = await response.json();
        message = data.choices?.[0]?.message?.content || '';
        if (message) break;

      } catch (err) {
        message = '';
      }
    }

    if (!message) {
      return res.status(500).json({ error: 'AI analysis failed. Please try again later.' });
    }

    return res.status(200).json({ result: message, usePrev: false });

  } catch (error: any) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
