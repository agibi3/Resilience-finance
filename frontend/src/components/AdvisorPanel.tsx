import { useState } from "react";
import {
  AlertTriangle,
  MessageCircle,
  Send,
  Sparkles,
  Loader2,
} from "lucide-react";

// FIX: Swapped out placeholder token declaration for explicit import from service asset layer
import { askAI } from "../services/api";

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
  warnings?: string[];               
  recommendations?: AdvisorInsight[]; 
  activeContext?: Record<string, any> | null; 
}

export default function AdvisorPanel({
  warnings = [],
  recommendations = [],
  activeContext = null,
}: AdvisorPanelProps) {
  const safeWarnings = Array.isArray(warnings) ? warnings : [];
  const safeRecommendations = Array.isArray(recommendations) ? recommendations : [];

  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

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
      const result = await askAI(question, activeContext);

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

        {/* Warnings Loop */}
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

        {/* Recommendations Loop */}
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

        {/* Real-time Conversation View Area */}
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

      {/* Input Action Controls Footer */}
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
