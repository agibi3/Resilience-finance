const API_BASE_URL =
    "https://resilience-finance-backend.onrender.com";
    
export async function uploadFinancialFile(file) {
    const formData = new FormData();
    
    formData.append("file", file);
    
    const response = await fetch(
    `${API_BASE_URL}/api/upload`,
    {
    method: "POST",
    body: formData,
    }
    );
    
    if (!response.ok) {
    throw new Error("Upload failed");
    }
    
    return response.json();
    }
    
export async function runSimulation(payload) {
    const response = await fetch(
    `${API_BASE_URL}/api/simulate`,
    {
    method: "POST",
    headers: {
    "Content-Type":
    "application/json",
    },
    body: JSON.stringify(payload),
    }
    );
    
    return response.json();
    }
    
export async function getScenarios() {
    const response = await fetch(
    `${API_BASE_URL}/api/scenarios`
    );
    
    return response.json();
    }
    
export async function getTrends() {
    const response = await fetch(
    `${API_BASE_URL}/api/trends`
    );
    
    return response.json();
    }
    
export async function getCashSummary() {
    const response = await fetch(
    `${API_BASE_URL}/api/cash-summary`
    );
    
    return response.json();
    }
    
export async function askAI(question) {
    const response = await fetch(
    `${API_BASE_URL}/api/chat`,
    {
    method: "POST",
    headers: {
    "Content-Type":
    "application/json",
    },
    body: JSON.stringify({
    question,
    }),
    }
    );
    
    return response.json();
    }