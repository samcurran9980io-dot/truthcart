import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  productName: string;
  brand?: string;
  productUrl: string;
  mode: 'fast' | 'deep';
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    const { productName, brand, productUrl, mode } = await req.json() as AnalysisRequest;

    console.log(`Analyzing product: ${productName}, mode: ${mode}`);

    const systemPrompt = `You are TruthCart, a neutral and professional product trust analyzer. Your role is to analyze products based on community sentiment and provide objective trust assessments.

IMPORTANT GUIDELINES:
- Be conservative and neutral in your assessments
- Never use words like "fake reviews", "scam", "fraud"
- Use professional terms like "Reality Gap", "Promotional Bias", "Community Signal Strength"
- If data is insufficient, clearly state this
- Always return valid JSON matching the exact schema provided

SCORING CRITERIA:
- Trust Score (0-100): Overall product trustworthiness
- Promotional Bias (0-100): How much marketing noise vs genuine feedback. Higher = less bias
- Reality Gap (0-100): Alignment between marketing claims and real experiences. Higher = better alignment
- Community Integrity (0-100): Quality and authenticity of community discussions. Higher = more authentic
- Long-term Reliability (0-100): Indicators of lasting quality. Higher = more reliable

STATUS THRESHOLDS:
- 70-100: "trusted"
- 40-69: "mixed"  
- 0-39: "suspicious"`;

    const userPromptFast = `Analyze this product for trust signals:

Product: ${productName}
${brand ? `Brand: ${brand}` : ''}
URL: ${productUrl}

Provide a FAST analysis with:
1. Overall trust score (0-100)
2. Status (trusted/mixed/suspicious)
3. Brief verdict (1-2 sentences)
4. 4 breakdown scores with short descriptions

Return ONLY valid JSON in this exact format:
{
  "trustScore": number,
  "status": "trusted" | "mixed" | "suspicious",
  "verdict": "string",
  "breakdown": [
    {"label": "Promotional Bias", "score": number, "description": "string"},
    {"label": "Reality Gap", "score": number, "description": "string"},
    {"label": "Community Integrity", "score": number, "description": "string"},
    {"label": "Long-term Reliability", "score": number, "description": "string"}
  ]
}`;

    const userPromptDeep = `Perform a DEEP RESEARCH analysis of this product:

Product: ${productName}
${brand ? `Brand: ${brand}` : ''}
URL: ${productUrl}

Provide comprehensive analysis including:
1. Overall trust score (0-100)
2. Status (trusted/mixed/suspicious)
3. Detailed verdict explaining WHY this score exists (2-3 sentences)
4. 4 breakdown scores with detailed descriptions
5. 3-5 community quotes/signals with sources
6. 2-4 potential risk factors to consider

Return ONLY valid JSON in this exact format:
{
  "trustScore": number,
  "status": "trusted" | "mixed" | "suspicious",
  "verdict": "string",
  "breakdown": [
    {"label": "Promotional Bias", "score": number, "description": "string"},
    {"label": "Reality Gap", "score": number, "description": "string"},
    {"label": "Community Integrity", "score": number, "description": "string"},
    {"label": "Long-term Reliability", "score": number, "description": "string"}
  ],
  "communitySignals": [
    {"source": "string", "quote": "string", "sentiment": "positive" | "neutral" | "negative"}
  ],
  "riskFactors": ["string"]
}`;

    const model = mode === 'fast' ? 'gpt-4o-mini' : 'gpt-4o';
    const userPrompt = mode === 'fast' ? userPromptFast : userPromptDeep;

    console.log(`Using model: ${model}`);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: mode === 'fast' ? 800 : 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    console.log('Raw AI response:', content);

    // Parse the JSON from the response
    let analysisResult;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      const jsonString = jsonMatch[1].trim();
      analysisResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Failed to parse AI response');
    }

    // Generate a unique ID
    const id = crypto.randomUUID();

    const result = {
      id,
      productName,
      brand,
      productUrl,
      mode,
      ...analysisResult,
      analyzedAt: new Date().toISOString(),
    };

    console.log('Analysis complete:', result.trustScore, result.status);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-product function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
