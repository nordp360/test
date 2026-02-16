import React from 'react';
import { Scale, Users, Award, Landmark } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      
      {/* Hero */}
      <div className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/20 to-transparent"></div>
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-sans font-bold mb-6">Misja: Prawo Dostępne dla Każdego</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            LexPortal to połączenie tradycyjnych wartości adwokatury z nowoczesną technologią. 
            Wierzymy, że profesjonalna pomoc prawna powinna być szybka, przejrzysta i dostępna online.
          </p>
        </div>
      </div>

      {/* Values Stats */}
      <div className="py-16 bg-slate-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                  <div className="text-4xl font-bold text-amber-500 mb-2">15+</div>
                  <div className="text-sm font-bold text-slate-900 uppercase tracking-widest">Lat Doświadczenia</div>
              </div>
              <div>
                  <div className="text-4xl font-bold text-amber-500 mb-2">5000+</div>
                  <div className="text-sm font-bold text-slate-900 uppercase tracking-widest">Zadowolonych Klientów</div>
              </div>
              <div>
                  <div className="text-4xl font-bold text-amber-500 mb-2">24h</div>
                  <div className="text-sm font-bold text-slate-900 uppercase tracking-widest">Czas Reakcji</div>
              </div>
              <div>
                  <div className="text-4xl font-bold text-amber-500 mb-2">100%</div>
                  <div className="text-sm font-bold text-slate-900 uppercase tracking-widest">Bezpieczeństwa Danych</div>
              </div>
          </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-6 font-sans">Historia Kancelarii</h2>
                  <div className="space-y-6 text-slate-600 leading-relaxed">
                      <p>
                          LexPortal powstał w 2023 roku jako odpowiedź na rosnące zapotrzebowanie na usługi prawne online. 
                          Zauważyliśmy, że klienci często rezygnują z pomocy prawnej z obawy przed wysokimi kosztami i skomplikowanymi procedurami.
                      </p>
                      <p>
                          Nasz zespół, składający się z doświadczonych adwokatów i radców prawnych, postanowił to zmienić. 
                          Wykorzystując sztuczną inteligencję (AI) do automatyzacji powtarzalnych czynności, możemy oferować 
                          usługi premium w przystępnych cenach, zachowując przy tym najwyższą jakość merytoryczną.
                      </p>
                      <p>
                          Dziś obsługujemy zarówno klientów indywidualnych, jak i małe oraz średnie przedsiębiorstwa z całej Polski, 
                          a nasza platforma jest synonimem innowacji w branży LegalTech.
                      </p>
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-48">
                      <Scale className="w-10 h-10 text-slate-900 mb-4"/>
                      <h4 className="font-bold">Etyka Zawodowa</h4>
                  </div>
                  <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col items-center justify-center text-center h-48 mt-8">
                      <Landmark className="w-10 h-10 text-amber-500 mb-4"/>
                      <h4 className="font-bold">Nowoczesność</h4>
                  </div>
                  <div className="bg-amber-500 text-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-48 -mt-8">
                      <Users className="w-10 h-10 mb-4"/>
                      <h4 className="font-bold">Partnerstwo</h4>
                  </div>
                  <div className="bg-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-48">
                      <Award className="w-10 h-10 text-slate-900 mb-4"/>
                      <h4 className="font-bold">Skuteczność</h4>
                  </div>
              </div>
          </div>
      </div>

      {/* Team Mockup */}
      <div className="bg-slate-50 py-24">
          <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4 font-sans">Nasz Zespół</h2>
                  <div className="w-20 h-1 bg-amber-500 mx-auto"></div>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                  {[
                      { name: "Mec. Anna Nowak", role: "Partner Zarządzający", spec: "Prawo Gospodarcze" },
                      { name: "Mec. Piotr Kowalski", role: "Adwokat", spec: "Prawo Rodzinne i Karne" },
                      { name: "Marta Wiśniewska", role: "Radca Prawny", spec: "Własność Intelektualna i IT" }
                  ].map((person, i) => (
                      <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center hover:shadow-lg transition-shadow">
                          <div className="w-32 h-32 bg-slate-200 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-sans text-slate-400 font-bold">
                              {person.name.split(' ')[1][0]}
                          </div>
                          <h3 className="text-xl font-bold text-slate-900">{person.name}</h3>
                          <p className="text-amber-600 font-medium text-sm mb-2 uppercase tracking-wide">{person.role}</p>
                          <p className="text-slate-500 text-sm">{person.spec}</p>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
};

export default About;