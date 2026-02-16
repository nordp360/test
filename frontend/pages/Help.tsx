import React, { useState } from "react";
import {
  HelpCircle,
  Phone,
  Mail,
  MessageSquare,
  ChevronDown,
  Send,
  CheckCircle,
  FileText,
  Shield,
  ExternalLink,
  Globe,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Help: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "Pomoc techniczna",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState<number>(0);

  const faqs = [
    {
      q: "Jak założyć sprawę w systemie?",
      a: 'Po zalogowaniu do Panelu Klienta, kliknij przycisk "Nowa Sprawa" w zakładce "Moje Sprawy". Opisz krótko swój problem, a nasz system przypisze Ci odpowiedniego opiekuna prawnego.',
    },
    {
      q: "Czy moje dane są bezpieczne?",
      a: "Tak. Stosujemy zaawansowane szyfrowanie AES-256 oraz protokoły SSL. Wszystkie dokumenty są przechowywane zgodnie z RODO i podlegają tajemnicy zawodowej.",
    },
    {
      q: "Ile kosztuje porada prawna?",
      a: "Cena zależy od stopnia skomplikowania sprawy. Podstawowe konsultacje AI są w pakiecie, natomiast usługi mecenasa są wyceniane indywidualnie po wstępnej analizie.",
    },
    {
      q: "Jak mogę pobrać fakturę?",
      a: 'Wszystkie faktury i dokumenty rozliczeniowe znajdują się w zakładce "Płatności" w Twoim profilu.',
    },
    {
      q: "Czy mogę zrezygnować z usługi?",
      a: 'Tak, masz prawo do rezygnacji zgodnie z regulaminem. Szczegóły znajdziesz w sekcji "Regulamin" dostępnej w stopce strony.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulation of API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setTicketNumber(Math.floor(Math.random() * 10000));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header Section */}
      <div className="bg-slate-900 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-sans font-bold text-white mb-6">
            W czym możemy Ci pomóc?
          </h1>
          <p className="text-slate-300 text-lg mb-8">
            Nasz zespół wsparcia oraz baza wiedzy są do Twojej dyspozycji 24/7.
          </p>
          <div className="relative max-w-2xl mx-auto">
            <HelpCircle className="absolute left-4 top-3.5 text-slate-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Szukaj w bazie wiedzy (np. faktura, rozwód, profil)..."
              className="w-full bg-white border-none rounded-2xl py-4 pl-14 pr-4 text-slate-900 shadow-2xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column: Quick Contact & Links */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 text-xl mb-6 flex items-center gap-2">
                Szybki Kontakt
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Infolinia</p>
                    <p className="text-slate-500 text-sm">
                      Pn-Pt, 8:00 - 18:00
                    </p>
                    <p className="text-blue-600 font-bold mt-1">
                      +48 500 000 000
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-50 p-3 rounded-xl text-green-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">E-mail</p>
                    <p className="text-slate-500 text-sm">Odpowiadamy w 24h</p>
                    <p className="text-blue-600 font-bold mt-1">
                      pomoc@lexportal.pl
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-start gap-4 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors"
                  onClick={() => navigate("/assistant")}
                >
                  <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">
                      Asystent Prawny AI
                    </p>
                    <p className="text-slate-500 text-sm">
                      Pomoc w czasie rzeczywistym
                    </p>
                    <p className="text-blue-600 font-bold mt-1 flex items-center gap-1">
                      Uruchom czat <ExternalLink className="w-3 h-3" />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-600/5 p-8 rounded-2xl border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" /> Przydatne Linki
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-blue-700 hover:underline text-sm flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" /> Przewodnik po platformie
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-blue-700 hover:underline text-sm flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" /> Wzory dokumentów
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-blue-700 hover:underline text-sm flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" /> Polityka Prywatności
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: FAQ & Contact Form */}
          <div className="lg:col-span-2 space-y-12">
            {/* FAQ Section */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <HelpCircle className="w-7 h-7 text-amber-500" /> Często
                Zadawane Pytania
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full text-left p-5 flex justify-between items-center bg-white hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-bold text-slate-800">{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openFaq === i && (
                      <div className="p-5 pt-0 text-slate-600 text-sm leading-relaxed animate-in slide-in-from-top-2">
                        <div className="h-px bg-slate-100 mb-4" />
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Contact Form Section */}
            <section
              id="contact-form"
              className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-200"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Wyślij zgłoszenie
              </h2>
              <p className="text-slate-500 mb-8">
                Nie znalazłeś odpowiedzi? Napisz do nas bezpośrednio – nasz
                zespół przeanalizuje Twój problem.
              </p>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 p-8 rounded-xl text-center animate-in zoom-in-95">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-green-900 mb-2">
                    Zgłoszenie wysłane!
                  </h3>
                  <p className="text-green-700">
                    Otrzymaliśmy Twoją wiadomość. Numer zgłoszenia: #LX-
                    {ticketNumber}. <br /> Odpowiemy tak szybko jak to możliwe.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-green-700 font-bold border-b border-green-700 hover:text-green-800 transition-colors"
                  >
                    Wyślij kolejne zgłoszenie
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="grid md:grid-cols-2 gap-6"
                >
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                      Twoje Imię
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, name: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="np. Jan Kowalski"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                      Adres E-mail
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          email: e.target.value,
                        })
                      }
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                      Temat
                    </label>
                    <select
                      value={contactForm.subject}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          subject: e.target.value,
                        })
                      }
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                    >
                      <option>Pomoc techniczna</option>
                      <option>Pytanie o sprawę</option>
                      <option>Rozliczenia i płatności</option>
                      <option>Sugestie i opinie</option>
                      <option>Inne</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                      Wiadomość
                    </label>
                    <textarea
                      required
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          message: e.target.value,
                        })
                      }
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none h-40 resize-none transition-all"
                      placeholder="Opisz dokładnie swój problem lub pytanie..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          Wysyłanie...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" /> Wyślij wiadomość
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-slate-400 mt-4 text-center">
                      Wysyłając zgłoszenie akceptujesz naszą Politykę
                      Prywatności oraz zasady przetwarzania danych osobowych.
                    </p>
                  </div>
                </form>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
