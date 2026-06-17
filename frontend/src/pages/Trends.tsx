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

interface TrendsProps {
  data?: Record<string, any>[];
  metrics?: string[];
}

const COLORS = [
  "#2563eb", // blue-600
  "#16a34a", // green-600
  "#dc2626", // red-600
  "#9333ea", // purple-600
  "#ea580c", // orange-600
  "#0891b2", // cyan-600
];

export default function Trends({ data = [], metrics = [] }: TrendsProps) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-bold text-slate-800">Financial Trends</h2>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
          AI Generated Trend Analysis
        </span>
      </div>

      {/* Chart Wrapper */}
      <div className="h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="period" 
              stroke="#94a3b8" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            
            {metrics.map((metric, index) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
