import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Search,
  ArrowRight,
  ShieldCheck,
  FileText,
  Briefcase,
  UserPlus,
  LogIn,
  MessageSquareText,
} from "lucide-react";

type KBItem = {
  title: string;
  type: "termin" | "faq";
  category: string;
  content: string;
  keywords: string[];
};

const KnowledgeBase: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get("q") ?? "").trim();
  }, [location.search]);

  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const items: KBItem[] = useMemo(
    () => [
      {
        type: "termin",
        category: "Postępowanie cywilne",
        title: "Nakaz zapłaty",
        content:
          "Nakaz zapłaty to orzeczenie sądu wydane w uproszczonym trybie. Kluczowe jest dochowanie terminów (np. na sprzeciw) oraz ocena, czy roszczenie jest zasadne i prawidłowo udokumentowane.",
        keywords: ["nakaz", "zapłaty", "sprzeciw", "e-sąd", "ePUAP"],
      },
      {
        type: "termin",
        category: "Egzekucja komornicza",
        title: "Tytuł wykonawczy",
        content:
          "Tytuł wykonawczy to tytuł egzekucyjny (np. wyrok, nakaz zapłaty) zaopatrzony w klauzulę wykonalności. Bez tytułu wykonawczego egzekucja co do zasady nie powinna być prowadzona.",
        keywords: ["tytuł", "wykonawczy", "klauzula", "egzekucja", "komornik"],
      },
      {
        type: "termin",
        category: "Postępowanie cywilne",
        title: "Sprzeciw od nakazu zapłaty",
        content:
          "Sprzeciw to pismo procesowe, które powoduje utratę mocy nakazu zapłaty i przejście sprawy do zwykłego trybu. Decyduje termin, forma oraz właściwe zarzuty i wnioski dowodowe.",
        keywords: ["sprzeciw", "nakaz", "termin", "zarzuty", "dowody"],
      },
      {
        type: "termin",
        category: "Postępowanie cywilne",
        title: "Pozew i odpowiedź na pozew",
        content:
          "Pozew inicjuje sprawę cywilną. Odpowiedź na pozew to Twoja kluczowa szansa na uporządkowanie stanowiska, zgłoszenie zarzutów oraz dowodów. W praktyce jakość odpowiedzi na pozew wpływa na cały przebieg sprawy.",
        keywords: ["pozew", "odpowiedź", "zarzuty", "dowody", "strategia"],
      },
      {
        type: "termin",
        category: "Przedsądowe",
        title: "Wezwanie do zapłaty i upomnienie przedsądowe",
        content:
          "Wezwanie do zapłaty (upomnienie przedsądowe) porządkuje roszczenie i często otwiera drogę do negocjacji. Warto ocenić podstawę prawną, wysokość żądania i ryzyko dalszych kroków (pozew, koszty).",
        keywords: ["wezwanie", "zapłaty", "upomnienie", "negocjacje", "ugoda"],
      },
      {
        type: "faq",
        category: "Najczęstsze pytania",
        title: "Czy analiza to porada prawna?",
        content:
          "Analiza dokumentu to profesjonalne omówienie treści pisma i możliwych scenariuszy działania. Finalną decyzję zawsze podejmujesz Ty, a w sprawach procesowych rekomendujemy konsultację z prawnikiem prowadzącym.",
        keywords: ["porada", "analiza", "odpowiedzialność", "konsultacja"],
      },
      {
        type: "faq",
        category: "Najczęstsze pytania",
        title: "Jak szybko otrzymam wynik?",
        content:
          "Standardowo większość analiz realizujemy w 12–48 godzin. Dla pilnych spraw dostępny jest wariant Express (6h), aby zminimalizować ryzyko przekroczenia terminów procesowych.",
        keywords: ["czas", "termin", "express", "6h", "24h", "48h"],
      },
      {
        type: "faq",
        category: "Bezpieczeństwo",
        title: "Czy moje dokumenty są bezpieczne?",
        content:
          "Stosujemy dobre praktyki bezpieczeństwa: szyfrowanie transmisji, kontrolę dostępu oraz minimalizację danych. Dokumenty i dane są wykorzystywane wyłącznie do realizacji usługi.",
        keywords: ["bezpieczeństwo", "RODO", "poufność", "szyfrowanie"],
      },
      {
        type: "faq",
        category: "Proces",
        title: "Jak przygotować dokument do analizy?",
        content:
          "Wystarczy skan/zdjęcie w PDF/JPG/PNG oraz krótki opis sytuacji. Jeśli masz kilka pism, dołącz wszystkie – często kontekst (np. korespondencja) wpływa na rekomendowane działania.",
        keywords: ["pdf", "jpg", "png", "opis", "kontekst"],
      },
    ],
    [],
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalizedQuery) return items;

    return items.filter((i) => {
      const haystack = [i.title, i.category, i.content, ...i.keywords]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [items, normalizedQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(
      q ? `/knowledge-base?q=${encodeURIComponent(q)}` : "/knowledge-base",
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-widest">
          <BookOpen className="w-4 h-4" /> Baza wiedzy
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-4">
          Terminy procesowe, pojęcia i FAQ
        </h1>
        <p className="text-slate-600 mt-3 max-w-3xl mx-auto">
          Klarowne wyjaśnienia najczęstszych zagadnień związanych z pismami
          procesowymi i postępowaniem. Jeśli sytuacja jest pilna (terminy),
          rekomendujemy skorzystanie z analizy dokumentu lub konsultacji z
          prawnikiem.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Szukaj: np. nakaz zapłaty, sprzeciw, komornik, pozew, termin..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
          >
            Szukaj w bazie
          </button>
          <Link
            to="/document-analysis"
            className="px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors text-center"
          >
            Zobacz ofertę analiz
          </Link>
        </div>
      </form>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Najczęściej wyszukiwane tematy
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "Nakaz zapłaty",
              "Sprzeciw",
              "Komornik",
              "Pozew",
              "Upomnienie przedsądowe",
              "Tytuł wykonawczy",
            ].map((t) => (
              <Link
                key={t}
                to={`/knowledge-base?q=${encodeURIComponent(t)}`}
                className="text-sm px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Jak korzystać z serwisu
            </h2>
          </div>
          <ul className="space-y-3 text-slate-700 text-sm">
            <li>
              <strong>1) Sprawdź pojęcia:</strong> upewnij się, co oznacza pismo
              i jakie są typowe terminy.
            </li>
            <li>
              <strong>2) Oceń ryzyko:</strong> jeżeli w grę wchodzi termin
              procesowy, działaj priorytetowo.
            </li>
            <li>
              <strong>3) Zamów analizę:</strong> otrzymasz usystematyzowane
              omówienie i rekomendowane kroki.
            </li>
            <li>
              <strong>4) Skonsultuj z prawnikiem:</strong> w sprawach spornych
              zapewnia to najlepszą ochronę interesów.
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Oferta serwisu
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
              Wybierz najlepszą ścieżkę dla swojej sprawy
            </h2>
            <p className="text-slate-600 mt-2 max-w-3xl">
              Baza wiedzy pomaga zrozumieć pojęcia i ryzyka. Jeżeli masz
              dokument lub termin procesowy – najszybciej dojdziesz do decyzji
              przez analizę dokumentu. Jeśli potrzebujesz prowadzenia sprawy,
              umów konsultację.
            </p>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/document-analysis"
            className="group rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-colors p-5"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <div className="font-bold text-slate-900">Analiza dokumentów</div>
            </div>
            <div className="text-sm text-slate-600 mt-2">
              Przejrzyste omówienie pisma, ryzyk i rekomendowanych kroków.
            </div>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 group-hover:text-emerald-800">
              Zobacz ofertę <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            to="/services"
            className="group rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-colors p-5"
          >
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-indigo-700" />
              <div className="font-bold text-slate-900">Zakres usług</div>
            </div>
            <div className="text-sm text-slate-600 mt-2">
              Obszary prawa, w których pomagamy oraz typowe sprawy.
            </div>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-indigo-700 group-hover:text-indigo-800">
              Przegląd usług <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            to="/contact"
            className="group rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors p-5"
          >
            <div className="flex items-center gap-3">
              <MessageSquareText className="w-5 h-5 text-slate-700" />
              <div className="font-bold text-slate-900">Konsultacja</div>
            </div>
            <div className="text-sm text-slate-600 mt-2">
              Gdy chcesz omówić strategię i kolejne kroki z prawnikiem.
            </div>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-slate-800 group-hover:text-slate-900">
              Umów rozmowę <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <UserPlus className="w-5 h-5 text-blue-700" />
              <div className="font-bold text-slate-900">Konto klienta</div>
            </div>
            <div className="text-sm text-slate-600 mt-2">
              Rejestracja i logowanie umożliwiają dostęp do panelu i narzędzi.
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/register"
                className="flex-1 text-center px-3 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold transition-colors inline-flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" /> Rejestracja
              </Link>
              <Link
                to="/login"
                className="flex-1 text-center px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-bold transition-colors inline-flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Logowanie
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 grid lg:grid-cols-3 gap-6">
        {filtered.map((i) => (
          <div
            key={`${i.type}:${i.title}`}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <span
                className={`text-xs font-bold uppercase tracking-widest ${i.type === "faq" ? "text-purple-700" : "text-blue-700"}`}
              >
                {i.type === "faq" ? "FAQ" : "Termin"}
              </span>
              <span className="text-xs text-slate-500">{i.category}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{i.title}</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {i.content}
            </p>
            <div className="mt-4">
              <Link
                to="/document-analysis"
                className="inline-flex items-center gap-2 text-emerald-700 font-bold text-sm hover:text-emerald-800"
              >
                Przejdź do oferty analiz <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 text-center text-slate-600">
          Brak wyników. Spróbuj innego hasła lub przejdź do{" "}
          <Link className="text-emerald-700 font-bold" to="/document-analysis">
            oferty analiz
          </Link>
          .
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
