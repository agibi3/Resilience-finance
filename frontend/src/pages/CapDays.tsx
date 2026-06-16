import React from "react";

export default function CapDays({
  metrics
}) {

  return (

    <div
      className="bg-white rounded-xl border shadow-sm p-10 text-center
      "
    >

      <h2
        className="
        text-xl
        font-bold
        mb-4
      "
      >
        Capital Runway
      </h2>

      <div
        className="
        text-7xl
        font-bold
        text-blue-600
        "
      >
        {
          metrics?.cash_runway_stress ||
          0
        }
      </div>

      <p
        className="
        mt-3
        text-slate-500
        "
      >
        Days Remaining Under Current Scenario
      </p>

      <div
        className="
        mt-8
        grid
        md:grid-cols-3
        gap-4
        "
      >

        <div
          className="
          border
          rounded-lg
          p-4
          "
        >
          <h4>
            Base Runway
          </h4>

          <p
            className="
            text-2xl
            font-bold
            "
          >
            {
              metrics?.cash_runway_base ||
              0
            }
            d
          </p>
        </div>

        <div
          className="
          border
          rounded-lg
          p-4
          "
        >
          <h4>
            Stress Runway
          </h4>

          <p
            className="
            text-2xl
            font-bold
            text-red-500
            "
          >
            {
              metrics?.cash_runway_stress ||
              0
            }
            d
          </p>
        </div>

        <div
          className="
          border
          rounded-lg
          p-4
          "
        >
          <h4>
            Risk
          </h4>

          <p
            className="
            text-2xl
            font-bold
            "
          >
            {
              metrics?.risk_level ||
              "Unknown"
            }
          </p>
        </div>

      </div>

    </div>

  );

}