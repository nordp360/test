import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { generateLegalAssistance } from "../services/geminiService";
import {
  Send,
  Bot,
  User,
  Loader2,
  FileText,
  AlertTriangle,
  Scale,
  BookOpen,
  Shield,
  PenTool,
} from "lucide-react";
import { ChatMessage } from "../types";

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Dzień dobry. Jestem Twoim wirtualnym asystentem prawnym. W czym mogę Ci pomóc? Wybierz jeden z tematów poniżej lub wpisz własne zapytanie.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const initialSearchHandled = useRef(false);
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string>("default");

  useEffect(() => {
    if (user?.id) {
      setSessionId(user.id);
    } else {
      let guestId = sessionStorage.getItem("guest_session_id");
      if (!guestId) {
        guestId = `guest-${Math.random().toString(36).substring(2, 15)}`;
        sessionStorage.setItem("guest_session_id", guestId);
      }
      setSessionId(guestId);
    }
  }, [user]);

  const suggestions = [
    {
      icon: <FileText className="w-5 h-5 text-blue-500" />,
      title: "Wezwanie do zapłaty",
      prompt:
        "Przygotuj wzór wezwania do zapłaty dla dłużnika, który nie opłacił faktury w terminie.",
    },
    {
      icon: <Scale className="w-5 h-5 text-purple-500" />,
      title: "Pozew o rozwód",
      prompt: "Napisz wstępny szkic pozwu o rozwód bez orzekania o winie.",
    },
    {
      icon: <BookOpen className="w-5 h-5 text-green-500" />,
      title: "Procedura spadkowa",
      prompt:
        "Wyjaśnij krok po kroku, co dzieje się po złożeniu wniosku o stwierdzenie nabycia spadku.",
    },
    {
      icon: <Shield className="w-5 h-5 text-orange-500" />,
      title: "Regulamin i RODO",
      prompt:
        "Przygotuj szkic prostego regulaminu serwisu oraz polityki prywatności.",
    },
    {
      icon: <PenTool className="w-5 h-5 text-red-500" />,
      title: "Artykuł na bloga",
      prompt:
        "Napisz szkic artykułu SEO na temat: 'Jak bezpiecznie wynająć mieszkanie?'.",
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = useCallback(
    async (customInput?: string) => {
      const textToSend = typeof customInput === "string" ? customInput : input;
      if (!textToSend.trim() || isLoading) return;

      const userMessage: ChatMessage = { role: "user", text: textToSend };
      setMessages((prev) => [...prev, userMessage]);
      if (!customInput) setInput("");
      setIsLoading(true);

      try {
        const responseText = await generateLegalAssistance(
          textToSend,
          sessionId,
        );

        setMessages((prev) => [...prev, { role: "model", text: responseText }]);

        if (responseText.includes("Wersja demonstracyjna")) {
          // We could add a toast here, but the message is clear enough.
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            text: "Przepraszamy, wystąpił błąd komunikacji z serwerem.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, sessionId],
  );

  useEffect(() => {
    if (initialSearchHandled.current) return;

    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    if (query) {
      initialSearchHandled.current = true;
      handleSend(query);
    }
  }, [location.search, handleSend]);

  const handleSuggestionClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-64px)] flex flex-col gap-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle
              className="h-5 w-5 text-yellow-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong className="font-medium">Ważna informacja:</strong>{" "}
              Asystent AI służy jedynie do generowania wstępnych szkiców i
              informacji. Wygenerowane treści nie stanowią porady prawnej w
              rozumieniu przepisów i powinny zostać zweryfikowane przez radcę
              prawnego lub adwokata.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 flex flex-col">
        {/* Chat Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-full">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">LexAssistant AI</h2>
            <p className="text-slate-400 text-xs">Powered by Gemini 3 Flash</p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-blue-600" : "bg-slate-700"}`}
                >
                  {msg.role === "user" ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div
                  className={`p-4 rounded-2xl shadow-sm text-sm whitespace-pre-wrap leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white text-slate-800 rounded-tl-none border border-slate-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}

          {/* Suggestions - only show if there is only 1 message (the welcome message) */}
          {messages.length === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4 px-2">
              {suggestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(item.prompt)}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all text-left group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                      {item.icon}
                    </div>
                    <span className="font-semibold text-slate-700 group-hover:text-blue-700">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {item.prompt}
                  </p>
                </button>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center gap-2 text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analizuję przepisy...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="flex gap-2 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Opisz sprawę lub wybierz temat powyżej..."
              className="w-full resize-none border border-slate-300 rounded-lg pl-4 pr-12 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[60px] max-h-[120px]"
              rows={2}
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="absolute right-3 bottom-3 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center mt-2">
            <p className="text-xs text-slate-400">
              Model AI może popełniać błędy. Sprawdź ważne informacje.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
