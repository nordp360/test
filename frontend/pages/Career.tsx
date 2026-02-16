import React from 'react';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';

const Career: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="bg-slate-900 text-white py-20 text-center">
         <h1 className="text-4xl font-bold mb-4 font-sans">Dołącz do Zespołu LexPortal</h1>
         <p className="text-slate-300 max-w-2xl mx-auto">Tworzymy przyszłość usług prawnych. Szukamy pasjonatów prawa i nowych technologii.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-200 pb-4">Aktualne Oferty Pracy</h2>
          
          <div className="space-y-6">
              {[
                  { title: "Aplikant Adwokacki / Radcowski", type: "Pełny etat", loc: "Warszawa / Hybrydowo", dept: "Dział Procesowy" },
                  { title: "Prawnik ds. Umów IT (Legal Tech)", type: "B2B / Umowa o pracę", loc: "Zdalnie", dept: "Dział Nowych Technologii" },
                  { title: "Specjalista ds. Obsługi Klienta", type: "Pełny etat", loc: "Warszawa", dept: "Biuro Obsługi" }
              ].map((job, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer flex flex-col md:flex-row justify-between items-center gap-4">
                      <div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                              <span className="flex items-center gap-1"><Briefcase className="w-4 h-4"/> {job.dept}</span>
                              <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {job.loc}</span>
                              <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {job.type}</span>
                          </div>
                      </div>
                      <button className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg font-medium group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center gap-2">
                          Aplikuj <ArrowRight className="w-4 h-4"/>
                      </button>
                  </div>
              ))}
          </div>

          <div className="mt-16 bg-blue-50 p-8 rounded-xl border border-blue-100 text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Nie znalazłeś oferty dla siebie?</h3>
              <p className="text-slate-600 mb-6">Jesteśmy zawsze otwarci na talenty. Wyślij nam swoje CV, a odezwiemy się, gdy pojawi się odpowiednia rekrutacja.</p>
              <a href="mailto:rekrutacja@lexportal.pl" className="inline-block bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors">
                  Wyślij CV: rekrutacja@lexportal.pl
              </a>
          </div>
      </div>
    </div>
  );
};

export default Career;