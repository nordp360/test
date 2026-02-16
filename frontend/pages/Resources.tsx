import React, { useState } from "react";
import {
  ExternalLink,
  Lock,
  Search,
  Target,
  Layout,
  Server,
  Database,
  ShieldCheck,
  Download,
  Loader2,
} from "lucide-react";
import { exportPageToPDF, generateSEOCampaignPDF } from "../utils/pdfExport";

const Resources: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExportChecklist = async () => {
    try {
      setIsExporting(true);
      setExportError(null);
      await exportPageToPDF("lexportal-checklist-wdrozenia.pdf");
    } catch (error) {
      console.error("Export error:", error);
      setExportError("Nie udało się wygenerować PDF. Spróbuj ponownie.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportSEOPlan = async () => {
    try {
      setIsExporting(true);
      setExportError(null);
      await generateSEOCampaignPDF();
    } catch (error) {
      console.error("Export error:", error);
      setExportError("Nie udało się wygenerować planu SEO. Spróbuj ponownie.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div id="resources-content" className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Materiały Projektowe i Strategia
        </h1>
        <p className="text-lg text-slate-600">
          Zestaw materiałów produktowych, operacyjnych i technicznych dla
          LexPortal: zakres funkcji, standardy bezpieczeństwa, architektura
          backendu oraz kierunek rozwoju marketingu. Dokumenty są przygotowane w
          formie umożliwiającej szybkie decyzje zarządcze, spójny przekaz dla
          interesariuszy oraz efektywne wdrożenie.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Core Functionality Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-blue-700">
            <Layout className="w-6 h-6" />
            <h2 className="text-xl font-bold">Funkcjonalności Systemu</h2>
          </div>
          <ul className="space-y-3 text-slate-700">
            <li className="flex gap-3">
              <span className="font-bold text-slate-900 w-24 shrink-0">
                Konta:
              </span>
              <span>
                Klient, Prawnik (Operator), Administrator (role-based access
                control).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-slate-900 w-24 shrink-0">
                Baza Pism:
              </span>
              <span>
                Polska (MVP) z rozszerzeniem o wybrane obszary prawa UE w
                kolejnych etapach.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-slate-900 w-24 shrink-0">
                AI:
              </span>
              <span>
                Asystent wspierający pracę operatorów i klientów (skrócenie
                czasu przygotowania szkiców, standaryzacja).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-slate-900 w-24 shrink-0">
                Płatności:
              </span>
              <span>
                PayU / Stripe / BLIK / karty (gotowość pod rozliczenia B2C i
                B2B).
              </span>
            </li>
          </ul>
        </div>

        {/* Security Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-green-700">
            <Lock className="w-6 h-6" />
            <h2 className="text-xl font-bold">Bezpieczeństwo & RODO</h2>
          </div>
          <ul className="space-y-3 text-slate-700">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></div>
              <span>
                Szyfrowanie danych oraz separacja środowisk (minimalizacja
                ryzyka i zakresu incydentu).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></div>
              <span>
                2FA: SMS/OTP lub aplikacja (np. Google Authenticator) + polityka
                silnych haseł.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></div>
              <span>
                Zgodność z RODO: minimalizacja danych, rozliczalność, procesy
                retencji oraz gotowość do audytu.
              </span>
            </li>
          </ul>
        </div>

        {/* Backend Architecture Spec (Added based on backend.md) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
          <div className="flex items-center gap-3 mb-4 text-slate-900">
            <Server className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold">
              Specyfikacja Techniczna (Backend)
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-500" /> Technology
                Stack
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    Python 3.11+
                  </span>
                  <span>
                    FastAPI (asynchroniczne API, gotowe do skalowania)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    PostgreSQL
                  </span>
                  <span>
                    Relacyjna baza danych + SQLAlchemy (spójność, transakcje,
                    audytowalność)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    Celery/Redis
                  </span>
                  <span>
                    Kolejkowanie zadań i przetwarzanie asynchroniczne (np.
                    generowanie PDF / powiadomienia)
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500" /> Security &
                Compliance
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5"></div>
                  <span>
                    <strong>Encryption at Rest:</strong> Szyfrowanie danych
                    wrażliwych (np. PESEL, opisy spraw) na poziomie aplikacji.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5"></div>
                  <span>
                    <strong>Audit Logs:</strong> Rejestr aktywności użytkowników
                    i zdarzeń bezpieczeństwa (gotowość pod wymagania
                    compliance).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5"></div>
                  <span>
                    <strong>Disaster Recovery:</strong> Backup 3-2-1 oraz
                    scenariusze odtworzeniowe (RPO/RTO) w zależności od SLA.
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              <strong className="text-slate-700">Integracje:</strong>{" "}
              Stripe/PayU (płatności), Fakturownia (faktury), Google Gemini
              (AI), Veriff (KYC).
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
          <div className="flex items-center gap-3 mb-4 text-slate-900">
            <ShieldCheck className="w-6 h-6 text-blue-700" />
            <h2 className="text-xl font-bold">
              Pakiet Materiałów Projektowych
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-slate-700">
              <h3 className="font-semibold mb-2">Co zawiera pakiet</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                  <span>
                    <strong>Propozycja wartości (Value Proposition):</strong>{" "}
                    segmenty klientów, problemy do rozwiązania, przewagi i
                    uzasadnienie cenowe.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                  <span>
                    <strong>MVP + roadmapa:</strong> priorytety rozwoju,
                    zależności i kamienie milowe (pod inwestora i zespół
                    delivery).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                  <span>
                    <strong>Standardy jakości i compliance:</strong>{" "}
                    bezpieczeństwo, RODO, audyt, retencja danych i zasady
                    zarządzania dostępami.
                  </span>
                </li>
              </ul>
            </div>
            <div className="text-slate-700">
              <h3 className="font-semibold mb-2">Jak pracujemy (proces)</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-1.5"></div>
                  <span>
                    <strong>Discovery & governance:</strong> cele, wymagania,
                    ryzyka, KPI oraz definicja „done”.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-1.5"></div>
                  <span>
                    <strong>Delivery:</strong> iteracyjne wdrażanie funkcji +
                    testy integracyjne + kontrola jakości.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-1.5"></div>
                  <span>
                    <strong>Go-live & growth:</strong> monitoring, analityka,
                    optymalizacja konwersji, SEO oraz performance marketing.
                  </span>
                </li>
              </ul>
              <div className="mt-4 text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-lg p-3">
                Rekomendacja: zacznij od 3–5 kluczowych usług/pism, zbuduj jasne
                KPI (rejestracje, konwersja, CAC), a następnie skaluj treści i
                automatyzacje.
              </div>
            </div>
          </div>
        </div>

        {/* Marketing Strategy */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
          <div className="flex items-center gap-3 mb-4 text-purple-700">
            <Target className="w-6 h-6" />
            <h2 className="text-xl font-bold">Marketing & SEO</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">SEO Lokalne i Techniczne</h3>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>
                  • Google Moja Firma + spójny NAP (nazwa/adres/telefon) dla
                  kancelarii/marki
                </li>
                <li>
                  • Opinie klientów i case studies (Social Proof + wiarygodność)
                </li>
                <li>
                  • Google Tag Manager + zdarzenia: rejestracja, zakup,
                  generowanie pisma
                </li>
                <li>
                  • Struktura treści: klastry tematyczne + FAQ + schema.org
                  (FAQ/Article/SoftwareApplication) + widoczność w AI/SGE
                </li>
                <li>
                  • Core Web Vitals i stabilność UX (wpływ na konwersję i koszt
                  pozyskania)
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Płatna Promocja & Content</h3>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>
                  • Blog ekspercki: poradniki krok-po-kroku + „wzory” z CTA do
                  wygenerowania dokumentu
                </li>
                <li>
                  • Google Ads: kampanie na intencje (np. „wezwanie do zapłaty
                  wzór”) + remarketing + kontrola CAC
                </li>
                <li>
                  • Landing pages pod usługi/pisma: jasna obietnica wartości,
                  transparentny proces i szybki start
                </li>
                <li>
                  • Onboarding e-mail: edukacja, bezpieczeństwo, aktywacja
                  użytkownika i retencja
                </li>
              </ul>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleExportChecklist}
                  disabled={isExporting}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-700 text-white font-semibold hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generowanie...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Pobierz checklistę wdrożenia
                    </>
                  )}
                </button>
                <button
                  onClick={handleExportSEOPlan}
                  disabled={isExporting}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generowanie...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Zobacz plan kampanii SEO (90 dni)
                    </>
                  )}
                </button>
              </div>
              {exportError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {exportError}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Useful Links */}
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <Search className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold">Przydatne Linki i Narzędzia</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="https://ads.google.com"
              target="_blank"
              rel="noreferrer"
              className="block bg-slate-800 p-4 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-blue-400">Google Ads</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-xs text-slate-300">
                Sprawdź aktualne kupony (np. 1200 zł na start).
              </p>
            </a>

            <a
              href="https://tagmanager.google.com"
              target="_blank"
              rel="noreferrer"
              className="block bg-slate-800 p-4 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-orange-400">Tag Manager</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-xs text-slate-300">
                Zarządzanie skryptami analitycznymi.
              </p>
            </a>

            <a
              href="https://www.google.com/business/"
              target="_blank"
              rel="noreferrer"
              className="block bg-slate-800 p-4 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-green-400">
                  Google Moja Firma
                </span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-xs text-slate-300">
                Niezbędne do pozycjonowania lokalnego.
              </p>
            </a>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-700 text-sm text-slate-400">
            <p className="font-semibold mb-2">Polecane poradniki:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ideo Force - SEO dla branży prawniczej</li>
              <li>Marketing Prawniczy - Pozycjonowanie SEO</li>
              <li>Agencja Kuźnia - Jak promować usługi prawne</li>
              <li>The Lion - Dobre praktyki tworzenia stron dla kancelarii</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
