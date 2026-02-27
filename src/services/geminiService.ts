import { GoogleGenAI } from "@google/genai";
import { SkillZone, AssessmentResult } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateSkillReport(result: AssessmentResult): Promise<string> {
  const sortedZones = Object.entries(result.scores)
    .sort(([, a], [, b]) => b - a)
    .map(([zone]) => zone as SkillZone);

  const top3 = sortedZones.slice(0, 3);
  const hiddenStrength = sortedZones[3];

  const prompt = `
    You are SoulGrow Skill Diagnostic AI. You write results in a warm, confident, psychologically intelligent tone. 
    No medical claims. No exaggerated spirituality. Ground everything in the user’s evidence. 
    Give practical, specific next steps.

    User Profile:
    - Name: ${result.name}
    - Age Band: ${result.ageBand}
    - Role Category: ${result.roleCategory}
    - Primary Goal: ${result.primaryGoal}
    - Personality Type (16P): ${result.personalityType || "Not provided"}
    
    Skill Assessment Data:
    - Top 3 Zones: ${top3.join(", ")}
    - Hidden Strength: ${hiddenStrength}
    - Flow State (MCQs): ${JSON.stringify(result.evidenceMCQs)}
    - Flow State (Reflective): "${result.evidenceReflective}"
    - Blockers (MCQs): ${JSON.stringify(result.constraintMCQs)}
    - Blockers (Reflective): "${result.constraintReflective}"
    - Full Scores: ${JSON.stringify(result.scores)}

    Brand Zone Definitions:
    - The Architect: Structure, frameworks, clarity, decision systems.
    - The Oracle: Intuition, insight, pattern-reading, energy intelligence.
    - The Alchemist: Transformation work, healing, mindset shifts, integration.
    - The Artist: Visual intelligence, aesthetics, storytelling, creation.
    - The Amplifier: Visibility, communication, teaching, community leadership.
    - The Operator: Execution, consistency, systems, follow-through.

    Please generate a report with the following structure:
    1. **Your Skill Stack (Top 3)**: Explain how these three work together uniquely for ${result.name}.
    2. **What this looks like in real life**: Describe the patterns of behavior and impact.
    3. **Your hidden strength**: Explain why ${hiddenStrength} is their unused superpower.
    4. **Best-fit roles / offers (3)**: Suggest 3 specific monetizable directions or services.
    5. **Your growth edge**: What should they stop doing or start addressing?
    6. **Tomorrow’s actions (3 steps)**: Very specific, small actions.
    7. **1 mantra + 1 micro-ritual**: On-brand for SoulGrow.

    Keep the tone warm, no-fluff, and diagnostic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Using a reliable model
      contents: [{ parts: [{ text: prompt }] }],
    });

    return response.text || "Failed to generate report.";
  } catch (error) {
    console.error("Error generating report:", error);
    return "An error occurred while generating your personalized report. Please try again.";
  }
}
