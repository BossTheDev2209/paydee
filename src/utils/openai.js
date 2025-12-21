import OpenAI from "openai";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const openai = API_KEY ? new OpenAI({ 
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true // Essential for client-side API calls
}) : null;

/**
 * Analyzes financial data using OpenAI GPT-4o
 * @param {Object} data - Financial data object
 * @returns {Promise<Object>} - Parsed JSON with scores and insights
 */
export async function getFinancialInsight(data) {
  if (!openai) {
    throw new Error("OpenAI API Key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.");
  }

  const prompt = `You are a professional financial advisor. Analyze the following monthly financial data for a user in Thailand (all values in Baht):
  - Monthly Net Income: ${data.net_income_monthly}
  - Food: ${data.needs_food}
  - Housing: ${data.needs_housing}
  - Transportation: ${data.needs_transport}
  - Utilities: ${data.needs_utilities}
  - Insurance: ${data.needs_insurance}
  - Debt Payments: ${data.needs_debt}
  - Miscellaneous/Wants: ${data.wants_misc}

  Calculate:
  1. Health Score (0-100) based on financial stability.
  2. Percentage of Needs vs Wants vs Savings. (Needs = Food + Housing + Transport + Utilities + Insurance + Debt)
  3. Debt-to-income percentage.

  Return the result ONLY as a JSON object with this exact structure (use Thai language for the panel texts):
  {
    "numbers": {
      "health_score": number,
      "actual_needs_pct": number,
      "actual_savings_pct": number,
      "debt_to_income_pct": number
    },
    "panels": {
      "left_panel": "Summary of specific red flags or highlights in their spending (Short, Thai)",
      "middle_panel": "General assessment of their financial health (Short, Thai)",
      "right_panel": "Top 3 actionable recommendations for improvement (Short, Thai)"
    }
  }`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error("OpenAI Insight Error:", error);
    throw error;
  }
}
