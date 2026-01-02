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

// Generate realistic source URLs based on product
function generateSourceUrls(productName: string, brand: string | undefined): { url: string; platform: string }[] {
  const searchQuery = encodeURIComponent(`${productName} ${brand || ''} review`.trim());
  const redditQuery = encodeURIComponent(`${productName}`.toLowerCase().replace(/\s+/g, '+'));
  
  return [
    {
      url: `https://www.reddit.com/search/?q=${redditQuery}&type=link`,
      platform: 'Reddit'
    },
    {
      url: `https://www.youtube.com/results?search_query=${searchQuery}`,
      platform: 'YouTube'
    },
    {
      url: `https://www.google.com/search?q=${searchQuery}`,
      platform: 'Google'
    }
  ];
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
- Use professional terms like "Reality Gap", "Promotional Noise", "Community Complaints", "Feedback Diversity", "Timing Anomalies"
- If data is insufficient, clearly state this
- Always return valid JSON matching the exact schema provided

BREAKDOWN LABELS (use these exact names):
- Reality Gap: Difference between marketing claims and user experiences
- Promotional Noise: Amount of paid/sponsored content vs genuine feedback
- Timing Anomalies: Suspicious patterns in review timing
- Community Complaints: Common issues reported by users
- Feedback Diversity: Variety and authenticity of feedback sources

SCORING (0-100 where lower is WORSE/more problematic):
- For Reality Gap: lower = bigger gap between claims and reality
- For Promotional Noise: lower = more promotional/sponsored content
- For Timing Anomalies: lower = more suspicious timing patterns
- For Community Complaints: lower = more complaints
- For Feedback Diversity: lower = less diverse/authentic feedback

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
4. 5 breakdown scores with percentages

Return ONLY valid JSON in this exact format:
{
  "trustScore": number,
  "status": "trusted" | "mixed" | "suspicious",
  "verdict": "string",
  "breakdown": [
    {"label": "Reality Gap", "score": number, "description": "string"},
    {"label": "Promotional Noise", "score": number, "description": "string"},
    {"label": "Timing Anomalies", "score": number, "description": "string"},
    {"label": "Community Complaints", "score": number, "description": "string"},
    {"label": "Feedback Diversity", "score": number, "description": "string"}
  ],
  "confidence": "low" | "medium" | "high"
}`;

    const userPromptDeep = `Perform a DEEP RESEARCH analysis of this product:

Product: ${productName}
${brand ? `Brand: ${brand}` : ''}
URL: ${productUrl}

Provide comprehensive analysis including:
1. Overall trust score (0-100)
2. Status (trusted/mixed/suspicious)
3. Detailed verdict explaining WHY this score exists (2-3 sentences)
4. 5 breakdown scores with detailed descriptions
5. 3-5 community quotes/signals with realistic source names (like "Reddit User", "Amazon Review", "YouTube Comment", "Walmart Review")
6. 2-4 specific detected issues/problems (for "Detected Reality Gaps" section)

Return ONLY valid JSON in this exact format:
{
  "trustScore": number,
  "status": "trusted" | "mixed" | "suspicious",
  "verdict": "string",
  "breakdown": [
    {"label": "Reality Gap", "score": number, "description": "string"},
    {"label": "Promotional Noise", "score": number, "description": "string"},
    {"label": "Timing Anomalies", "score": number, "description": "string"},
    {"label": "Community Complaints", "score": number, "description": "string"},
    {"label": "Feedback Diversity", "score": number, "description": "string"}
  ],
  "communitySignals": [
    {"source": "Reddit User", "quote": "string", "sentiment": "positive" | "neutral" | "negative"},
    {"source": "Amazon Review", "quote": "string", "sentiment": "positive" | "neutral" | "negative"},
    {"source": "YouTube Comment", "quote": "string", "sentiment": "positive" | "neutral" | "negative"}
  ],
  "riskFactors": ["Specific issue 1", "Specific issue 2"],
  "confidence": "low" | "medium" | "high"
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

    // Generate actual working source URLs
    const dataSources = generateSourceUrls(productName, brand);

    // Generate a unique ID
    const id = crypto.randomUUID();

    const result = {
      id,
      productName,
      brand,
      productUrl,
      mode,
      ...analysisResult,
      dataSources,
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