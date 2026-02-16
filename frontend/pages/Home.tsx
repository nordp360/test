import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Check,
  Shield,
  ArrowRight,
  Users,
  Scale,
  Star,
  Search,
  Globe,
  Briefcase,
} from "lucide-react";
import heroBg from "../assets/AI_Studio_law.png";

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/knowledge-base?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-800 dark:text-slate-100 dark:bg-slate-900 transition-colors duration-200">
      {/* HERO SECTION */}
      <section className="relative bg-slate-900 text-white overflow-hidden pt-20 pb-32">
        {/* Background Image: User provided image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="Nowoczesne biuro prawne"
            className="w-full h-full object-cover opacity-80 transition-opacity duration-1000"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/80 to-slate-900/30"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-amber-500/30 text-amber-500 text-xs font-medium mb-8 backdrop-blur-sm uppercase tracking-widest font-sans">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Innowacja w Prawie
          </div>

          <h1 className="font-sans text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight text-white">
            Rozwiąż swój problem prawny <br />
            <span className="text-blue-500 font-sans font-bold">
              bez wychodzenia z domu
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed font-light font-sans">
            Gotowe pisma procesowe, weryfikacja przez adwokatów i obsługa
            online. Bezpiecznie, szybko i skutecznie.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-10 relative group">
            <div className="absolute inset-0 bg-amber-500 blur opacity-20 group-hover:opacity-30 transition-opacity rounded-xl"></div>
            <div className="relative flex items-center bg-white rounded-xl shadow-2xl p-2">
              <Search className="ml-4 w-6 h-6 text-slate-400" />
              <input
                type="text"
                placeholder="Czego szukasz? (np. rozwód, umowa najmu, spadek)..."
                className="w-full p-4 outline-none text-slate-800 placeholder-slate-400 font-sans"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleSearch}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8 py-3 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-sans"
              >
                Szukaj
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/knowledge-base"
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 px-8 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-700/20 transform hover:-translate-y-0.5 border border-transparent font-sans"
            >
              <Scale className="w-5 h-5" /> Baza Wiedzy
            </Link>
            <Link
              to="/contact"
              className="bg-transparent hover:bg-white/10 text-white font-medium py-3.5 px-8 rounded-lg transition-all border border-slate-500 hover:border-white backdrop-blur-sm font-sans"
            >
              Umów Konsultację
            </Link>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="bg-white border-b border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400 uppercase tracking-widest mb-6 font-bold font-sans">
            Pisali o nas
          </p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Mock Logos */}
            <div className="flex items-center gap-2 font-sans font-bold text-xl">
              <Globe className="w-6 h-6" /> Rzeczpospolita
            </div>
            <div className="flex items-center gap-2 font-sans font-bold text-xl">
              <Scale className="w-6 h-6" /> Gazeta Prawna
            </div>
            <div className="flex items-center gap-2 font-sans font-bold text-xl">
              <Shield className="w-6 h-6" /> Business Insider
            </div>
            <div className="flex items-center gap-2 font-sans font-bold text-xl">
              <Users className="w-6 h-6" /> Forbes
            </div>
          </div>
          <div className="mt-8 flex justify-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400 font-sans">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" /> Ponad 5000
              wygenerowanych pism
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" /> 98% skuteczności
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Jak to działa?
            </h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto mb-6"></div>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans">
              Trzy proste kroki dzielą Cię od rozwiązania problemu prawnego.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                title: "Wybierz sprawę",
                desc: "Skorzystaj z wyszukiwarki lub Asystenta AI, aby określić swój problem prawny.",
              },
              {
                step: "02",
                title: "Odpowiedz na pytania",
                desc: "Inteligentny formularz przeprowadzi Cię przez proces, zbierając kluczowe informacje.",
              },
              {
                step: "03",
                title: "Pobierz lub Skonsultuj",
                desc: "Otrzymaj gotowe pismo natychmiast lub prześlij je do weryfikacji przez adwokata.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-amber-500/30 transition-all duration-300 group"
              >
                <div className="absolute -top-6 left-8 text-6xl font-sans font-bold text-slate-100 group-hover:text-amber-500/20 transition-colors select-none">
                  {item.step}
                </div>
                <div className="relative z-10 pt-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 font-sans">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFER TILES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-sans text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                Obszary Prawa
              </h2>
              <div className="w-20 h-1 bg-amber-500"></div>
            </div>
            <Link
              to="/services"
              className="text-emerald-700 font-medium hover:text-emerald-800 flex items-center gap-1 group font-sans"
            >
              Zobacz wszystkie{" "}
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                title: "Prawo Rodzinne",
                items: ["Rozwody", "Alimenty", "Władza rodzicielska"],
              },
              {
                icon: <Scale className="w-8 h-8" />,
                title: "Nieruchomości",
                items: ["Umowy najmu", "Księgi wieczyste", "Eksmisje"],
              },
              {
                icon: <Briefcase className="w-8 h-8" />,
                title: "Praca i ZUS",
                items: ["Umowy o pracę", "Odwołania", "Mobbing"],
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Dla Biznesu",
                items: ["Rejestracja spółek", "RODO", "Umowy B2B"],
              },
            ].map((cat, idx) => (
              <div
                key={idx}
                className="group bg-slate-50 border border-slate-100 p-8 rounded-xl hover:bg-slate-900 hover:text-white transition-all duration-300 shadow-sm hover:shadow-2xl cursor-pointer"
              >
                <div className="text-amber-500 mb-6 bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-sm group-hover:bg-white/10 group-hover:text-amber-400 transition-colors">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 font-sans">
                  {cat.title}
                </h3>
                <ul className="space-y-2">
                  {cat.items.map((it, i) => (
                    <li
                      key={i}
                      className="text-sm text-slate-500 group-hover:text-slate-300 flex items-center gap-2 font-sans"
                    >
                      <div className="w-1 h-1 bg-amber-500 rounded-full"></div>{" "}
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS (Google Style) */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-sans text-3xl font-bold text-slate-900 mb-2">
              Opinie Klientów
            </h2>
            <div className="flex items-center justify-center gap-2 text-amber-500 mb-2">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
            </div>
            <p className="text-sm text-slate-500 font-sans">
              Średnia ocena 4.9/5 na podstawie Google Moja Firma
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Anna K.",
                date: "2 dni temu",
                text: "Profesjonalne podejście. Pismo rozwodowe przygotowane w 15 minut, adwokat zweryfikował je tego samego dnia.",
              },
              {
                name: "Marek Z.",
                date: "Tydzień temu",
                text: "Świetna opcja dla małych firm. Generuję tu wszystkie umowy B2B. Oszczędność czasu i pieniędzy.",
              },
              {
                name: "Katarzyna W.",
                date: "Miesiąc temu",
                text: "Bardzo intuicyjny panel. Asystent AI pomógł mi zrozumieć zawiłości prawne. Polecam!",
              },
            ].map((review, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative"
              >
                <div className="absolute top-6 right-6">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                    alt="Google"
                    className="w-5 h-5 opacity-50"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 font-bold text-sm font-sans">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 font-sans">
                      {review.name}
                    </p>
                    <div className="flex text-amber-400 text-xs">
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 text-sm italic font-sans">
                  &quot;{review.text}&quot;
                </p>
                <p className="text-xs text-slate-400 mt-4 font-sans">
                  {review.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
    </div>
  );
};

export default Home;
