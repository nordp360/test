import React, { useState } from 'react';
import { User, Building2, FileSearch, CheckCircle, ArrowRight, Scale, Shield, Briefcase, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'individual' | 'company' | 'verification'>('individual');

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <div className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-sans">Nasze Usługi</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Kompleksowe wsparcie prawne dostosowane do Twoich potrzeb. Wybierz obszar, w którym możemy Ci pomóc.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-2 flex flex-col md:flex-row gap-2">
          <button 
            onClick={() => setActiveTab('individual')}
            className={`flex-1 py-4 px-6 rounded-lg font-bold flex items-center justify-center gap-3 transition-all ${activeTab === 'individual' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-50 text-slate-600'}`}
          >
            <User className="w-5 h-5" /> Dla Osób Fizycznych
          </button>
          <button 
            onClick={() => setActiveTab('company')}
            className={`flex-1 py-4 px-6 rounded-lg font-bold flex items-center justify-center gap-3 transition-all ${activeTab === 'company' ? 'bg-slate-900 text-white shadow-md' : 'hover:bg-slate-50 text-slate-600'}`}
          >
            <Building2 className="w-5 h-5" /> Dla Firm
          </button>
          <button 
            onClick={() => setActiveTab('verification')}
            className={`flex-1 py-4 px-6 rounded-lg font-bold flex items-center justify-center gap-3 transition-all ${activeTab === 'verification' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-slate-50 text-slate-600'}`}
          >
            <FileSearch className="w-5 h-5" /> Weryfikacja Umów
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* INDIVIDUALS */}
        {activeTab === 'individual' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div>
                   <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <Scale className="w-8 h-8 text-blue-600"/> Prawo Rodzinne i Cywilne
                   </h2>
                   <p className="text-slate-600 leading-relaxed mb-6">
                      Rozumiemy, że sprawy prywatne wymagają nie tylko wiedzy prawniczej, ale także empatii i dyskrecji. 
                      Oferujemy pełne wsparcie w trudnych sytuacjach życiowych.
                   </p>
                   <ul className="space-y-3 mb-8">
                      {['Rozwody i separacje (z orzekaniem lub bez)', 'Alimenty i władza rodzicielska', 'Podział majątku wspólnego', 'Sprawy spadkowe i testamenty'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-700">
                          <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" /> {item}
                        </li>
                      ))}
                   </ul>
                   <Link to="/assistant" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors">
                      Skonsultuj z Asystentem AI <ArrowRight className="w-4 h-4" />
                   </Link>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Cennik usług podstawowych</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                            <span>Konsultacja online (45 min)</span>
                            <span className="font-bold text-blue-600">199 PLN</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                            <span>Pozew o rozwód (Draft)</span>
                            <span className="font-bold text-blue-600">299 PLN</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                            <span>Pismo procesowe</span>
                            <span className="font-bold text-blue-600">od 149 PLN</span>
                        </div>
                    </div>
                    <Link to="/payment" className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition-colors font-bold">
                        Zamów usługę
                    </Link>
                </div>
             </div>
          </div>
        )}

        {/* COMPANIES */}
        {activeTab === 'company' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div>
                   <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <Briefcase className="w-8 h-8 text-slate-900"/> Obsługa Prawna Biznesu
                   </h2>
                   <p className="text-slate-600 leading-relaxed mb-6">
                      Bezpieczeństwo prawne to fundament stabilnego biznesu. Oferujemy stałą obsługę prawną, 
                      rejestrację spółek oraz audyty RODO i Compliance.
                   </p>
                   <ul className="space-y-3 mb-8">
                      {['Rejestracja spółek w KRS (S24)', 'Tworzenie i opiniowanie umów B2B', 'Windykacja należności', 'Obsługa korporacyjna i RODO'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-700">
                          <CheckCircle className="w-5 h-5 text-slate-900 flex-shrink-0" /> {item}
                        </li>
                      ))}
                   </ul>
                   <Link to="/contact" className="inline-flex items-center gap-2 text-slate-900 font-bold hover:text-blue-800 transition-colors">
                      Zapytaj o ofertę dedykowaną <ArrowRight className="w-4 h-4" />
                   </Link>
                </div>
                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
                    <h3 className="text-xl font-bold text-amber-500 mb-4">Pakiety dla firm</h3>
                    <div className="space-y-6">
                        <div className="bg-white/10 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold">Pakiet START</span>
                                <span className="text-amber-500 font-bold">499 PLN / mc</span>
                            </div>
                            <p className="text-xs text-slate-300">5h konsultacji, wzory umów, monitoring płatności.</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-lg border border-amber-500/30">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold">Pakiet PRO</span>
                                <span className="text-amber-500 font-bold">1499 PLN / mc</span>
                            </div>
                            <p className="text-xs text-slate-300">Nielimitowane porady mailowe, audyt RODO, windykacja.</p>
                        </div>
                    </div>
                    <Link to="/payment?plan=sub_b2b" className="block w-full text-center bg-amber-500 text-slate-900 py-3 rounded-lg mt-6 hover:bg-amber-400 transition-colors font-bold">
                        Wybierz Pakiet
                    </Link>
                </div>
             </div>
          </div>
        )}

        {/* VERIFICATION */}
        {activeTab === 'verification' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center max-w-3xl mx-auto mb-16">
                 <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-emerald-600" />
                 </div>
                 <h2 className="text-3xl font-bold text-slate-900 mb-4">Bezpieczna Weryfikacja Umów</h2>
                 <p className="text-slate-600 text-lg">
                    Nie podpisuj dokumentów, których nie rozumiesz. Nasz zespół (wspierany przez AI) przeanalizuje Twoją umowę 
                    i wskaże klauzule niedozwolone (abuzywne) lub niekorzystne zapisy.
                 </p>
             </div>

             <div className="grid md:grid-cols-3 gap-8">
                 {[
                     { title: "Analiza Ekspresowa AI", price: "49 PLN", features: ["Analiza w 15 minut", "Wykrywanie klauzul abuzywnych", "Raport PDF"], color: "bg-slate-50 border-slate-200" },
                     { title: "Analiza Prawnicza Standard", price: "149 PLN", features: ["Weryfikacja przez Radcę Prawnego", "Komentarze do zapisów", "Czas: do 24h"], color: "bg-white border-blue-200 shadow-lg scale-105" },
                     { title: "Negocjacje Umowy", price: "od 399 PLN", features: ["Przygotowanie zmian (track changes)", "Udział w negocjacjach", "Pełne zabezpieczenie interesów"], color: "bg-slate-50 border-slate-200" }
                 ].map((plan, i) => (
                     <div key={i} className={`p-8 rounded-xl border ${plan.color} flex flex-col`}>
                         <h3 className="font-bold text-xl text-slate-900 mb-2">{plan.title}</h3>
                         <div className="text-3xl font-bold text-blue-600 mb-6">{plan.price}</div>
                         <ul className="space-y-3 mb-8 flex-1">
                             {plan.features.map((f, idx) => (
                                 <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                                     <CheckCircle className="w-4 h-4 text-emerald-500" /> {f}
                                 </li>
                             ))}
                         </ul>
                         <Link to="/payment" className="w-full block text-center bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 font-bold transition-colors">
                             Wybierz
                         </Link>
                     </div>
                 ))}
             </div>
          </div>
        )}

      </div>
      
      {/* CTA */}
      <div className="bg-slate-100 py-16 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Nie znalazłeś tego, czego szukasz?</h2>
          <p className="text-slate-600 mb-8">Skontaktuj się z nami, przygotujemy ofertę indywidualną.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-slate-900 border border-slate-300 px-8 py-3 rounded-lg font-bold hover:bg-slate-50 transition-colors">
              <HeartHandshake className="w-5 h-5" /> Formularz Kontaktowy
          </Link>
      </div>

    </div>
  );
};

export default Services;