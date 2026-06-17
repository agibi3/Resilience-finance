import { useState } from "react";
import {
  AlertTriangle,
  MessageCircle,
  Send,
  Sparkles,
  Loader2,
} from "lucide-react";
import { askAI } from "../services/api";

// ==========================================
// Types
// ==========================================

interface Message {
  role: "user" | "ai";
  content: string;
}

interface Recommendation {
  title: string;
  description: string;
}

interface AdvisorPanelProps {
  warnings?: string[];
  recommendations?: Recommendation[];
}

// ==========================================
// Component
// ==========================================

export default function AdvisorPanel({
  warnings = [],
  recommendations = [],
}: AdvisorPanelProps) {
  const safeWarnings = Array.isArray(warnings) ? warnings : [];
  const safeRecommendations = Array.isArray(recommendations)
    ? recommendations
    : [];

  // Chat state (NEW)
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // ==========================================
  // Send message
  // ==========================================

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: question,
    };

    // Add user message
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const result = await askAI(question);

      const aiMessage: Message = {
        role: "ai",
        content: result.answer,
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
      setLoading(false);
    }
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="lg:w-80 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-purple-500" />
        <h3 className="text-sm font-bold text-slate-800">
          AI Financial Advisor
        </h3>
      </div>

      {/* Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">

        {/* Warnings */}
        {safeWarnings.map((warning, i) => (
          <div
            key={i}
            className="flex gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700"
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{warning}</span>
          </div>
        ))}

        {/* Recommendations */}
        <div>
          <h4 className="text-xs font-bold mb-3">Recommendations</h4>
          <div className="space-y-3">
            {safeRecommendations.map((rec, i) => (
              <div key={i} className="border-l-2 border-blue-500 pl-3">
                <h5 className="text-xs font-bold text-slate-800">
                  {rec.title}
                </h5>
                <p className="text-[11px] text-slate-500">
                  {rec.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        {messages.length > 0 && (
          <div className="space-y-3 pt-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-xs p-2 rounded-lg max-w-[85%] ${
                  msg.role === "user"
                    ? "ml-auto bg-blue-600 text-white"
                    : "mr-auto bg-slate-100 text-slate-800"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="mt-4 pt-4 border-t">
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border hover:bg-slate-50 text-xs font-bold"
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
              className="flex-1 border rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="bg-blue-600 text-white p-2 rounded-lg disabled:opacity-50"
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