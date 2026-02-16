import React from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="bg-slate-900 text-white py-20 text-center">
         <h1 className="text-4xl font-bold mb-4 font-sans">Kontakt</h1>
         <p className="text-slate-300">Jesteśmy do Twojej dyspozycji. Napisz lub zadzwoń.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-12">
              
              {/* Contact Info */}
              <div className="md:col-span-1 space-y-8">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="font-bold text-slate-900 mb-6 text-lg">Dane kontaktowe</h3>
                      <div className="space-y-6">
                          <div className="flex items-start gap-4">
                              <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><MapPin className="w-5 h-5"/></div>
                              <div>
                                  <p className="font-bold text-slate-800 text-sm uppercase tracking-wide">Adres</p>
                                  <p className="text-slate-600 mt-1">LexPortal Sp. z o.o.<br/>ul. Prawnicza 100<br/>00-001 Warszawa</p>
                              </div>
                          </div>
                          <div className="flex items-start gap-4">
                              <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><Phone className="w-5 h-5"/></div>
                              <div>
                                  <p className="font-bold text-slate-800 text-sm uppercase tracking-wide">Telefon</p>
                                  <p className="text-slate-600 mt-1">+48 22 000 00 00<br/>+48 500 000 000</p>
                                  <p className="text-xs text-slate-400 mt-1">Infolinia czynna pn-pt 9:00-17:00</p>
                              </div>
                          </div>
                          <div className="flex items-start gap-4">
                              <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><Mail className="w-5 h-5"/></div>
                              <div>
                                  <p className="font-bold text-slate-800 text-sm uppercase tracking-wide">E-mail</p>
                                  <p className="text-slate-600 mt-1">kontakt@lexportal.pl<br/>pomoc@lexportal.pl</p>
                              </div>
                          </div>
                      </div>
                  </div>

                   <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-white">
                      <div className="flex items-center gap-3 mb-4">
                          <Clock className="w-5 h-5 text-amber-500"/>
                          <h3 className="font-bold">Godziny pracy</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-slate-300">
                          <li className="flex justify-between border-b border-slate-700 pb-2"><span>Poniedziałek - Piątek</span> <span>9:00 - 17:00</span></li>
                          <li className="flex justify-between border-b border-slate-700 pb-2"><span>Sobota</span> <span>10:00 - 14:00</span></li>
                          <li className="flex justify-between pt-2"><span>Niedziela</span> <span>Zamknięte</span></li>
                      </ul>
                   </div>
              </div>

              {/* Contact Form */}
              <div className="md:col-span-2">
                  <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-lg">
                      <h2 className="text-2xl font-bold text-slate-900 mb-6 font-sans">Formularz Kontaktowy</h2>
                      <form className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-2">Imię i Nazwisko</label>
                                  <input type="text" className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Jan Kowalski" />
                              </div>
                              <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-2">Adres E-mail</label>
                                  <input type="email" className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="jan@example.com" />
                              </div>
                          </div>
                          
                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Temat</label>
                              <select className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                  <option>Zapytanie ogólne</option>
                                  <option>Oferta dla firm</option>
                                  <option>Problem techniczny</option>
                                  <option>Współpraca</option>
                              </select>
                          </div>

                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Wiadomość</label>
                              <textarea className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none h-32" placeholder="Opisz swoją sprawę..."></textarea>
                          </div>

                          <div className="flex items-start gap-3">
                              <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded" required/>
                              <span className="text-sm text-slate-500">
                                  Wyrażam zgodę na przetwarzanie moich danych osobowych w celu obsługi zapytania zgodnie z Polityką Prywatności.
                              </span>
                          </div>

                          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20">
                              <Send className="w-4 h-4" /> Wyślij wiadomość
                          </button>
                      </form>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Contact;