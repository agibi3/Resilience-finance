const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function uploadFinancialFile(filee:any) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Upload failed");
  }

  return response.json();
}

export async function runSimulation(payload) {
  const response = await fetch(`${API_BASE_URL}/api/simulate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Failed to run simulation");
  return response.json();
}

export async function getScenarios() {
  const response = await fetch(`${API_BASE_URL}/api/scenarios`);
  if (!response.ok) throw new Error("Failed to fetch scenarios");
  return response.json();
}

export async function getTrends() {
  const response = await fetch(`${API_BASE_URL}/api/trends`);
  if (!response.ok) throw new Error("Failed to fetch trends");
  return response.json();
}

export async function getCashSummary() {
  const response = await fetch(`${API_BASE_URL}/api/cash-summary`);
  if (!response.ok) throw new Error("Failed to fetch cash summary");
  return response.json();
}

export async function askAI(question) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) throw new Error("Failed to get AI response");
  return response.json();
}
