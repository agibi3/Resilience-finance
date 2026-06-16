import React, {
useState
} from "react";

import {
AlertTriangle,
MessageCircle,
Send,
Sparkles,
Loader2
} from "lucide-react";

import {
askAI
} from "../services/api";

export default function AdvisorPanel({
warnings = [],
recommendations = []
}) {

const safeWarnings =
Array.isArray(warnings)
? warnings
: [];

const safeRecommendations =
Array.isArray(
recommendations
)
? recommendations
: [];

const [isChatOpen,
setIsChatOpen] =
useState(false);

const [question,
setQuestion] =
useState("");

const [answer,
setAnswer] =
useState("");

const [loading,
setLoading] =
useState(false);

async function handleSubmit(
e
) {

e.preventDefault();

if (
  !question.trim()
) {
  return;
}

try {

  setLoading(true);

  const result =
    await askAI(
      question
    );

  setAnswer(
    result.answer
  );

} catch (error) {

  console.error(
    error
  );

  setAnswer(
    "Unable to contact AI advisor."
  );

} finally {

  setLoading(false);

}

}

return (

<div
  className="
  w-full
  lg:w-80
  bg-white
  p-5
  rounded-xl
  border
  border-slate-200
  shadow-sm
  flex
  flex-col
"
>

  <div
    className="
    flex
    items-center
    gap-2
    mb-3
  "
  >

    <Sparkles
      className="
      w-4
      h-4
      text-purple-500
    "
    />

    <h3
      className="
      text-sm
      font-bold
      text-slate-800
    "
    >
      AI Financial Advisor
    </h3>

  </div>

  <div
    className="
    flex-1
    overflow-y-auto
    space-y-4
  "
  >

    {safeWarnings.map(
      (
        warning,
        index
      ) => (

        <div
          key={index}
          className="
          flex
          gap-2
          p-3
          bg-red-50
          border
          border-red-100
          rounded-lg
          text-xs
          text-red-700
        "
        >

          <AlertTriangle
            className="
            w-4
            h-4
            shrink-0
          "
          />

          <span>
            {warning}
          </span>

        </div>

      )
    )}

    <div>

      <h4
        className="
        text-xs
        font-bold
        mb-3
      "
      >
        Recommendations
      </h4>

      <div
        className="
        space-y-3
      "
      >

        {safeRecommendations.map(
          (
            rec,
            index
          ) => (

            <div
              key={index}
              className="
              border-l-2
              border-blue-500
              pl-3
            "
            >

              <h5
                className="
                text-xs
                font-bold
                text-slate-800
              "
              >
                {rec.title}
              </h5>

              <p
                className="
                text-[11px]
                text-slate-500
              "
              >
                {
                  rec.description
                }
              </p>

            </div>

          )
        )}

      </div>

    </div>

    {answer && (

      <div
        className="
        p-3
        rounded-lg
        bg-blue-50
        border
        border-blue-100
      "
      >

        <h4
          className="
          text-xs
          font-bold
          text-blue-700
          mb-2
        "
        >
          AI Response
        </h4>

        <p
          className="
          text-xs
          leading-relaxed
          text-slate-700
        "
        >
          {answer}
        </p>

      </div>

    )}

  </div>

  <div
    className="
    mt-4
    pt-4
    border-t
  "
  >

    {!isChatOpen ? (

      <button
        onClick={() =>
          setIsChatOpen(
            true
          )
        }
        className="
        w-full
        flex
        items-center
        justify-center
        gap-2
        py-2.5
        rounded-lg
        border
        hover:bg-slate-50
        text-xs
        font-bold
      "
      >

        <MessageCircle
          className="
          w-4
          h-4
        "
        />

        Ask AI CFO

      </button>

    ) : (

      <form
        onSubmit={
          handleSubmit
        }
        className="
        flex
        gap-2
      "
      >

        <input
          type="text"
          value={
            question
          }
          onChange={
            (e) =>
              setQuestion(
                e.target.value
              )
          }
          placeholder="
          Ask about cash flow,
          runway, expenses..."
          className="
          flex-1
          border
          rounded-lg
          p-2
          text-xs
          focus:outline-none
        "
        />

        <button
          type="submit"
          disabled={
            loading
          }
          className="
          bg-blue-600
          text-white
          p-2
          rounded-lg
        "
        >

          {loading ? (

            <Loader2
              className="
              w-4
              h-4
              animate-spin
            "
            />

          ) : (

            <Send
              className="
              w-4
              h-4
            "
            />

          )}

        </button>

      </form>

    )}

  </div>

</div>

);

}