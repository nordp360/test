import React, { useState } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/Home";
import Resources from "./pages/Resources";
import AIAssistant from "./pages/AIAssistant";
import DocumentAnalysis from "./pages/DocumentAnalysis";
import KnowledgeBase from "./pages/KnowledgeBase";
import ClientDashboard from "./pages/ClientDashboard";
import LawyerDashboard from "./pages/LawyerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import Cases from "./pages/Cases";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Payment from "./pages/Payment";
import Help from "./pages/Help";
import Services from "./pages/Services";
import About from "./pages/About";
import Career from "./pages/Career";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import { Terms, Privacy, GDPR } from "./pages/Legal";
import { ShieldCheck } from "lucide-react";

const ComplianceModal = () => {
  const [show, setShow] = useState(() => {
    const accepted = localStorage.getItem("lexportal_consent");
    return !accepted;
  });

  const handleAccept = () => {
    localStorage.setItem("lexportal_consent", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center pointer-events-none p-4">
      <div className="absolute inset-0 bg-black/50 pointer-events-auto backdrop-blur-sm" />
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl pointer-events-auto relative z-10 overflow-hidden animate-in slide-in-from-bottom-10">
        <div className="p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="bg-slate-900 p-3 rounded-full text-amber-500 shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Dbamy o Twoją prywatność i bezpieczeństwo
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Szanujemy Twoje dane. Zgodnie z RODO (GDPR) oraz Prawem
                Telekomunikacyjnym informujemy, że serwis LexPortal wykorzystuje
                pliki cookies w celu zapewnienia prawidłowego działania systemu,
                bezpieczeństwa sesji oraz analizy ruchu.
              </p>
              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded border border-slate-100 mb-4">
                <strong className="block mb-1 text-slate-700">
                  Kluczowe informacje:
                </strong>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Twoje dane są szyfrowane (SSL + Encryption at Rest).</li>
                  <li>Administratorem danych jest LexPortal Sp. z o.o.</li>
                  <li>
                    Masz prawo do wglądu, edycji i usunięcia swoich danych
                    (Prawo do bycia zapomnianym).
                  </li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAccept}
                  className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 flex-1"
                >
                  Akceptuję i przechodzę do serwisu
                </button>
                <Link
                  to="/privacy"
                  onClick={() => setShow(false)}
                  className="px-6 py-2.5 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors text-center"
                >
                  Polityka Prywatności
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const hasToken = Boolean(localStorage.getItem("token"));

  if (!isLoggedIn && !hasToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ThemeProvider>
        <div className="min-h-screen flex flex-col">
          <ComplianceModal />
          <Navbar />
          <main className="grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/document-analysis" element={<DocumentAnalysis />} />
              <Route path="/knowledge-base" element={<KnowledgeBase />} />
              <Route
                path="/resources"
                element={
                  <RequireAuth>
                    <Resources />
                  </RequireAuth>
                }
              />
              <Route
                path="/assistant"
                element={
                  <RequireAuth>
                    <AIAssistant />
                  </RequireAuth>
                }
              />
              <Route
                path="/cases"
                element={
                  <RequireAuth>
                    <Cases />
                  </RequireAuth>
                }
              />
              <Route path="/client-dashboard" element={<ClientDashboard />} />
              <Route path="/lawyer-dashboard" element={<LawyerDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/help" element={<Help />} />

              {/* New Content Pages */}
              <Route path="/services" element={<Services />} />
              <Route path="/services/individual" element={<Services />} />
              <Route path="/services/business" element={<Services />} />
              <Route path="/services/contracts" element={<Services />} />
              <Route path="/pricing" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/career" element={<Career />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />

              {/* Legal Pages */}
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/gdpr" element={<GDPR />} />
            </Routes>
          </main>
          <FooterWrapper />
        </div>
      </ThemeProvider>
    </HashRouter>
  );
};

const FooterWrapper: React.FC = () => {
  const location = useLocation();
  const dashboardPaths = [
    "/client-dashboard",
    "/lawyer-dashboard",
    "/admin-dashboard",
  ];
  const isDashboard = dashboardPaths.includes(location.pathname);

  if (isDashboard) return null;
  return <Footer />;
};

export default App;
