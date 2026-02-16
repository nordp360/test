import React from "react";
import { Link } from "react-router-dom";
import { Check, Clock, ArrowRight } from "lucide-react";

const DocumentAnalysis: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-3 font-sans">
            PROFESJONALNA ANALIZA PRAWNA
          </p>
          <h1 className="font-sans text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Analiza Dokumentów Prawnych
          </h1>
          <p className="text-slate-600 max-w-3xl mx-auto leading-relaxed font-sans">
            Otrzymałeś pismo prawne i nie wiesz jak się zachować? Nasze
            profesjonalne analizy pomogą Ci zrozumieć sytuację i podjąć właściwe
            działania.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/payment"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-8 rounded-lg transition-all shadow-lg shadow-emerald-600/20 transform hover:-translate-y-0.5 font-sans"
            >
              Zamów Analizę Teraz
            </Link>
            <button
              onClick={() => {
                const element = document.getElementById("analizy");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="bg-white hover:bg-slate-50 text-slate-800 font-semibold py-3.5 px-8 rounded-lg transition-all border border-slate-200 shadow-sm font-sans"
            >
              Zobacz Rodzaje Analiz
            </button>
          </div>
        </div>

        <div id="analizy" className="mb-10">
          <div className="flex items-end justify-between gap-6 mb-6">
            <div>
              <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                Rodzaje Analiz Dokumentów
              </h2>
              <p className="text-slate-600 font-sans">
                Oferujemy profesjonalne analizy wszystkich rodzajów dokumentów
                prawnych. Każda analiza zawiera szczegółowe omówienie i
                konkretne wskazówki działania.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-sans">
              <Clock className="w-4 h-4" /> Standard: 12–48h
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2 font-sans">
                  Najpopularniejsze
                </p>
                <h3 className="text-xl font-bold text-slate-900 font-sans">
                  Nakaz Zapłaty
                </h3>
                <p className="text-sm text-slate-600 mt-2 font-sans">
                  Analiza formalnej poprawności nakazu zapłaty i możliwości
                  obrony.
                </p>
              </div>
              <div className="text-right">
                <div className="text-slate-400 line-through text-sm font-sans">
                  69 zł
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-sans">
                  59 zł
                </div>
                <div className="text-xs text-slate-500 font-sans">24h</div>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 font-sans">
                Co zawiera analiza:
              </p>
              <ul className="space-y-2 text-sm text-slate-600 font-sans">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Sprawdzenie poprawności formalnej
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Analiza podstaw prawnych roszczenia
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Ocena możliwości złożenia sprzeciwu
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Wskazanie terminów procesowych
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Propozycje działań prawnych
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Wzór sprzeciwu
                </li>
              </ul>
            </div>
            <div className="mt-6">
              <Link
                to="/payment"
                className="w-full inline-flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition-colors font-sans"
              >
                Zamów Analizę
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-sans">
                  Wezwanie Komornika
                </h3>
                <p className="text-sm text-slate-600 mt-2 font-sans">
                  Ocena legalności działań komorniczych i możliwości obrony.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-slate-900 font-sans">
                  59 zł
                </div>
                <div className="text-xs text-slate-500 font-sans">24h</div>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 font-sans">
                Co zawiera analiza:
              </p>
              <ul className="space-y-2 text-sm text-slate-600 font-sans">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Weryfikacja uprawnień komornika
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Analiza tytułu wykonawczego
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Sprawdzenie procedury egzekucyjnej
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Możliwości złożenia skargi
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Ochrona majątku przed zajęciem
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Strategia postępowania
                </li>
              </ul>
            </div>
            <div className="mt-6">
              <Link
                to="/payment"
                className="w-full inline-flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition-colors font-sans"
              >
                Zamów Analizę
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-sans">
                  Pozew Sądowy
                </h3>
                <p className="text-sm text-slate-600 mt-2 font-sans">
                  Szczegółowa analiza pozwu i przygotowanie strategii obrony.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-slate-900 font-sans">
                  89 zł
                </div>
                <div className="text-xs text-slate-500 font-sans">48h</div>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 font-sans">
                Co zawiera analiza:
              </p>
              <ul className="space-y-2 text-sm text-slate-600 font-sans">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Analiza zarzutów pozwu
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Ocena dowodów strony przeciwnej
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Identyfikacja słabych punktów
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Strategia obrony procesowej
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Przygotowanie odpowiedzi na pozew
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Wzór odpowiedzi na pozew
                </li>
              </ul>
            </div>
            <div className="mt-6">
              <Link
                to="/payment"
                className="w-full inline-flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition-colors font-sans"
              >
                Zamów Analizę
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-sans">
                  Upomnienie Przedsądowe
                </h3>
                <p className="text-sm text-slate-600 mt-2 font-sans">
                  Ocena zasadności roszczeń i możliwości negocjacji.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-slate-900 font-sans">
                  39 zł
                </div>
                <div className="text-xs text-slate-500 font-sans">12h</div>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 font-sans">
                Co zawiera analiza:
              </p>
              <ul className="space-y-2 text-sm text-slate-600 font-sans">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Weryfikacja podstaw prawnych
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Analiza wysokości roszczenia
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Możliwości negocjacji ugody
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Przygotowanie odpowiedzi
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Strategia dalszego postępowania
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Wzór odpowiedzi
                </li>
              </ul>
            </div>
            <div className="mt-6">
              <Link
                to="/payment"
                className="w-full inline-flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition-colors font-sans"
              >
                Zamów Analizę
              </Link>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-2xl p-7 hover:shadow-emerald-600/10 transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-2 font-sans">
                  NAJSZYBSZA
                </p>
                <h3 className="text-xl font-bold font-sans">Analiza Express</h3>
                <p className="text-sm text-slate-300 mt-2 font-sans">
                  Natychmiastowa analiza dowolnego dokumentu prawnego.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-white font-sans">
                  129 zł
                </div>
                <div className="text-xs text-slate-300 font-sans">6h</div>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 font-sans">
                Co zawiera analiza:
              </p>
              <ul className="space-y-2 text-sm text-slate-200 font-sans">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-500 mt-0.5" />
                  Analiza dowolnego dokumentu
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-500 mt-0.5" />
                  Priorytetowe traktowanie
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-500 mt-0.5" />
                  Dostępna 24/7
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-500 mt-0.5" />
                  Wsparcie weekendowe
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-500 mt-0.5" />
                  Dedykowany prawnik
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-500 mt-0.5" />
                  Nieograniczona konsultacja 48h
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-500 mt-0.5" />
                  Wszystkie potrzebne wzory
                </li>
              </ul>
            </div>
            <div className="mt-6">
              <Link
                to="/payment"
                className="w-full inline-flex justify-center items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition-colors font-sans"
              >
                Zamów Analizę
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-700 mb-2 font-sans">
                  DLA FIRM
                </p>
                <h3 className="text-xl font-bold text-slate-900 font-sans">
                  Pakiet Biznesowy
                </h3>
                <p className="text-sm text-slate-600 mt-2 font-sans">
                  Kompleksowa analiza dla firm i przedsiębiorców.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-slate-900 font-sans">
                  199 zł
                </div>
                <div className="text-xs text-slate-500 font-sans">24h</div>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 font-sans">
                Co zawiera analiza:
              </p>
              <ul className="space-y-2 text-sm text-slate-600 font-sans">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Analiza umów B2B
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Ocena ryzyka biznesowego
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Strategia negocjacyjna
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Wsparcie prawnika biznesowego
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Analiza podatkowa
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Dokumenty korporacyjne
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                  Wsparcie przez 14 dni
                </li>
              </ul>
            </div>
            <div className="mt-6">
              <Link
                to="/payment"
                className="w-full inline-flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition-colors font-sans"
              >
                Zamów Analizę
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="text-center mb-10">
            <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Jak Przebiega Analiza?
            </h2>
            <p className="text-slate-600 font-sans">
              Prosty proces w 4 krokach - od przesłania dokumentu do otrzymania
              profesjonalnej analizy prawnej
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Prześlij Dokument",
                desc: "Wgraj skan lub zdjęcie dokumentu w formacie PDF, JPG lub PNG",
              },
              {
                step: "2",
                title: "Opisz Sytuację",
                desc: "Wypełnij krótki formularz z podstawowymi informacjami o sprawie",
              },
              {
                step: "3",
                title: "Zapłać za Analizę",
                desc: "Bezpieczna płatność kartą lub BLIK z automatyczną fakturą VAT",
              },
              {
                step: "4",
                title: "Otrzymaj Analizę",
                desc: "Szczegółowy raport prawny przygotowany przez doświadczonych prawników",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="border border-slate-100 rounded-xl p-6 bg-slate-50"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mb-4 font-sans">
                  {s.step}
                </div>
                <h3 className="font-bold text-slate-900 mb-2 font-sans">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-600 font-sans">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h2 className="font-sans text-2xl font-bold text-slate-900 mb-6">
              Dlaczego Warto Wybrać Nasze Analizy?
            </h2>
            <ul className="space-y-4 text-slate-700 font-sans">
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-600 mt-0.5" />
                <span>
                  <strong>Szybka Realizacja</strong>
                  <br />
                  Większość analiz gotowa w ciągu 24 godzin
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-600 mt-0.5" />
                <span>
                  <strong>Doświadczeni Prawnicy</strong>
                  <br />
                  Analizy przygotowywane przez prawników z wieloletnim
                  doświadczeniem
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-600 mt-0.5" />
                <span>
                  <strong>Pełna Poufność</strong>
                  <br />
                  Zachowujemy tajemnicę zawodową i bezpieczeństwo danych
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-600 mt-0.5" />
                <span>
                  <strong>Gwarancja Jakości</strong>
                  <br />
                  Profesjonalne analizy zgodne z najwyższymi standardami
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-2xl p-8">
            <h2 className="font-sans text-2xl font-bold mb-6">
              Opinie Naszych Klientów
            </h2>
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="text-sm font-bold font-sans">Anna Kowalska</div>
                <div className="text-xs text-slate-300 font-sans">
                  Przedsiębiorca
                </div>
                <p className="text-slate-200 italic mt-3 font-sans">
                  &quot;Otrzymałam nakaz zapłaty na kwotę 15 000 zł. Analiza
                  wykazała błędy formalne i pomogła mi skutecznie się bronić.
                  Sprawa została umorzona!&quot;
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="text-sm font-bold font-sans">Marek Nowak</div>
                <div className="text-xs text-slate-300 font-sans">
                  Właściciel firmy
                </div>
                <p className="text-slate-200 italic mt-3 font-sans">
                  &quot;Komornik zajął moje konto firmowe. Dzięki analizie
                  dowiedziałem się o nieprawidłowościach w postępowaniu i
                  odzyskałem środki.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Potrzebujesz Analizy Dokumentu?
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8 font-sans">
            Nie czekaj - każdy dzień zwłoki może mieć znaczenie prawne. Zamów
            profesjonalną analizę już dziś!
          </p>
          <Link
            to="/payment"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-10 rounded-lg transition-all shadow-lg shadow-emerald-600/20 transform hover:-translate-y-0.5 font-sans"
          >
            Zamów Analizę Teraz <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DocumentAnalysis;
