const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Dispatches binary spreadsheet documents to the ingestion engine.
 * Maps directly to the backend's required 'file' and 'period' form data keys.
 */
export async function uploadFinancialFile(file: File, period: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("period", period);

  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Upload failed");
  }

  return response.json();
}

/**
 * Transmits microeconomic parameters to the forecasting engine to evaluate cash flow metrics.
 */
export async function runSimulation(payload: Record<string, unknown>) {
  const response = await fetch(`${API_BASE_URL}/api/simulate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to run simulation");
  }
  return response.json();
}

/**
 * Retrieves the full execution logs and history of simulated scenario tracks.
 */
export async function getScenarios() {
  const response = await fetch(`${API_BASE_URL}/api/scenarios`);
  if (!response.ok) throw new Error("Failed to fetch scenarios");
  return response.json();
}

/**
 * Fetches computed historical analytical vectors for line graphs.
 */
export async function getTrends() {
  const response = await fetch(`${API_BASE_URL}/api/trends`);
  if (!response.ok) throw new Error("Failed to fetch trends");
  return response.json();
}

/**
 * Pulls summary assets and core capitalization runway profiles.
 */
export async function getCashSummary() {
  const response = await fetch(`${API_BASE_URL}/api/cash-summary`);
  if (!response.ok) throw new Error("Failed to fetch cash summary");
  return response.json();
}

/**
 * Interacts with the AI CFO chat infrastructure.
 * Supports optional dashboard metadata context payloads to allow for completely targeted analysis.
 */
export async function askAI(question: string, context?: Record<string, any> | null) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      question,
      context: context || null
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to get AI response");
  }
  return response.json();
}
