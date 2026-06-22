import { useState } from "react";
import {
  AlertTriangle,
  MessageCircle,
  Send,
  Sparkles,
  Loader2,
} from "lucide-react";

// ==========================================
// Types & Schemas Alignment[span_12](start_span)[span_12](end_span)[span_13](start_span)[span_13](end_span)
// ==========================================

interface Message {
  role: "user" | "ai";
  content: string;
}

interface AdvisorInsight {
  title: string;
  description: string;
  severity: string;
}

interface AdvisorPanelProps {
  warnings?: string[];               // Maps to backend 'risks' string array[span_14](start_span)[span_14](end_span)
  recommendations?: AdvisorInsight[]; // Maps structurally to backend 'insights' schema[span_15](start_span)[span_15](end_span)[span_16](start_span)[span_16](end_span)
  activeContext?: Record<string, any> | null; // LIVE screen context (KPIs + simulated trend data)
}

// Simulated placeholder interface wrapper for the API layer
// Ensure your ../services/api.ts file accepts this second argument
declare function askAI(question: string, context?: Record<string, any> | null): Promise<{ answer: string }>;

export default function AdvisorPanel({
  warnings = [],
  recommendations = [],
  activeContext = null,
}: AdvisorPanelProps) {
  const safeWarnings = Array.isArray(warnings) ? warnings : [];
  const safeRecommendations = Array.isArray(recommendations) ? recommendations : [];

  // Chat Interface State Controls[span_17](start_span)[span_17](end_span)
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Send message pipeline[span_18](start_span)[span_18](end_span)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: question,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // FIX: Passing activeContext ensures context-aware responses even if sliders are modified
      const result = await askAI(question, activeContext);

      const aiMessage: Message = {
        role: "ai",
        content: result.answer, // Matches backend return {"answer": answer}[span_19](start_span)[span_19](end_span)
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Unable to contact AI CFO at the moment.",
        },
      ]);
    } finally {
      setQuestion("");
      setLoading(false);
    }
  }

  return (
    <div className="lg:w-80 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[600px] w-full">
      {/* Header Widget */}
      <div className="flex items-center gap-2 mb-3 shrink-0">
        <Sparkles className="w-4 h-4 text-purple-500" />
        <h3 className="text-sm font-bold text-slate-800">
          AI Financial Advisor
        </h3>
      </div>

      {/* Main Visual Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">

        {/* Warnings Loop[span_20](start_span)[span_20](end_span) */}
        {safeWarnings.length > 0 && (
          <div className="space-y-2">
            {safeWarnings.map((warning, i) => (
              <div
                key={i}
                className="flex gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{warning}</span>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations Loop[span_21](start_span)[span_21](end_span) */}
        {safeRecommendations.length > 0 && (
          <div>
            <h4 className="text-xs font-bold mb-3 text-slate-700 uppercase tracking-wider">Recommendations</h4>
            <div className="space-y-3">
              {safeRecommendations.map((rec, i) => (
                <div 
                  key={i} 
                  className={`border-l-2 pl-3 ${
                    rec.severity === "High" ? "border-red-500" : 
                    rec.severity === "Medium" ? "border-amber-500" : "border-blue-500"
                  }`}
                >
                  <h5 className="text-xs font-bold text-slate-800">
                    {rec.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Real-time Conversation View Area[span_22](start_span)[span_22](end_span) */}
        {messages.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-slate-100">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-xs p-2.5 rounded-lg max-w-[85%] leading-relaxed ${
                  msg.role === "user"
                    ? "ml-auto bg-blue-600 text-white rounded-br-none"
                    : "mr-auto bg-slate-100 text-slate-800 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Action Controls Footer[span_23](start_span)[span_23](end_span) */}
      <div className="mt-4 pt-4 border-t border-slate-100 shrink-0">
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition"
          >
            <MessageCircle className="w-4 h-4" />
            Ask AI CFO
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about cash flow, runway..."
              className="flex-1 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="bg-blue-600 text-white p-2 rounded-lg disabled:opacity-50 hover:bg-blue-700 transition"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
