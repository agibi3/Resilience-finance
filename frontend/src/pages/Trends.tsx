import React from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

export default function Trends({
  data = []
}) {

  return (

    <div
      className="
      bg-white
      p-6
      rounded-xl
      border
      shadow-sm
      "
    >

      <h2
        className="
        text-lg
        font-bold
        mb-5
      "
      >
        Financial Trends
      </h2>

      <div
        className="
        h-[500px]
      "
      >

        <ResponsiveContainer>

          <LineChart
            data={data}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="date"
            />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line
              type="monotone"
              dataKey="cash"
              stroke="#2563eb"
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#16a34a"
            />

            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#dc2626"
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}