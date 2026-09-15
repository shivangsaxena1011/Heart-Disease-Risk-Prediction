import { PredictionResult, StoredAssessment } from "./types";

const HISTORY_KEY = "heartguard_history";
const CURRENT_RESULT_KEY = "heartguard_current_result";

export function saveAssessment(result: PredictionResult): void {
  if (typeof window === "undefined") return;

  try {
    const storedItem: StoredAssessment = {
      id: result.assessment_id,
      date: result.timestamp,
      riskLevel: result.risk_classification.level,
      riskPercentage: result.risk_percentage,
      result: result,
    };

    const existing = getAssessments();
    // Prepend and limit to recent 10 assessments
    const updated = [storedItem, ...existing.filter((item) => item.id !== result.assessment_id)].slice(0, 10);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    localStorage.setItem(CURRENT_RESULT_KEY, JSON.stringify(result));
  } catch (err) {
    console.error("Failed to save assessment to localStorage:", err);
  }
}

export function getAssessments(): StoredAssessment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getAssessmentById(id: string): StoredAssessment | null {
  const all = getAssessments();
  return all.find((item) => item.id === id) || null;
}

export function getCurrentResult(): PredictionResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CURRENT_RESULT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentResult(result: PredictionResult): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CURRENT_RESULT_KEY, JSON.stringify(result));
  } catch (err) {
    console.error("Failed to set current result:", err);
  }
}

export function clearAssessments(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(CURRENT_RESULT_KEY);
  } catch (err) {
    console.error("Failed to clear assessments:", err);
  }
}
