import React, { useState } from 'react';
import { AlertTriangle, Lightbulb, MessageCircle, Send, Sparkles } from 'lucide-react';

export default function AdvisorPanel({ warnings = [], recommendations = [] }) {
  const safeWarnings = Array.isArray(warnings) ? warnings : [];
  const safeRecommendations = Array.isArray(recommendations) ? recommendations : [];
  
  // State for the AI Follow-up Chat
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    console.log("Sending query to AI:", chatInput);
    // Add your backend API call here later to actually process the chat
    
    setChatInput('');
    setIsChatOpen(false); // Close it after sending, or you can build a full chat log here
  };

  return (
    <div className="w-full lg:w-80 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-4 h-4 text-purple-500" />
        <h3 className="font-bold text-slate-800 text-sm">AI Financial Advisor</h3>
        <span className="text-slate-400 text-xs cursor-pointer ml-auto">ⓘ</span>
      </div>
      <p className="text-[11px] text-slate-500 mb-4">Automated insights and recommendations based on your scenario.</p>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-5">
        
        {/* Warnings Section */}
        {safeWarnings.length > 0 && (
          <div className="space-y-2">
            {safeWarnings.map((warning, index) => (
              <div key={index} className="flex gap-2.5 p-3 bg-red-50 border border-red-100 rounded-lg text-xs font-medium text-red-700 leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p>{warning}</p>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations Section */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 mb-3">Top Recommendations</h4>
          {safeRecommendations.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No recommendations available.</p>
          ) : (
            <div className="space-y-4">
              {safeRecommendations.map((rec, index) => (
                <div key={rec.id || index} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 mb-0.5">{rec.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interactive AI Chat Footer */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        {!isChatOpen ? (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-xs font-bold py-2.5 rounded-lg transition"
          >
            <MessageCircle className="w-4 h-4" />
            Ask Follow-up Question
          </button>
        ) : (
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input 
              type="text" 
              autoFocus
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about these metrics..." 
              className="flex-1 text-xs border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button 
              type="submit"
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
