import React from "react";

export default function CashSummary({
  summary
}) {

  if (!summary) {

    return (
      <div
        className="
        bg-white
        p-6
        rounded-xl
        border
        "
      >
        No data available
      </div>
    );

  }

  return (

    <div
      className="
      grid
      md:grid-cols-4
      gap-4
      "
    >

      <div
        className="
        bg-white
        p-5
        rounded-xl
        border
        "
      >
        <h3>Cash</h3>
        <p
          className="
          text-2xl
          font-bold
          "
        >
          $
          {summary.cash?.toLocaleString()}
        </p>
      </div>

      <div
        className="
        bg-white
        p-5
        rounded-xl
        border
        "
      >
        <h3>Revenue</h3>
        <p
          className="
          text-2xl
          font-bold
          "
        >
          $
          {summary.revenue?.toLocaleString()}
        </p>
      </div>

      <div
        className="
        bg-white
        p-5
        rounded-xl
        border
        "
      >
        <h3>Expenses</h3>
        <p
          className="
          text-2xl
          font-bold
          "
        >
          $
          {summary.expenses?.toLocaleString()}
        </p>
      </div>

      <div
        className="
        bg-white
        p-5
        rounded-xl
        border
        "
      >
        <h3>Net Income</h3>
        <p
          className="
          text-2xl
          font-bold
          "
        >
          $
          {summary.net_income?.toLocaleString()}
        </p>
      </div>

    </div>

  );

}