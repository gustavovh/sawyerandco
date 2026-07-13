import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "How much home can I afford?",
  "What's the minimum credit score?",
  "Tell me about FHA loans",
  "What are today's rates?",
];

const CANNED_RESPONSES = {
  afford: "Great question! Affordability depends on your income, debts, down payment, and credit. As a rule of thumb, lenders allow housing costs up to ~28% of your gross monthly income. Try our calculator above for a personalized estimate.",
  credit: "Most conventional loans require a 620+ credit score, FHA loans go as low as 580 (or 500 with 10% down), and VA loans have flexible guidelines. Higher scores unlock better rates.",
  down: "Down payment requirements: Conventional 3-5%, FHA 3.5%, VA & USDA 0%. Putting 20% down avoids private mortgage insurance (PMI).",
  fha: "FHA loans are government-insured mortgages ideal for first-time buyers. Minimum 3.5% down with 580+ credit score. Loan limits vary by county.",
  va: "VA loans are available to eligible veterans, active service members, and surviving spouses. 0% down payment, no PMI, and competitive rates.",
  rate: "Today's average 30-year fixed rates range from 6.25% to 7.5% depending on credit profile and loan program. We'll match you with the best rate from our lender network.",
  prequal: "Pre-qualification takes about 60 seconds and uses a soft credit pull — no impact to your score. Click 'Get Pre-Qualified' to start.",
  next: "Next steps: 1) Use our calculator for a budget. 2) Submit your info to get matched with a licensed loan officer. 3) Get a personalized rate quote. 4) Apply when you're ready.",
  default: "I'm your mortgage assistant. Ask me anything about loan programs, credit scores, down payments, rates, or how to qualify. (Note: this is a demo assistant with sample responses.)"
};

function getResponse(text) {
  const lower = text.toLowerCase();
  if (["afford", "how much", "budget", "price"].some(k => lower.includes(k))) return CANNED_RESPONSES.afford;
  if (["credit", "score", "fico"].some(k => lower.includes(k))) return CANNED_RESPONSES.credit;
  if (["down payment", "downpayment", "down"].some(k => lower.includes(k))) return CANNED_RESPONSES.down;
  if (lower.includes("fha")) return CANNED_RESPONSES.fha;
  if (lower.includes("va")) return CANNED_RESPONSES.va;
  if (lower.includes("rate") || lower.includes("interest")) return CANNED_RESPONSES.rate;
  if (["pre-qual", "prequal", "qualify", "pre approval"].some(k => lower.includes(k))) return CANNED_RESPONSES.prequal;
  if (["next", "step", "what now"].some(k => lower.includes(k))) return CANNED_RESPONSES.next;
  return CANNED_RESPONSES.default;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm your AI mortgage assistant. Ask me anything about affordability, loan programs, credit, or next steps." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setInput("");
    setMessages((m) => [...m, { from: "user", text: msg }]);
    setBusy(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const reply = getResponse(msg);
      setMessages((m) => [...m, { from: "bot", text: reply }]);
    } catch {
      setMessages((m) => [...m, { from: "bot", text: "Sorry, I'm having trouble right now. Try again in a moment." }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        data-testid="chatbot-toggle"
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-[#0066FF] text-white shadow-2xl hover:scale-105 transition-transform flex items-center justify-center"
        aria-label="Open chat"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 left-6 z-50 w-[calc(100%-3rem)] sm:w-96 h-[560px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden" data-testid="chatbot-window">
          <div className="bg-[#0F2557] text-white p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0066FF] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="font-heading font-semibold text-sm">Mortgage Assistant</p>
              <p className="text-[11px] text-blue-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online · Demo mode
              </p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-2.5 text-sm ${m.from === "user" ? "chat-bubble-user" : "chat-bubble-bot"}`} data-testid={`chat-msg-${m.from}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="chat-bubble-bot px-4 py-3 inline-flex gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {messages.length <= 2 && (
            <div className="px-3 py-2 border-t border-gray-100 flex flex-wrap gap-1.5 bg-white">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="text-[11px] px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-slate-700 transition-colors" data-testid="chat-suggestion">
                  {s}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="p-3 border-t border-gray-100 flex gap-2 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#0066FF] text-sm"
              data-testid="chat-input"
            />
            <button type="submit" disabled={busy || !input.trim()} className="btn-primary !px-4 !py-2 disabled:opacity-50" data-testid="chat-send">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
