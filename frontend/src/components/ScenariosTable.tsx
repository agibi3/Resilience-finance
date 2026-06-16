import type { ScenarioSummary } from "../types";

export default function RecentScenariosTable({
  scenarios,
}: {
  scenarios: ScenarioSummary[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Recent Scenarios</h2>
      <p className="mt-1 text-sm text-slate-500">
        Your last saved scenario simulations.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="py-3 pr-4">Scenario Name</th>
              <th className="py-3 pr-4">Created On</th>
              <th className="py-3 pr-4">Key Changes</th>
              <th className="py-3 pr-4">Cash Runway</th>
              <th className="py-3 pr-4">Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((row) => (
              <tr key={row.name} className="border-t border-slate-100">
                <td className="py-4 pr-4 font-medium text-slate-900">{row.name}</td>
                <td className="py-4 pr-4 text-slate-600">{row.created_on}</td>
                <td className="py-4 pr-4 text-slate-600">{row.key_changes}</td>
                <td className="py-4 pr-4 font-semibold text-slate-900">{row.cash_runway}</td>
                <td className="py-4 pr-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      row.risk_level === "High"
                        ? "bg-red-100 text-red-700"
                        : row.risk_level === "Medium"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {row.risk_level}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}