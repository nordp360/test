import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Check, ShieldCheck, Lock, Smartphone, Loader2, ArrowRight, Download, FileText, Printer, Mail, Zap, Globe } from 'lucide-react';

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialPlan = queryParams.get('plan') || 'standard';

  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [paymentMethod, setPaymentMethod] = useState<'blik' | 'card' | 'payu' | 'stripe' | 'paypal' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rodoAccepted, setRodoAccepted] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [isExpress, setIsExpress] = useState(false);

  const plans = {
    freemium: { name: 'Pakiet Start (Freemium)', price: 0, features: ['Proste wzory (np. Wypowiedzenie)', 'Zapis do newslettera'] },
    standard: { name: 'Pay-Per-Document (Auto)', price: 89, features: ['Pismo generowane automatycznie', 'Wzór PDF/DOCX', 'Bez weryfikacji prawnika'] },
    hybrid: { name: 'PPD Hybrydowy (Verified)', price: 299, features: ['Weryfikacja przez prawnika', 'Gwarancja jakości', 'Konsultacja email'] },
    sub_b2b: { name: 'Subskrypcja B2B', price: 199, features: ['Dostęp do bazy umów B2B', '1 konsultacja/mc', 'Monitoring RODO'], period: '/miesiąc' },
    sub_pro: { name: 'Stała Obsługa PRO', price: 499, features: ['5h pracy prawnika/mc', 'Windykacja miękka', 'Priorytet'], period: '/miesiąc' }
  };

  const currentPlan = plans[selectedPlan as keyof typeof plans] || plans.standard;
  const finalPrice = currentPlan.price + (isExpress && selectedPlan !== 'freemium' && selectedPlan !== 'sub_b2b' && selectedPlan !== 'sub_pro' ? 99 : 0);

  const handlePayment = () => {
    if ((currentPlan.price > 0 && !paymentMethod) || !rodoAccepted) return;
    
    setIsProcessing(true);
    
    // Generate Mock Transaction ID
    const txId = 'TX-' + Math.floor(Math.random() * 1000000000);
    setTransactionId(txId);
    
    // Simulate payment gateway processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  // Uses native browser print which handles fonts correctly including Polish characters
  const handlePrint = () => {
      window.print();
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
        {/* IMPORTANT: ID 'payment-confirmation' and class 'print-area' are used by CSS print media query */}
        <div id="payment-confirmation" className="print-area bg-white rounded-2xl shadow-xl text-center max-w-lg w-full border border-slate-200 overflow-hidden relative">
          
          {/* Success Header */}
          <div className="bg-green-600 p-8 text-white">
             <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Check className="w-10 h-10 text-white" />
             </div>
             <h2 className="text-3xl font-bold mb-2">Płatność Przyjęta!</h2>
             <p className="text-green-100">Dziękujemy za zaufanie.</p>
          </div>

          <div className="p-8">
            {/* Transaction Details */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6 text-left">
                <h3 className="font-bold text-center mb-4 text-lg border-b border-slate-200 pb-2">Potwierdzenie Transakcji</h3>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                    <span className="text-sm text-slate-500">ID Transakcji</span>
                    <span className="font-mono font-bold text-slate-900">{transactionId}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-500">Usługa</span>
                    <span className="font-medium text-slate-900">{currentPlan.name}</span>
                </div>
                {isExpress && finalPrice > currentPlan.price && (
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-500">Dodatki</span>
                        <span className="font-medium text-orange-600 flex items-center gap-1"><Zap className="w-3 h-3"/> Express 24h</span>
                    </div>
                )}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-500">Metoda</span>
                    <span className="font-medium text-slate-900 uppercase">{paymentMethod || 'FREE'}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-500">Data</span>
                    <span className="font-medium text-slate-900">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
                    <span className="text-base font-bold text-slate-700">Kwota Brutto</span>
                    <span className="text-xl font-bold text-green-600">{finalPrice},00 PLN</span>
                </div>
                <div className="mt-4 text-center text-xs text-slate-400">
                    LexPortal Sp. z o.o. | NIP: 525-000-00-00 <br/>
                    ul. Prawnicza 100, 00-001 Warszawa
                </div>
            </div>
            
            {/* Email Confirmation Section - Only visible on screen, hidden in print via media query */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mb-6 text-left flex gap-3 no-print">
                <Mail className="w-6 h-6 text-blue-600 shrink-0" />
                <div>
                    <h4 className="font-bold text-sm text-blue-900 mb-1">Potwierdzenia wysłane</h4>
                    <p className="text-xs text-blue-700 leading-relaxed">System automatycznie wysłał e-maile potwierdzające zamówienie do:</p>
                    <ul className="list-disc pl-4 mt-1 text-xs text-blue-700">
                        <li>Ciebie (Klient)</li>
                        <li>Kancelarii (Operator Prawny)</li>
                        <li>Systemu Fakturowania (Automatyczna wysyłka faktury)</li>
                    </ul>
                </div>
            </div>

            <div className="space-y-3 no-print">
               <button 
                onClick={() => navigate('/client-dashboard')}
                className="w-full bg-slate-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
               >
                 Przejdź do Panelu Klienta <ArrowRight className="w-4 h-4" />
               </button>
               <div className="flex gap-3">
                   <button 
                     onClick={handlePrint}
                     className="flex-1 text-slate-600 font-medium py-3 px-4 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm"
                   >
                     <Printer className="w-4 h-4" /> Drukuj / Zapisz jako PDF
                   </button>
               </div>
               <p className="text-xs text-slate-400 mt-2">Aby zapisać PDF z polskimi znakami, wybierz opcję "Zapisz jako PDF" w oknie drukowania.</p>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Finalizacja Zamówienia</h1>
          <p className="text-slate-600 mt-2">Wybierz plan, opcje dodatkowe i metodę płatności.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Left Column: Plan Selection & Summary */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4 uppercase text-sm tracking-wider">Wybierz Pakiet</h3>
              
              {/* Plan Switcher */}
              <div className="space-y-3">
                {Object.entries(plans).map(([key, plan]) => (
                  <div 
                    key={key}
                    onClick={() => setSelectedPlan(key)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedPlan === key 
                        ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-semibold text-xs ${selectedPlan === key ? 'text-blue-800' : 'text-slate-700'}`}>
                        {plan.name}
                      </span>
                      {selectedPlan === key && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div className="text-base font-bold text-slate-900">
                      {plan.price} zł
                      {(plan as any).period && <span className="text-xs font-normal text-slate-500">{(plan as any).period}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Express Option */}
              {selectedPlan !== 'freemium' && !selectedPlan.startsWith('sub') && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                      <div 
                        onClick={() => setIsExpress(!isExpress)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                            isExpress ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' : 'border-slate-200'
                        }`}
                      >
                          <div>
                              <div className="flex items-center gap-1 font-bold text-sm text-slate-800"><Zap className="w-3 h-3 text-orange-500"/> Express 24h</div>
                              <div className="text-xs text-slate-500">Priorytetowa obsługa</div>
                          </div>
                          <div className="text-sm font-bold text-orange-600">+99 zł</div>
                      </div>
                  </div>
              )}

              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex justify-between text-slate-600 mb-2 text-sm">
                  <span>Wartość netto:</span>
                  <span>{(finalPrice / 1.23).toFixed(2)} zł</span>
                </div>
                <div className="flex justify-between text-slate-600 mb-4 text-sm">
                  <span>VAT (23%):</span>
                  <span>{(finalPrice - (finalPrice / 1.23)).toFixed(2)} zł</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-slate-900 pt-4 border-t border-slate-100">
                  <span>Do zapłaty:</span>
                  <span>{finalPrice} zł</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-blue-800 font-semibold mb-1">Gwarancja Bezpieczeństwa</p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Płatności szyfrowane SSL. Obsługa subskrypcji przez Stripe. Płatności PL przez PayU/BLIK.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Methods & Details */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Metoda Płatności</h3>
              </div>
              
              {currentPlan.price === 0 ? (
                  <div className="p-6 text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Check className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">Pakiet Darmowy</h3>
                      <p className="text-slate-600 mb-6">Nie wymaga podawania danych płatniczych. Wymagana zgoda marketingowa.</p>
                  </div>
              ) : (
                <>
                  <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <button onClick={() => setPaymentMethod('blik')} className={`flex flex-col items-center justify-center p-3 border rounded-xl h-20 ${paymentMethod === 'blik' ? 'border-black bg-slate-50 ring-1 ring-black' : 'border-slate-200 hover:border-slate-300'}`}>
                        <span className="font-black text-lg italic tracking-tighter">BLIK</span>
                        <span className="text-[10px] text-slate-500">Szybki kod</span>
                    </button>
                    <button onClick={() => setPaymentMethod('payu')} className={`flex flex-col items-center justify-center p-3 border rounded-xl h-20 ${paymentMethod === 'payu' ? 'border-green-600 bg-green-50 ring-1 ring-green-600' : 'border-slate-200 hover:border-slate-300'}`}>
                        <span className="font-bold text-green-700 text-lg">PayU</span>
                        <span className="text-[10px] text-slate-500">Przelew PL</span>
                    </button>
                    <button onClick={() => setPaymentMethod('card')} className={`flex flex-col items-center justify-center p-3 border rounded-xl h-20 ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300'}`}>
                        <CreditCard className="w-6 h-6 text-slate-700 mb-1"/>
                        <span className="text-[10px] text-slate-500">Karta</span>
                    </button>
                    <button onClick={() => setPaymentMethod('stripe')} className={`flex flex-col items-center justify-center p-3 border rounded-xl h-20 ${paymentMethod === 'stripe' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300'}`}>
                        <span className="font-bold text-indigo-700 text-lg">Stripe</span>
                        <span className="text-[10px] text-slate-500">Subskrypcje</span>
                    </button>
                    <button onClick={() => setPaymentMethod('paypal')} className={`flex flex-col items-center justify-center p-3 border rounded-xl h-20 ${paymentMethod === 'paypal' ? 'border-blue-800 bg-blue-50 ring-1 ring-blue-800' : 'border-slate-200 hover:border-slate-300'}`}>
                        <span className="font-bold text-blue-800 text-lg flex items-center gap-1"><Globe className="w-4 h-4"/> PayPal</span>
                        <span className="text-[10px] text-slate-500">Global</span>
                    </button>
                  </div>

                  {/* Dynamic Content based on payment selection */}
                  <div className="px-6 pb-6">
                    {paymentMethod === 'blik' && (
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 animate-in fade-in">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Wpisz kod BLIK</label>
                            <input type="text" maxLength={6} placeholder="000 000" className="block w-40 text-center text-lg tracking-widest rounded-md border-slate-300 shadow-sm focus:border-black focus:ring-black px-2 py-2" />
                        </div>
                    )}
                     {paymentMethod === 'card' && (
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 animate-in fade-in space-y-3">
                          <input type="text" placeholder="Numer karty" className="block w-full rounded-md border-slate-300 py-2 px-3 text-sm shadow-sm" />
                          <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="MM/YY" className="block w-full rounded-md border-slate-300 py-2 px-3 text-sm shadow-sm" />
                            <input type="text" placeholder="CVC" className="block w-full rounded-md border-slate-300 py-2 px-3 text-sm shadow-sm" />
                          </div>
                        </div>
                     )}
                  </div>
                </>
              )}
            </div>

            {/* RODO & Consents */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
               <div className="flex items-start gap-3">
                 <div className="flex h-5 items-center">
                   <input
                     id="rodo"
                     name="rodo"
                     type="checkbox"
                     checked={rodoAccepted}
                     onChange={(e) => setRodoAccepted(e.target.checked)}
                     className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                   />
                 </div>
                 <div className="text-sm">
                   <label htmlFor="rodo" className="font-medium text-slate-700 select-none cursor-pointer">
                     Akceptuję Regulamin i Politykę Prywatności
                   </label>
                   <p className="text-slate-500 mt-1">
                     Wyrażam zgodę na przetwarzanie moich danych osobowych przez Kancelarię LexPortal.
                     {selectedPlan.startsWith('sub') && " Akceptuję cykliczne obciążanie karty (obsługa przez Stripe)."}
                   </p>
                 </div>
               </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={(currentPlan.price > 0 && !paymentMethod) || !rodoAccepted || isProcessing}
              className="mt-8 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Przetwarzanie...
                </>
              ) : (
                <>
                  {currentPlan.price === 0 ? 'Aktywuj za darmo' : `Zapłać ${finalPrice} zł`}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;