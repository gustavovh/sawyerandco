import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

const SUGGESTIONS = [
  "How much home can I afford?",
  "What's the minimum credit score?",
  "Tell me about FHA loans",
  "What are today's rates?",
];

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
      const { data } = await api.post("/chat", { message: msg, history: [] });
      setMessages((m) => [...m, { from: "bot", text: data.reply }]);
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
