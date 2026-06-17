import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

interface TrendPoint {
  month?: string;
  date?: string;
  baseCase: number;
  stressScenario: number;
}

interface RunwayChartProps {
  chartData: TrendPoint[];
  baseDays?: number;
  stressDays?: number;
}

export default function RunwayChart({
  chartData = [],
  baseDays = 0,
  stressDays = 0,
}: RunwayChartProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm w-full">
      {/* HEADER */}
      <div className="mb-3">
        <h2 className="text-lg font-bold">Runway Analysis</h2>
        <p className="text-xs text-slate-500">
          Base Runway: {baseDays} days • Stress Runway: {stressDays} days
        </p>
      </div>

      {/* CHART */}
      <div className="h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Legend />

            {/* Base Case Cash Runway */}
            <Line
              type="monotone"
              dataKey="baseCase"
              stroke="#16a34a"
              strokeWidth={2}
              name="Base Case"
            />

            {/* Stress Scenario Cash Runway */}
            <Line
              type="monotone"
              dataKey="stressScenario"
              stroke="#dc2626"
              strokeWidth={2}
              name="Stress Scenario"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}