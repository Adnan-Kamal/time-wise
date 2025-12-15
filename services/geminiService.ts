import { GoogleGenAI } from '@google/genai';
import { Activity, Goal } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDailyCoaching = async (
  activities: Activity[],
  totalMinutes: number,
  goals: Goal[] = [],
  recentContext: string = "No previous history available."
): Promise<string> => {
  if (activities.length === 0) {
    return "Please log some activities first so I can analyze your day!";
  }

  // Prepare the prompt data
  const activitySummary = activities.map(a => 
    `- ${a.name} (${a.category}): ${a.duration} minutes`
  ).join('\n');

  const goalSummary = goals.length > 0 
    ? goals.map(g => `- Goal: ${g.title} (${g.targetType} ${g.targetCategory || ''})`).join('\n')
    : "No specific goals set yet.";

  const prompt = `
    You are a highly perceptive time-management coach.
    
    CONTEXT:
    - User's Active Goals:
    ${goalSummary}
    
    - Recent History (Comparison Baseline):
    ${recentContext}
    
    - TODAY'S Log (Total: ${totalMinutes} mins):
    ${activitySummary}

    TASK:
    Analyze today's behavior compared to their goals and recent patterns.
    
    Provide exactly 4 sections in Markdown:
    
    1. **📊 Reality Check**: A brief, evaluative summary of how today compares to recent days (e.g., "You improved your study time compared to yesterday" or "Social media usage spiked today").
    2. **⚠️ Neglected Areas**: Explicitly identify any Goal categories that got 0 minutes or very little attention today.
    3. **💡 The Micro-Shift**: Propose ONE specific, realistic minute-swap for tomorrow. (e.g., "Shift 20 minutes from [Low Value Activity] to [Goal Activity] to hit your target."). Be specific with numbers.
    4. **✅ Action Plan**: 2 short bullet points for tomorrow.

    Keep it encouraging but objective.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert time management coach. Be concise and precise.",
        temperature: 0.7,
      }
    });

    return response.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to connect to the productivity coach.");
  }
};

export const generateGoalAdvice = async (
  goal: Goal,
  activities: Activity[]
): Promise<string> => {
  // Summarize recent activity related to this goal's category if possible
  const relevantActivities = goal.targetCategory 
    ? activities.filter(a => a.category === goal.targetCategory)
    : activities;
    
  const activitySummary = relevantActivities.slice(0, 20).map(a => 
    `- ${a.name} (${a.category}): ${a.duration} mins on ${new Date(a.timestamp).toLocaleDateString()}`
  ).join('\n');

  const prompt = `
    The user has set a new goal: "${goal.title}".
    Description: "${goal.description || 'No description provided'}".
    Target: ${goal.targetType === 'MORE' ? 'Increase' : 'Decrease'} time spent${goal.targetCategory ? ` on ${goal.targetCategory}` : ''}.
    
    Here is a snapshot of their recent relevant activities:
    ${activitySummary.length > 0 ? activitySummary : "No recent relevant activities logged yet."}

    Based on this, provide 3 short, personalized, highly actionable steps they can take starting today to achieve this goal.
    Keep the advice punchy and motivating. Do not use generic advice.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a strategic habit coach. Provide concrete steps.",
        temperature: 0.7,
      }
    });

    return response.text || "Focus on consistency and small steps.";
  } catch (error) {
    console.error("Gemini Goal API Error:", error);
    return "Focus on small daily improvements.";
  }
};

export interface WeeklyAnalysisResult {
  reduce: string[];
  increase: string[];
}

export const generateWeeklyAnalysis = async (
  activities: Activity[],
  totalMinutes: number
): Promise<WeeklyAnalysisResult> => {
  const activitySummary = activities.map(a => 
    `- ${a.name} (${a.category}): ${a.duration} minutes`
  ).join('\n');

  const prompt = `
    Analyze this weekly activity log (Total: ${totalMinutes} mins).
    
    Activities:
    ${activitySummary}

    Output a valid JSON object with exactly two arrays: "reduce" and "increase".
    - "reduce": List 2-3 specific activities or habits to cut down.
    - "increase": List 2-3 specific activities or categories to prioritize.
    
    Example format:
    {
      "reduce": ["Late night scrolling", "Excessive gaming"],
      "increase": ["Morning study sessions", "Exercise"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are a data analyst. Output JSON only.",
        temperature: 0.5,
      }
    });

    const text = response.text || "{}";
    // Clean potential markdown blocks just in case, though responseMimeType usually handles it
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText) as WeeklyAnalysisResult;
  } catch (error) {
    console.error("Gemini Weekly API Error:", error);
    throw new Error("Failed to analyze week.");
  }
};