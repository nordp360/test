import React from "react";
import { Link } from "react-router-dom";
import { Scale, Phone, Mail, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-amber-500 p-2 rounded-lg group-hover:bg-amber-400 transition-colors">
                <Scale className="h-6 w-6 text-slate-900" />
              </div>
              <span className="text-2xl font-bold font-sans text-white tracking-wide">
                Lex<span className="text-amber-500">Portal</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              LexPortal to nowoczesna platforma prawna łącząca doświadczenie
              adwokatów z technologią AI. Oferujemy kompleksową obsługę prawną
              online, gwarantując bezpieczeństwo, poufność i najwyższy standard
              merytoryczny.
            </p>
            <div className="flex gap-4 pt-2">
              {/* Social Icons Placeholder */}
              <div className="w-8 h-8 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-900 transition-all flex items-center justify-center cursor-pointer">
                In
              </div>
              <div className="w-8 h-8 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-900 transition-all flex items-center justify-center cursor-pointer">
                Fb
              </div>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-white font-bold mb-6 font-sans text-lg">
              Usługi
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  to="/services/individual"
                  className="hover:text-amber-500 transition-colors"
                >
                  Dla osób fizycznych
                </Link>
              </li>
              <li>
                <Link
                  to="/services/business"
                  className="hover:text-amber-500 transition-colors"
                >
                  Dla firm
                </Link>
              </li>
              <li>
                <Link
                  to="/services/contracts"
                  className="hover:text-amber-500 transition-colors"
                >
                  Weryfikacja umów
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="hover:text-amber-500 transition-colors"
                >
                  Cennik i Pakiety
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-white font-bold mb-6 font-sans text-lg">
              Firma
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  to="/about"
                  className="hover:text-amber-500 transition-colors"
                >
                  O nas
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="hover:text-amber-500 transition-colors"
                >
                  Kariera
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="hover:text-amber-500 transition-colors"
                >
                  Blog prawniczy
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-amber-500 transition-colors"
                >
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Contact */}
          <div>
            <h3 className="text-white font-bold mb-6 font-sans text-lg">
              Bezpieczeństwo
            </h3>
            <ul className="space-y-3 text-sm mb-6">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>{" "}
                Szyfrowanie SSL 256-bit
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>{" "}
                Ochrona RODO
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>{" "}
                Płatności PayU/Stripe
              </li>
            </ul>

            <h3 className="text-white font-bold mb-4 font-sans text-lg">
              Kontakt
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 opacity-80">
                <MapPin className="w-4 h-4 text-amber-500" /> ul. Prawnicza 100,
                Warszawa
              </div>
              <div className="flex items-center gap-2 opacity-80">
                <Phone className="w-4 h-4 text-amber-500" /> +48 22 123 45 67
              </div>
              <div className="flex items-center gap-2 opacity-80">
                <Mail className="w-4 h-4 text-amber-500" /> kontakt@lexportal.pl
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            © 2026 LexPortal Sp. z o.o. | KRS: 0000000000 | NIP: 000-000-00-00
          </div>
          <div className="flex gap-6">
            <Link to="/terms" className="hover:text-white transition-colors">
              Regulamin
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Polityka Prywatności
            </Link>
            <Link to="/rodo" className="hover:text-white transition-colors">
              Klauzula RODO
            </Link>
            <Link to="/cookies" className="hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
