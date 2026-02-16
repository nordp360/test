import React from 'react';
import { ShieldCheck, FileText, Lock } from 'lucide-react';

const LegalLayout: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 text-white p-8 md:p-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/10 rounded-lg backdrop-blur">{icon}</div>
                        <h1 className="text-3xl md:text-4xl font-sans font-bold">{title}</h1>
                    </div>
                    <p className="text-slate-300 text-sm">Ostatnia aktualizacja: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="p-8 md:p-12 text-slate-800 leading-relaxed space-y-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export const Terms: React.FC = () => (
    <LegalLayout title="Regulamin Świadczenia Usług" icon={<FileText className="w-8 h-8"/>}>
        <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">§1. Postanowienia Ogólne</h2>
            <p>1. Niniejszy Regulamin określa zasady korzystania z serwisu internetowego LexPortal, dostępnego pod adresem lexportal.pl.</p>
            <p>2. Właścicielem serwisu jest LexPortal Sp. z o.o. z siedzibą w Warszawie, ul. Prawnicza 100, 00-001 Warszawa, wpisana do rejestru przedsiębiorców KRS pod numerem 0000000000, NIP: 000-000-00-00.</p>
            <p>3. Kontakt z Usługodawcą możliwy jest pod adresem e-mail: kontakt@lexportal.pl.</p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">§2. Definicje</h2>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>Serwis</strong> – platforma internetowa LexPortal.</li>
                <li><strong>Użytkownik</strong> – każda osoba fizyczna lub prawna korzystająca z Serwisu.</li>
                <li><strong>Usługa</strong> – usługa świadczona drogą elektroniczną przez Usługodawcę, w szczególności generowanie dokumentów, weryfikacja umów oraz konsultacje online.</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">§3. Rodzaje i Zakres Usług</h2>
            <p>1. Usługodawca świadczy za pośrednictwem Serwisu usługi odpłatne i nieodpłatne.</p>
            <p>2. Do usług odpłatnych należą m.in.: generowanie spersonalizowanych pism procesowych, weryfikacja umów przez prawnika, subskrypcje dla firm.</p>
            <p>3. Asystent AI służy wyłącznie do celów informacyjnych i nie stanowi porady prawnej w rozumieniu ustawy o radcach prawnych.</p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">§4. Płatności</h2>
            <p>1. Ceny usług podane w Serwisie są cenami brutto (zawierają podatek VAT).</p>
            <p>2. Płatności obsługiwane są przez zewnętrznych operatorów: PayU, Stripe oraz BLIK.</p>
            <p>3. Faktury VAT są wystawiane automatycznie i przesyłane drogą elektroniczną na adres e-mail Użytkownika.</p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">§5. Odpowiedzialność</h2>
            <p>1. Usługodawca dokłada wszelkich starań, aby generowane dokumenty były zgodne z aktualnym stanem prawnym, jednak nie ponosi odpowiedzialności za skutki ich użycia bez konsultacji z profesjonalnym pełnomocnikiem w konkretnym stanie faktycznym.</p>
        </section>
    </LegalLayout>
);

export const Privacy: React.FC = () => (
    <LegalLayout title="Polityka Prywatności i Plików Cookies" icon={<Lock className="w-8 h-8"/>}>
        <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Administrator Danych</h2>
            <p>Administratorem Twoich danych osobowych jest LexPortal Sp. z o.o. z siedzibą w Warszawie. Dbamy o bezpieczeństwo Twoich danych i stosujemy odpowiednie środki techniczne, w tym szyfrowanie SSL oraz szyfrowanie bazy danych (Encryption at Rest).</p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Cele Przetwarzania</h2>
            <p>Twoje dane przetwarzamy w celu:</p>
            <ul className="list-disc pl-5 space-y-2">
                <li>Świadczenia usług drogą elektroniczną (np. założenie konta, realizacja zamówienia).</li>
                <li>Wystawienia faktury i spełnienia obowiązków podatkowych.</li>
                <li>Marketingu bezpośredniego (newsletter) – tylko za Twoją zgodą.</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Pliki Cookies</h2>
            <p>Serwis wykorzystuje pliki cookies w celu:</p>
            <ul className="list-disc pl-5 space-y-2">
                <li>Utrzymania sesji Użytkownika (po zalogowaniu).</li>
                <li>Dostosowania zawartości Serwisu do preferencji Użytkownika.</li>
                <li>Tworzenia statystyk (Google Analytics) pomagających ulepszać Serwis.</li>
            </ul>
            <p className="mt-2">Możesz w każdej chwili zmienić ustawienia dotyczące cookies w swojej przeglądarce internetowej.</p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Odbiorcy Danych</h2>
            <p>Twoje dane mogą być przekazywane podmiotom przetwarzającym je na nasze zlecenie, np. dostawcom usług IT, biurom księgowym, operatorom płatności (Stripe, PayU).</p>
        </section>
    </LegalLayout>
);

export const GDPR: React.FC = () => (
    <LegalLayout title="Klauzula Informacyjna RODO" icon={<ShieldCheck className="w-8 h-8"/>}>
        <section>
            <p className="font-bold mb-4">Zgodnie z art. 13 ust. 1 i 2 Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO), informujemy, że:</p>
            
            <ol className="list-decimal pl-5 space-y-4">
                <li>
                    <strong>Administrator:</strong> Administratorem Pani/Pana danych osobowych jest LexPortal Sp. z o.o., ul. Prawnicza 100, 00-001 Warszawa.
                </li>
                <li>
                    <strong>Inspektor Danych:</strong> Wyznaczyliśmy Inspektora Ochrony Danych, z którym można skontaktować się pod adresem: iod@lexportal.pl.
                </li>
                <li>
                    <strong>Cel i podstawa:</strong> Dane będą przetwarzane w celu realizacji umowy o świadczenie usług drogą elektroniczną (art. 6 ust. 1 lit. b RODO) oraz wypełnienia obowiązku prawnego ciążącego na Administratorze (art. 6 ust. 1 lit. c RODO - przepisy podatkowe).
                </li>
                <li>
                    <strong>Prawa:</strong> Posiada Pani/Pan prawo dostępu do treści swoich danych oraz prawo ich sprostowania, usunięcia ("prawo do bycia zapomnianym"), ograniczenia przetwarzania, prawo do przenoszenia danych, prawo wniesienia sprzeciwu.
                </li>
                <li>
                    <strong>Skarga:</strong> Ma Pani/Pan prawo wniesienia skargi do organu nadzorczego (Prezesa Urzędu Ochrony Danych Osobowych), gdy uzna Pani/Pan, iż przetwarzanie danych osobowych narusza przepisy RODO.
                </li>
                <li>
                    <strong>Dobrowolność:</strong> Podanie danych jest dobrowolne, ale niezbędne do realizacji Usługi (np. wygenerowania umowy czy wystawienia faktury).
                </li>
            </ol>
        </section>
    </LegalLayout>
);