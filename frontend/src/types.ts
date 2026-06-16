export type Metric = {
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: string;
};

export type ScenarioInput = {
  inflation_rate: number;
  inventory_cost_increase: number;
  wage_increase: number;
  payment_terms_days: number;
  sales_growth_rate: number;
};

export type ScenarioSummary = {
  name: string;
  created_on: string;
  key_changes: string;
  cash_runway: string;
  risk_level: "Low" | "Medium" | "High";
};

export type RunwayPoint = {
  month: string;
  base_case: number;
  stress_case: number;
};

export type DashboardResponse = {
  welcome_name: string;
  metrics: Metric[];
  runway_data: RunwayPoint[];
  ai_warning: string;
  recommendations: string[];
  recent_scenarios: ScenarioSummary[];
};