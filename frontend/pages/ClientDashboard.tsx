import React, { useState, useEffect, useRef } from "react";
import {
  Layout,
  Briefcase,
  Calendar,
  FileText,
  MessageSquare,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  Bell,
  User,
  Clock,
  CheckCircle,
  Plus,
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Download,
  FilePlus,
  RefreshCcw,
  HelpCircle,
  Mail,
  Phone,
  Lock,
  X,
  Image as ImageIcon,
  Send,
  Save,
  BellRing,
  ExternalLink,
  Edit,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  casesApi,
  usersApi,
  messagesApi,
  notificationsApi,
} from "../services/api";

// --- TYPES ---
interface Case {
  id: string;
  title: string;
  category: string;
  status: "W toku" | "Zakończone" | "Oczekuje" | "W Sądzie";
  progress: number;
  lastUpdate: string;
  description: string;
}

interface Invoice {
  id: string;
  date: string;
  amount: string;
  service: string;
  status: "Opłacona" | "Oczekuje";
  downloadUrl: string;
}

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  type: "meeting" | "court" | "deadline";
  description?: string;
  time?: string;
}

interface ChatMessage {
  id: number;
  sender: "user" | "lawyer";
  text: string;
  timestamp: string;
  archived?: boolean;
}

interface MailMessage {
  id: number | string;
  from: string;
  subject: string;
  date: string;
  read: boolean;
  content: string;
  archived?: boolean;
  sent?: boolean;
}

// --- MOCK DATA ---
const MOCK_CASES: Case[] = [
  {
    id: "LP/23/101",
    title: "Pozew o rozwód (bez orzekania)",
    category: "Prawo Rodzinne",
    status: "W Sądzie",
    progress: 75,
    lastUpdate: "2 dni temu",
    description: "Oczekiwanie na wyznaczenie terminu pierwszej rozprawy.",
  },
  {
    id: "LP/23/105",
    title: "Wezwanie do zapłaty - Dłużnik X",
    category: "Windykacja",
    status: "Oczekuje",
    progress: 20,
    lastUpdate: "Wczoraj",
    description: "Przygotowano draft wezwania. Wymaga akceptacji.",
  },
  {
    id: "LP/23/099",
    title: "Analiza umowy najmu",
    category: "Nieruchomości",
    status: "Zakończone",
    progress: 100,
    lastUpdate: "10.11.2023",
    description: "Opinia prawna przesłana na maila.",
  },
];

const MOCK_INVOICES: Invoice[] = [
  {
    id: "FV/23/11/05",
    date: "2023-11-05",
    amount: "299.00 PLN",
    service: "Pozew o rozwód (Draft)",
    status: "Opłacona",
    downloadUrl: "#",
  },
  {
    id: "FV/23/10/22",
    date: "2023-10-22",
    amount: "89.00 PLN",
    service: "Konsultacja AI",
    status: "Opłacona",
    downloadUrl: "#",
  },
];

const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: 1,
    title: "Spotkanie z Mecenasem",
    date: "2023-11-20",
    type: "meeting",
  },
  { id: 2, title: "Termin rozprawy", date: "2023-11-25", type: "court" },
];

const MOCK_MAIL: MailMessage[] = [
  {
    id: 1,
    from: "Mec. Anna Nowak",
    subject: "Potwierdzenie wpływu dokumentów",
    date: "Dzisiaj, 10:15",
    read: false,
    content:
      "Dzień dobry, potwierdzam otrzymanie skanów dowodu osobistego. Przystępuję do weryfikacji.",
  },
  {
    id: 2,
    from: "Kancelaria LexPortal",
    subject: "Zaproszenie na spotkanie online",
    date: "Wczoraj, 14:00",
    read: true,
    content:
      "Zapraszamy na wideokonferencję w celu omówienia szczegółów pozwu.",
  },
];

// Helper to generate hours
const HOURS_24 = Array.from(
  { length: 24 },
  (_, i) => `${i.toString().padStart(2, "0")}:00`,
);

const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<
    | "dashboard"
    | "cases"
    | "calendar"
    | "payments"
    | "settings"
    | "help"
    | "chat"
    | "mail"
  >("dashboard");
  const [cases, setCases] = useState<Case[]>([]);
  // const [isLoading, setIsLoading] = useState(true); // Removed unused
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);

  // New Case Form State
  const [newCaseData, setNewCaseData] = useState({
    title: "",
    category: "Inne",
    description: "",
  });

  // Notifications State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "Twoja sprawa LP/23/101 została zaktualizowana.",
      date: "2 godz. temu",
      unread: true,
    },
    {
      id: 2,
      text: "Nowa faktura została wystawiona.",
      date: "Wczoraj",
      unread: false,
    },
    {
      id: 3,
      text: "Mecenas Nowak przesłał wiadomość.",
      date: "Wczoraj",
      unread: true,
    },
  ]);

  // Selected Case for Preview
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  // FAQ State (Moved from render function to fix Hook error)
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Calendar State (Upgraded to match Operator panel)
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">(
    "month",
  );
  const [calendarDate, setCalendarDate] = useState(new Date(2023, 10, 15)); // Nov 15 2023 for demo
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [selectedDate, setSelectedDate] = React.useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [newEvent, setNewEvent] = React.useState({
    title: "",
    time: "09:00",
    description: "",
  });
  const [editingEventId, setEditingEventId] = useState<number | null>(null);

  // Profile State
  const [profileData, setProfileData] = useState({
    firstName: "Jan",
    lastName: "Kowalski",
    email: "jan.kowalski@example.com",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Password State
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [passMessage, setPassMessage] = useState("");
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Mail State
  const [mail, setMail] = useState<MailMessage[]>(MOCK_MAIL);
  const [selectedMailId, setSelectedMailId] = useState<number | string | null>(
    null,
  );
  const [activeMailFilter, setActiveMailFilter] = useState<
    "inbox" | "sent" | "archived"
  >("inbox");

  const [showNewMailModal, setShowNewMailModal] = useState(false);
  const [newMailData, setNewMailData] = useState({
    to: "",
    subject: "",
    content: "",
  });

  // Appointment State
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    title: "Konsultacja",
    date: "",
    time: "10:00",
    type: "online",
    notes: "",
  });

  const handleArchiveMail = (id: number | string) => {
    setMail(mail.map((m) => (m.id === id ? { ...m, archived: true } : m)));
    if (selectedMailId === id) setSelectedMailId(null);
  };

  const handleRestoreMail = (id: number | string) => {
    setMail(mail.map((m) => (m.id === id ? { ...m, archived: false } : m)));
  };

  const handleDeleteMail = (id: number | string) => {
    setMail(mail.filter((m) => m.id !== id));
    if (selectedMailId === id) setSelectedMailId(null);
  };

  const handleExportMailPDF = (message: MailMessage) => {
    alert(`Generowanie PDF dla wiadomości: ${message.subject}`);
  };

  const handleSendMail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMailData.content.trim() || !newMailData.to.trim()) return;

    try {
      // API call with placeholder receiver_id (required by backend)
      const PLACEHOLDER_RECEIVER_ID = "00000000-0000-0000-0000-000000000000";
      try {
        await messagesApi.send({
          receiver_id: PLACEHOLDER_RECEIVER_ID,
          subject: newMailData.subject,
          body: newMailData.content,
        });
      } catch (apiErr) {
        console.warn("API send warning (placeholder receiver):", apiErr);
      }

      // Proceed with UI update (simulate success for user experience)
      const newMsg: MailMessage = {
        id: Date.now(),
        from: "Ja",
        subject: newMailData.subject,
        date: "Przed chwilą",
        read: true,
        content: newMailData.content,
        archived: false,
        sent: true,
      };
      setMail([newMsg, ...mail]);
      setShowNewMailModal(false);
      setNewMailData({ to: "", subject: "", content: "" });
      setActiveMailFilter("sent");
      alert("Wiadomość została wysłana pomyślnie.");
    } catch {
      alert("Błąd wysyłania wiadomości.");
    }
  };

  const handleReply = (message: MailMessage) => {
    setNewMailData({
      to: message.from,
      subject: `Re: ${message.subject}`,
      content: `\n\n--- Oryginalna wiadomość od ${message.from} ---\n${message.content}`,
    });
    setShowNewMailModal(true);
  };

  const handleForward = (message: MailMessage) => {
    setNewMailData({
      to: "",
      subject: `Fwd: ${message.subject}`,
      content: `\n\n--- Przekazana wiadomość od ${message.from} ---\n${message.content}`,
    });
    setShowNewMailModal(true);
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentData.date) {
      alert("Proszę wybrać datę wizyty.");
      return;
    }

    const newEvent: CalendarEvent = {
      id: Date.now(),
      title: `${appointmentData.title} (${appointmentData.time})`,
      date: appointmentData.date,
      type: appointmentData.type === "court" ? "court" : "meeting", // simplify type mapping
    };

    setEvents((prev) => [...prev, newEvent]);

    alert(
      `Umówiono wizytę: ${appointmentData.title} na dzień ${appointmentData.date} o ${appointmentData.time}`,
    );
    setShowAppointmentModal(false);
    // Reset form? maybe
    // setAppointmentData({...appointmentData, date: "", notes: ""});
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEventId !== null) {
      // Update existing event
      setEvents(
        events.map((ev) =>
          ev.id === editingEventId
            ? {
                ...ev,
                title: newEvent.title,
                date: selectedDate,
                time: newEvent.time,
                description: newEvent.description,
              }
            : ev,
        ),
      );
      setEditingEventId(null);
    } else {
      // Create new event
      const newId =
        events.length > 0 ? Math.max(...events.map((e) => e.id)) + 1 : 1;
      const event: CalendarEvent = {
        id: newId,
        title: newEvent.title,
        date: selectedDate,
        time: newEvent.time,
        type: "meeting", // Default type
        description: newEvent.description,
      };
      setEvents([...events, event]);
    }
    setShowAppointmentModal(false);
    setNewEvent({ title: "", time: "09:00", description: "" });
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEventId(event.id);
    setNewEvent({
      title: event.title,
      time: event.time || "09:00",
      description: event.description || "",
    });
    setSelectedDate(event.date);
    setShowAppointmentModal(true);
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  // --- CONTACT FORM STATE ---
  const [contactForm, setContactForm] = useState({
    subject: "Błąd techniczny",
    message: "",
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Wysłano zgłoszenie:\nTemat: ${contactForm.subject}\nTreść: ${contactForm.message}`,
    );
    setContactForm({ subject: "Błąd techniczny", message: "" });
  };

  // --- HISTORY MODAL STATE ---
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Cases
      try {
        const casesData = await casesApi.list();
        setCases(casesData);
      } catch (error) {
        console.error("Failed to fetch cases:", error);
        setCases(MOCK_CASES);
      }

      // Fetch Notifications
      try {
        // Assuming notificationsApi.list() returns an array
        // We might need to type cast or map if structure differs
        const notifs = await notificationsApi.list();
        // Here we would ideally setNotifications(notifs)
        // But for safe integration with existing mock structure:
        if (Array.isArray(notifs) && notifs.length > 0) {
          // Basic mapping example (adjust based on backend response)
          const mappedNotifs = notifs.map(
            (n: {
              id: number;
              message?: string;
              text?: string;
              created_at?: string;
              read?: boolean;
            }) => ({
              id: n.id,
              text: n.message || n.text || "Powiadomienie",
              date: n.created_at
                ? new Date(n.created_at).toLocaleDateString()
                : "Dzisiaj",
              unread: !n.read,
            }),
          );
          setNotifications(mappedNotifs);
        }
      } catch (error) {
        console.warn("Failed to fetch notifications:", error);
        // Keep default mock notifications on error
      }
    };

    fetchData();
  }, []);

  // Handlers
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleExportPDF = (caseData: Case & { amount?: string }) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
          <html>
            <head>
              <title>Eksport: ${caseData.category === "Płatności" ? "Faktura" : "Sprawa"} - ${caseData.id}</title>
              <style>
                body { font-family: sans-serif; padding: 40px; }
                header { border-bottom: 2px solid #ccc; padding-bottom: 20px; margin-bottom: 30px; }
                h1 { color: #1e293b; margin: 0; }
                .meta { color: #64748b; font-size: 0.9em; margin-top: 5px; }
                .content { line-height: 1.6; }
                .label { font-weight: bold; color: #475569; width: 150px; display: inline-block; }
                .value { color: #0f172a; }
                .footer { margin-top: 60px; font-size: 0.8em; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; }
              </style>
            </head>
            <body>
              <header>
                <h1>LexPortal Raport</h1>
                <div class="meta">Data wygenerowania: ${new Date().toLocaleDateString()}</div>
              </header>
              <div class="content">
                <h2>${caseData.category === "Płatności" ? "Szczegóły Faktury" : "Szczegóły Sprawy"}</h2>
                
                <div style="margin-bottom: 10px;">
                  <span class="label">ID:</span>
                  <span class="value">${caseData.id}</span>
                </div>
                
                <div style="margin-bottom: 10px;">
                  <span class="label">Kategoria:</span>
                  <span class="value">${caseData.category}</span>
                </div>

                <div style="margin-bottom: 10px;">
                  <span class="label">Status:</span>
                  <span class="value">${caseData.status}</span>
                </div>

                <div style="margin-bottom: 10px;">
                  <span class="label">Ostatnia zmiana:</span>
                  <span class="value">${caseData.lastUpdate}</span>
                </div>

                ${
                  caseData.amount
                    ? `
                <div style="margin-bottom: 10px;">
                  <span class="label">Kwota:</span>
                  <span class="value">${caseData.amount}</span>
                </div>
                `
                    : ""
                }

                <div style="margin-top: 20px;">
                  <span class="label">Opis:</span>
                  <div class="value" style="margin-top: 5px; background: #f8fafc; padding: 10px; border-radius: 6px;">
                    ${caseData.description || caseData.title || "Brak dodatkowego opisu."}
                  </div>
                </div>

              </div>
              <div class="footer">
                &copy; ${new Date().getFullYear()} Kancelaria Prawna LexPortal. Dokument wygenerowany automatycznie.
              </div>
            </body>
          </html>
        `);
      printWindow.document.close();
      printWindow.print();
    } else {
      alert("Proszę odblokować wyskakujące okienka (pop-ups), aby pobrać PDF.");
    }
  };

  const handleDownloadFile = (fileName: string) => {
    // Simulate file download
    const blob = new Blob(
      [`Przykładowa treść dokumentu: ${fileName}\n\nWygenerowano w LexPortal.`],
      { type: "text/plain" },
    );
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName; // Force download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleGoogleSync = () => {
    window.open("https://calendar.google.com", "_blank");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await usersApi.updateProfile({
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        address: "Zaktualizowany Adres", // TODO: Add address field to UI
        pesel: "00000000000", // TODO: Add pesel field to UI
      });
      setSaveMessage("Zmiany zostały zapisane pomyślnie.");
    } catch (err: unknown) {
      setSaveMessage(
        "Błąd zapisu: " +
          (err instanceof Error ? err.message : "Nieznany błąd"),
      );
    } finally {
      setIsSavingProfile(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      setPassMessage("Hasła nie są identyczne.");
      return;
    }
    setIsChangingPass(true);
    try {
      await usersApi.changePassword({
        current_password: passwordData.current,
        new_password: passwordData.new,
      });
      setPassMessage("Hasło zostało zmienione.");
      setPasswordData({ current: "", new: "", confirm: "" });
    } catch (err: unknown) {
      setPassMessage(
        "Błąd: " + (err instanceof Error ? err.message : "Nieznany błąd"),
      );
    } finally {
      setIsChangingPass(false);
      setTimeout(() => setPassMessage(""), 3000);
    }
  };

  // --- RENDERERS ---

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in font-sans">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Dzień dobry, Janie!</h2>
          <p className="text-blue-100 max-w-xl">
            Masz 2 aktywne sprawy wymagające Twojej uwagi. Sprawdź najnowsze
            powiadomienia.
          </p>
          <button
            onClick={() => setActiveView("cases")}
            className="mt-6 bg-white text-blue-700 px-6 py-2.5 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-md"
          >
            Przejdź do spraw
          </button>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10">
          <Briefcase className="w-64 h-64 -mb-12 -mr-12 transform -rotate-12" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              Otwarte Sprawy
            </p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">
              {cases.filter((c) => c.status !== "Zakończone").length}
            </h3>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              Nadchodzące Terminy
            </p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">1</h3>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg text-orange-600">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              Nieopłacone Faktury
            </p>
            <h3 className="text-3xl font-bold text-green-600 mt-2">0</h3>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-green-600">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-lg">
            Ostatnia Aktywność
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Zobacz wszystko
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          <div className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">
                Nowa wiadomość od Mec. Nowaka
              </p>
              <p className="text-xs text-slate-500">
                Dotyczy sprawy: Pozew o rozwód • 2 godz. temu
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </div>
          <div className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
            <div className="bg-green-100 p-2 rounded-full text-green-600">
              <FileText className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">
                Wygenerowano dokument: Pozew_v1.pdf
              </p>
              <p className="text-xs text-slate-500">System • Wczoraj, 14:30</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCases = () => (
    <div className="space-y-6 animate-in fade-in font-sans">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-900">Moje Sprawy</h2>
        <button
          onClick={() => setShowNewCaseModal(true)}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-800 shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" /> Nowa Sprawa
        </button>
      </div>

      <div className="grid gap-4">
        {cases.map((c) => (
          <div
            key={c.id}
            onClick={() => setSelectedCase(c)}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                    {c.title}
                  </h3>
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded border border-slate-200">
                    {c.id}
                  </span>
                </div>
                <p className="text-sm text-slate-500">{c.category}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide 
                              ${
                                c.status === "W toku"
                                  ? "bg-blue-100 text-blue-700"
                                  : c.status === "W Sądzie"
                                    ? "bg-purple-100 text-purple-700"
                                    : c.status === "Zakończone"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-slate-100 text-slate-600"
                              }`}
              >
                {c.status}
              </span>
            </div>

            <p className="text-sm text-slate-600 mb-6 line-clamp-2">
              {c.description}
            </p>

            <div className="flex items-center justify-between mt-auto">
              <div className="flex-1 mr-8">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Postęp</span>
                  <span>{c.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${c.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Aktualizacja: {c.lastUpdate}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCalendar = () => {
    // Helper to get events for a date
    const getEventsForDate = (dateStr: string) => {
      // Use state instead of mock constant
      return events.filter((e) => e.date === dateStr);
    };

    // Helper to render Day/Week timeline cells
    const renderTimelineCell = (hour: string) => {
      // Simulating some hourly events
      return (
        <div
          key={hour}
          className="h-20 border-b border-slate-100 relative hover:bg-slate-50 transition-colors group cursor-pointer"
        >
          <span className="absolute left-2 top-2 text-[10px] text-slate-400 group-hover:text-slate-600 select-none">
            {hour}
          </span>
          <div className="ml-14 h-full py-1 pr-2 space-y-1">
            {/* Render actual events if matched by time in a real app */}
          </div>
        </div>
      );
    };

    // Calendar Logic - State and Handlers moved to top level

    return (
      <>
        {/* Add Event Modal */}
        {showAppointmentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowAppointmentModal(false)}
            ></div>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95">
              <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                <h3 className="font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-500" />{" "}
                  {editingEventId ? "Edytuj termin" : "Dodaj termin"}
                </h3>
                <button
                  onClick={() => setShowAppointmentModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddEvent} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tytuł wydarzenia
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                    placeholder="np. Spotkanie z mecenasem"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Data
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Godzina
                    </label>
                    <input
                      type="time"
                      required
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none"
                      value={newEvent.time}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, time: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Opis (opcjonalnie)
                  </label>
                  <textarea
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none resize-none"
                    rows={3}
                    value={newEvent.description}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, description: e.target.value })
                    }
                  ></textarea>
                </div>
                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAppointmentModal(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-bold shadow-lg shadow-slate-900/20"
                  >
                    Zapisz
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="space-y-6 animate-in fade-in font-sans">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Terminarz</h2>
            <div className="flex gap-2">
              <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                <button
                  onClick={() => setCalendarView("month")}
                  className={`px-4 py-1.5 text-xs font-bold rounded ${calendarView === "month" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  Miesiąc
                </button>
                <button
                  onClick={() => setCalendarView("week")}
                  className={`px-4 py-1.5 text-xs font-bold rounded ${calendarView === "week" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  Tydzień
                </button>
                <button
                  onClick={() => setCalendarView("day")}
                  className={`px-4 py-1.5 text-xs font-bold rounded ${calendarView === "day" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  Dzień
                </button>
              </div>
              <button
                onClick={() => setShowAppointmentModal(true)}
                className="bg-slate-900 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs font-bold hover:bg-slate-800 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" /> Dodaj
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-900">
                  {calendarDate.toLocaleDateString("pl-PL", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const d = new Date(calendarDate);
                      if (calendarView === "month")
                        d.setMonth(d.getMonth() - 1);
                      else if (calendarView === "week")
                        d.setDate(d.getDate() - 7);
                      else d.setDate(d.getDate() - 1);
                      setCalendarDate(d);
                    }}
                    className="p-2 hover:bg-slate-100 rounded-lg border border-slate-200"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <button
                    onClick={() => setCalendarDate(new Date(2023, 10, 15))}
                    className="px-4 py-2 hover:bg-slate-100 rounded-lg border border-slate-200 text-xs font-bold text-slate-600"
                  >
                    Dzisiaj
                  </button>
                  <button
                    onClick={() => {
                      const d = new Date(calendarDate);
                      if (calendarView === "month")
                        d.setMonth(d.getMonth() + 1);
                      else if (calendarView === "week")
                        d.setDate(d.getDate() + 7);
                      else d.setDate(d.getDate() + 1);
                      setCalendarDate(d);
                    }}
                    className="p-2 hover:bg-slate-100 rounded-lg border border-slate-200"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>

              {calendarView === "month" && (
                <div className="flex-1">
                  <div className="grid grid-cols-7 gap-2 text-center text-[10px] mb-2 text-slate-400 font-bold uppercase tracking-wider">
                    <div>Pon</div>
                    <div>Wt</div>
                    <div>Śr</div>
                    <div>Czw</div>
                    <div>Pt</div>
                    <div>Sob</div>
                    <div>Nd</div>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 35 }).map((_, i) => {
                      const date = new Date(
                        calendarDate.getFullYear(),
                        calendarDate.getMonth(),
                        1,
                      );
                      const startDay = (date.getDay() + 6) % 7;
                      date.setDate(i - startDay + 1);

                      const dateStr = date.toISOString().slice(0, 10);
                      const events = getEventsForDate(dateStr);
                      const isToday = dateStr === "2023-11-15";

                      return (
                        <div
                          key={i}
                          className={`h-24 border rounded-xl p-2 flex flex-col justify-between hover:bg-slate-50 transition-colors ${dateStr.includes("2023-11") ? (isToday ? "bg-blue-50 border-blue-200" : "bg-white border-slate-100") : "bg-slate-50 border-transparent opacity-40"}`}
                        >
                          <span
                            className={`text-xs font-bold ${isToday ? "text-blue-600" : "text-slate-700"}`}
                          >
                            {date.getDate()}
                          </span>
                          <div className="space-y-1">
                            {events.map((event, idx) => (
                              <div
                                key={idx}
                                className={`text-[9px] p-1 rounded font-bold truncate ${event.type === "court" ? "bg-red-100 text-red-700 border border-red-200" : "bg-blue-100 text-blue-700 border border-blue-200"}`}
                              >
                                {event.title}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {(calendarView === "week" || calendarView === "day") && (
                <div className="flex-1 overflow-y-auto max-h-[600px] border rounded-xl border-slate-100">
                  {calendarView === "week" ? (
                    <div className="flex flex-col min-w-[800px]">
                      <div className="grid grid-cols-8 border-b border-slate-200 sticky top-0 bg-white z-20">
                        <div className="p-2 text-[10px] text-slate-400 text-center pt-8">
                          GMT+1
                        </div>
                        {Array.from({ length: 7 }).map((_, i) => {
                          const date = new Date(calendarDate);
                          const day = date.getDay() || 7;
                          if (day !== 1)
                            date.setDate(date.getDate() - (day - 1));
                          date.setDate(date.getDate() + i);
                          const isToday =
                            date.toISOString().slice(0, 10) === "2023-11-15";
                          return (
                            <div
                              key={i}
                              className={`p-2 text-center border-l border-slate-100 ${isToday ? "bg-blue-50" : ""}`}
                            >
                              <div className="text-[10px] text-slate-500 uppercase font-bold">
                                {
                                  ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"][
                                    i
                                  ]
                                }
                              </div>
                              <div
                                className={`text-lg font-bold ${isToday ? "text-blue-600" : "text-slate-800"}`}
                              >
                                {date.getDate()}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="grid grid-cols-8">
                        <div className="border-r border-slate-100">
                          {HOURS_24.filter((_, i) => i >= 8 && i <= 20).map(
                            (h) => (
                              <div
                                key={h}
                                className="h-20 text-[10px] text-slate-400 text-center pt-2 border-b border-slate-50"
                              >
                                {h}
                              </div>
                            ),
                          )}
                        </div>
                        {Array.from({ length: 7 }).map((_, i) => {
                          const date = new Date(calendarDate);
                          const day = date.getDay() || 7;
                          if (day !== 1)
                            date.setDate(date.getDate() - (day - 1));
                          date.setDate(date.getDate() + i);
                          return (
                            <div key={i} className="border-r border-slate-100">
                              {HOURS_24.filter(
                                (_, idx) => idx >= 8 && idx <= 20,
                              ).map((h) => renderTimelineCell(h))}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div className="p-4 bg-blue-50 border-b border-blue-100 text-center sticky top-0 z-20">
                        <h3 className="text-lg font-bold text-blue-900">
                          {calendarDate.toLocaleDateString("pl-PL", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </h3>
                      </div>
                      <div className="relative">
                        {HOURS_24.filter((_, i) => i >= 8 && i <= 20).map((h) =>
                          renderTimelineCell(h),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-orange-500" /> Nadchodzące
                </h3>
                <div className="space-y-4">
                  {MOCK_EVENTS.map((event) => (
                    <div
                      key={event.id}
                      className="flex gap-3 items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0 group"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${event.type === "court" ? "bg-red-500" : "bg-blue-500"}`}
                      ></div>
                      <div className="flex-1">
                        <p className="font-bold text-xs text-slate-800 group-hover:text-blue-600 transition-colors">
                          {event.title}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {event.date} • 10:00
                        </p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleGoogleSync}
                  className="w-full mt-6 bg-slate-900 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-md shadow-slate-900/10"
                >
                  <ExternalLink className="w-3 h-3" /> Synchronizuj z Google
                </button>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-xl text-white shadow-lg overflow-hidden relative">
                <div className="relative z-10">
                  <h4 className="font-bold text-sm mb-2">
                    Potrzebujesz spotkania?
                  </h4>
                  <p className="text-[10px] text-indigo-100 mb-4">
                    Umów się na konsultację online lub w biurze.
                  </p>
                  <button
                    onClick={() => setShowAppointmentModal(true)}
                    className="w-full bg-white text-indigo-700 py-2 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors"
                  >
                    Umów konsultację
                  </button>
                </div>
                <Calendar className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 transform -rotate-12" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderPayments = () => (
    <div className="space-y-6 animate-in fade-in font-sans">
      <h2 className="text-2xl font-bold text-slate-900">Płatności i Faktury</h2>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Numer Faktury</th>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Usługa</th>
              <th className="px-6 py-4">Kwota</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Akcja</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_INVOICES.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono font-medium text-slate-700">
                  {inv.id}
                </td>
                <td className="px-6 py-4 text-slate-600">{inv.date}</td>
                <td className="px-6 py-4 text-slate-800">{inv.service}</td>
                <td className="px-6 py-4 font-bold text-slate-900">
                  {inv.amount}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() =>
                      handleExportPDF({
                        id: inv.id,
                        title: `Faktura ${inv.id}`,
                        status:
                          inv.status === "Oczekuje" ? "Oczekuje" : "Zakończone",
                        category: "Płatności",
                        lastUpdate: inv.date,
                        progress: 100,
                        description: `Faktura za usługę: ${inv.service}`,
                      })
                    }
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 ml-auto font-bold uppercase text-[10px]"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-4xl animate-in fade-in font-sans">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Ustawienia Konta
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Data */}
        <form
          onSubmit={handleSaveProfile}
          className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6"
        >
          <div>
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" /> Dane Profilowe
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Imię
                </label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      firstName: e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Nazwisko
                </label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) =>
                    setProfileData({ ...profileData, lastName: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {saveMessage && (
            <div className="p-3 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100 flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4" /> {saveMessage}
            </div>
          )}

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-sm text-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isSavingProfile ? (
                <RefreshCcw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSavingProfile ? "Zapisywanie..." : "Zapisz Zmiany"}
            </button>
          </div>
        </form>

        {/* Notifications & Security */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BellRing className="w-5 h-5" /> Powiadomienia
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Powiadomienia Email
                  </p>
                  <p className="text-xs text-slate-500">
                    Otrzymuj aktualizacje o statusie spraw.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Powiadomienia SMS
                  </p>
                  <p className="text-xs text-slate-500">
                    Alerty o pilnych terminach (płatne).
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Newsletter
                  </p>
                  <p className="text-xs text-slate-500">
                    Informacje o zmianach w prawie.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" /> Bezpieczeństwo
            </h3>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="Obecne hasło"
                value={passwordData.current}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, current: e.target.value })
                }
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="password"
                placeholder="Nowe hasło"
                value={passwordData.new}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, new: e.target.value })
                }
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="password"
                placeholder="Powtórz nowe hasło"
                value={passwordData.confirm}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirm: e.target.value })
                }
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
              {passMessage && (
                <div
                  className={`p-2 rounded text-xs font-bold ${passMessage.includes("Błąd") || passMessage.includes("nie") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
                >
                  {passMessage}
                </div>
              )}
              <button
                onClick={handleChangePassword}
                disabled={isChangingPass}
                className="w-full border border-slate-300 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 mt-2 disabled:opacity-50"
              >
                {isChangingPass ? "Zmienianie..." : "Zmień Hasło"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHelp = () => {
    const faqs = [
      // SEKCOJA 1: Obsługa serwisu (6 pozycji)
      {
        q: "Jak opłacić fakturę?",
        a: 'Fakturę możesz opłacić w zakładce "Płatności" korzystając z szybkich płatności PayU, BLIK lub karty kredytowej. Status płatności aktualizuje się natychmiastowo.',
      },
      {
        q: "Czy moje dokumenty są bezpieczne?",
        a: "Tak, wszystkie dokumenty są szyfrowane (AES-256) i przechowywane na zabezpieczonych serwerach zgodnie z RODO. Dostęp do nich masz tylko Ty i Twój operator prawny.",
      },
      {
        q: "Jak dodać nową sprawę?",
        a: 'Aby dodać nową sprawę, kliknij przycisk "Nowa Sprawa" w prawym górnym rogu ekranu w zakładce Sprawy lub Dashboard. Wypełnij krótki formularz, a my zajmiemy się resztą.',
      },
      {
        q: "Gdzie znajdę dane kontaktowe do prawnika?",
        a: 'Dane kontaktowe Twojego opiekuna prawnego znajdują się po lewej stronie w sekcji "Kontakt z Operatorem" lub na dole tej strony pomocowej.',
      },
      {
        q: "Jak zmienić hasło?",
        a: 'Wysoko w ustawieniach konta (zakładka "Ustawienia") znajdziesz sekcję "Bezpieczeństwo", gdzie możesz zmienić swoje hasło.',
      },
      {
        q: "Jak sprawdzić status sprawy?",
        a: 'Przejdź do zakładki "Moje Sprawy". Każda sprawa ma przypisany status (np. "W toku", "W Sądzie"). Kliknij na sprawę, aby zobaczyć szczegóły.',
      },

      // SEKCJA 2: Postępowanie cywilne i egzekucyjne (10 pozycji)
      {
        q: "Otrzymałem nakaz zapłaty, co mam zrobić?",
        a: "Kluczowe jest dotrzymanie terminu 14 dni na wniesienie sprzeciwu. Rekomendujemy niezwłoczne zamówienie 'Analizy nakazu zapłaty', aby sprawdzić zasadność roszczenia.",
      },
      {
        q: "Ile mam czasu na złożenie sprzeciwu od nakazu zapłaty?",
        a: "Standardowo masz 14 dni od dnia doręczenia przesyłki z sądu. Jeśli termin minie, nakaz uprawomocni się i trafi do komornika.",
      },
      {
        q: "Czym różni się analiza standardowa od Express?",
        a: "Analiza standardowa jest realizowana w 12-48h. Wariant Express (6h) jest przeznaczony dla spraw, gdzie termin procesowy upływa wkrótce.",
      },
      {
        q: "Co to jest tytuł wykonawczy i dlaczego jest ważny?",
        a: "To tytuł egzekucyjny (np. wyrok) opatrzony klauzulą wykonalności. Dopiero on pozwala komornikowi na rozpoczęcie realnej egzekucji długu.",
      },
      {
        q: "Co zrobić, gdy komornik zajął moje konto?",
        a: "Należy sprawdzić podstawę działania komornika. Jeśli nie wiedziałeś o długu, możemy pomóc w zawieszeniu egzekucji i przywróceniu terminu do obrony.",
      },
      {
        q: "Jak sprawdzić, czy dług nie jest przedawniony?",
        a: "Przedawnienie zależy od rodzaju roszczenia (zwykle 3 lub 6 lat). Zamów analizę dokumentu, a nasz prawnik oceni, czy możesz podnieść zarzut przedawnienia.",
      },
      {
        q: "Otrzymałem wezwanie na świadka - czy muszę się stawić?",
        a: "Tak, stawiennictwo jest obowiązkowe pod rygorem grzywny. Jeśli masz ważny powód do odmowy zeznań (np. bliska rodzina), poinformuj o tym sąd wcześniej.",
      },
      {
        q: "Czym jest wniosek o uzasadnienie wyroku?",
        a: "To pismo, które musisz złożyć w ciągu 7 dni od ogłoszenia wyroku, aby dowiedzieć się, dlaczego sąd wydał taką decyzję. Jest to niezbędne do złożenia apelacji.",
      },
      {
        q: "Czy mogę starać się o zwolnienie z kosztów sądowych?",
        a: "Tak, jeśli wykażesz, że nie jesteś w stanie ich ponieść bez uszczerbku dla utrzymania siebie i rodziny. Pomagamy przygotować odpowiednie oświadczenie o stanie majątkowym.",
      },
      {
        q: "Co zrobić, gdy pismo z sądu przyszło na mój stary adres?",
        a: "Może to być podstawa do uchylenia nakazu zapłaty. Skontaktuj się z nami w celu przygotowania wniosku o prawidłowe doręczenie i uchylenie klauzuli wykonalności.",
      },

      // SEKCJA 3: Prawo Rodzinne (6 pozycji)
      {
        q: "Czy pomagacie w sprawach o alimenty?",
        a: "Tak, przygotowujemy pozwy o alimenty, odpowiedzi na pozew oraz wnioski o podwyższenie lub obniżenie kwoty świadczenia.",
      },
      {
        q: "Jakie dokumenty przygotować do analizy rozwodu?",
        a: "Przygotuj skan aktu małżeństwa, akty urodzenia dzieci oraz dokumenty potwierdzające koszty utrzymania lub winę współmałżonka.",
      },
      {
        q: "Jak uregulować kontakty z dzieckiem?",
        a: "Można to zrobić polubownie przez mediację lub sądowo. Przygotowujemy wnioski o ustalenie harmonogramu spotkań, uwzględniające dobro dziecka.",
      },
      {
        q: "Co to jest podział majątku po rozwodzie?",
        a: "To proces rozdzielenia wspólnych dóbr nabytych w trakcie małżeństwa. Możemy przeanalizować skład majątku i zaproponować sprawiedliwy sposób jego podziału.",
      },
      {
        q: "Czym jest ograniczenie władzy rodzicielskiej?",
        a: "To decyzja sądu ograniczająca decyzyjność jednego z rodziców w określonych sferach (np. edukacja, leczenie). Pomagamy ocenić przesłanki do takiego wniosku.",
      },
      {
        q: "Czy mediacja rodzinna jest obowiązkowa?",
        a: "Sąd może skierować strony do mediacji, ale udział w niej jest dobrowolny. Mediacja często pozwala na szybsze i tańsze zakończenie sporu niż proces sądowy.",
      },

      // SEKCJA 4: Nieruchomości i Lokale (6 pozycji)
      {
        q: "Czy zajmujecie się sprawami o eksmisję?",
        a: "Tak, analizujemy umowy najmu i pomagamy przejść przez procedurę wypowiedzenia oraz przygotowania pozwu o opróżnienie lokalu.",
      },
      {
        q: "Jak sprawdzić wpisy w Księdze Wieczystej?",
        a: "Analizujemy treść Ksiąg Wieczystych pod kątem obciążeń, hipotek oraz praw osób trzecich przed zakupem nieruchomości.",
      },
      {
        q: "Co daje umowa najmu okazjonalnego?",
        a: "Zapewnia właścicielowi łatwiejszą ścieżkę eksmisji lokatora, który nie chce opuścić mieszkania, dzięki poddaniu się przez najemcę rygorowi egzekucji.",
      },
      {
        q: "Kupiłem nieruchomość z wadami - co mogę zrobić?",
        a: "Możesz skorzystać z rękojmi. Pomagamy przygotować wezwanie do obniżenia ceny lub usunięcia wad, a w skrajnych przypadkach – oświadczenie o odstąpieniu od umowy.",
      },
      {
        q: "Jak wypowiedzieć umowę najmu?",
        a: "Wypowiedzenie musi być skuteczne pod kątem prawnym i terminowym. Analizujemy zapisy Twojej umowy, aby wskazać najbezpieczniejszy tryb zakończenia współpracy.",
      },
      {
        q: "Co zrobić, gdy sąsiad narusza moją własność?",
        a: "W sprawach o tzw. immisje (hałas, zalewanie, naruszenie granic) przygotowujemy wezwania do zaprzestania naruszeń oraz pozwy o ochronę własności.",
      },

      // SEKCJA 5: Praca i Biznes (8 pozycji)
      {
        q: "Zostałem niesłusznie zwolniony - jak możecie pomóc?",
        a: "Przygotowujemy odwołania do sądu pracy (termin to 21 dni). Sprawdzamy, czy przyczyna wypowiedzenia była konkretna i zgodna z prawem.",
      },
      {
        q: "Co zrobić, gdy pracodawca mnie mobbinguje?",
        a: "Oferujemy analizę dowodów (maile, smsy) i przygotowanie strategii wystąpienia o odszkodowanie lub zadośćuczynienie za nękanie w pracy.",
      },
      {
        q: "Chcę zarejestrować spółkę - od czego zacząć?",
        a: "W sekcji 'Dla Biznesu' wybierz rejestrację spółki. Pomożemy Ci przejść przez system S24 lub przygotować dokumenty do notariusza.",
      },
      {
        q: "Czy moje działania w sieci są zgodne z RODO?",
        a: "Oferujemy audyt i przygotowanie dokumentacji: polityki prywatności, rejestrów przetwarzania oraz umów powierzenia danych.",
      },
      {
        q: "Czym skutkuje 'dyscyplinarka' (Art. 52 KP)?",
        a: "To natychmiastowe rozwiązanie umowy z winy pracownika. Jeśli uważasz, że zarzuty są bezpodstawne, pomagamy walczyć o przywrócenie do pracy lub odszkodowanie.",
      },
      {
        q: "Czy zakaz konkurencji po ustaniu pracy jest płatny?",
        a: "Tak, jeśli pracodawca chce, abyś nie pracował u konkurencji po odejściu, musi wypłacać Ci odszkodowanie (min. 25% wynagrodzenia). Analizujemy takie umowy.",
      },
      {
        q: "Jakie są korzyści z audytu umowy B2B?",
        a: "Weryfikujemy kary umowne, okresy wypowiedzenia oraz zapisy o własności intelektualnej, chroniąc interesy Twojej firmy.",
      },
      {
        q: "Czy prowadzicie sprawy przeciwko ZUS?",
        a: "Tak, przygotowujemy odwołania od decyzji ZUS w sprawach o zasiłki, renty czy kwestionowanie podlegania ubezpieczeniom.",
      },

      // SEKCJA 6: Pozostałe (4 pozycje)
      {
        q: "Czy analiza dokumentu to to samo co porada prawna?",
        a: "Analiza to merytoryczne omówienie dokumentu i wskazanie ryzyk. W sprawach skomplikowanych raport zawiera rekomendację dalszej konsultacji.",
      },
      {
        q: "Jak wgrać pliki, jeśli mam tylko zdjęcia?",
        a: "Możesz dodać pliki JPG lub PNG. Upewnij się, że tekst jest czytelny i dobrze oświetlony, aby algorytmy i prawnik mogli poprawnie odczytać treść.",
      },
      {
        q: "Gdzie znajdę gotowe wzory pism?",
        a: "Wzory pism (np. sprzeciwu) są dołączane bezpłatnie do każdej zamówionej i opłaconej analizy prawnej, dopasowanej do Twojego przypadku.",
      },
      {
        q: "Czy mogę skonsultować się z prawnikiem telefonicznie?",
        a: "Tak, po otrzymaniu analizy możesz dokupić usługę 'Konsultacja', aby omówić raport z prawnikiem podczas rozmowy telefonicznej.",
      },
    ];

    return (
      <div className="space-y-8 animate-in fade-in max-w-5xl mx-auto font-sans">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Centrum Pomocy</h2>
          <p className="text-slate-500">
            Znajdź odpowiedzi na najczęstsze pytania lub skontaktuj się z nami
            bezpośrednio.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* FAQ */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2 mb-4">
              <HelpCircle className="w-5 h-5 text-blue-600" /> Najczęstsze
              Pytania
            </h3>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:border-blue-200 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-4 text-left group"
                >
                  <span className="font-bold text-sm text-slate-700 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-sm text-slate-600 bg-slate-50 border-t border-slate-100 animate-in slide-in-from-top-2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2 mb-6">
              <Mail className="w-5 h-5 text-blue-600" /> Formularz Kontaktowy
            </h3>
            <form className="space-y-4" onSubmit={handleContactSubmit}>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">
                  Temat
                </label>
                <select
                  value={contactForm.subject}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, subject: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none bg-white font-medium text-slate-700"
                >
                  <option>Błąd techniczny</option>
                  <option>Pytanie o fakturę</option>
                  <option>Problem z dostępem</option>
                  <option>Inne</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">
                  Wiadomość
                </label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none h-32 resize-none"
                  placeholder="Opisz swój problem lub pytanie..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
              >
                <Send className="w-4 h-4" /> Wyślij Wiadomość
              </button>
            </form>
          </div>
        </div>

        {/* Contact Info Chips */}
        <div className="grid md:grid-cols-3 gap-4 pt-8 border-t border-slate-200">
          <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4 shadow-sm group hover:border-blue-200 transition-all">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <Phone className="w-5 h-5 text-blue-600 group-hover:text-white" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Infolinia
              </p>
              <p className="text-sm font-bold text-slate-900">
                +48 22 123 45 67
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4 shadow-sm group hover:border-indigo-200 transition-all">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
              <Mail className="w-5 h-5 text-indigo-600 group-hover:text-white" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Email
              </p>
              <p className="text-sm font-bold text-slate-900">
                pomoc@lexportal.pl
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4 shadow-sm group hover:border-orange-200 transition-all">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
              <Clock className="w-5 h-5 text-orange-600 group-hover:text-white" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Dostępność
              </p>
              <p className="text-sm font-bold text-slate-900">Pon-Pt, 08 - 18</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMail = () => {
    const selectedMail = mail.find((m) => m.id === selectedMailId);
    const filteredMail = mail.filter((m) => {
      if (activeMailFilter === "archived") return m.archived;
      if (activeMailFilter === "sent") return m.sent && !m.archived;
      return !m.archived && !m.sent;
    });

    return (
      <div className="h-[calc(100vh-140px)] flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in font-sans">
        {/* Mail Sidebar */}
        <div className="w-64 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-100">
            <button
              onClick={() => {
                setNewMailData({ to: "", subject: "", content: "" });
                setShowNewMailModal(true);
              }}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Nowa wiadomość
            </button>
          </div>
          <nav className="flex-1 p-2 space-y-1">
            <button
              onClick={() => setActiveMailFilter("inbox")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${activeMailFilter === "inbox" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"}`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" /> Odebrane
              </div>
              {mail.filter((m) => !m.read && !m.archived && !m.sent).length >
                0 && (
                <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {mail.filter((m) => !m.read && !m.archived && !m.sent).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveMailFilter("sent")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${activeMailFilter === "sent" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"}`}
            >
              <Send className="w-4 h-4" /> Wysłane
            </button>
            <button
              onClick={() => setActiveMailFilter("archived")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${activeMailFilter === "archived" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"}`}
            >
              <Clock className="w-4 h-4" /> Archiwum
            </button>
          </nav>
        </div>

        {/* Mail List */}
        <div
          className={`flex-1 flex flex-col min-w-0 ${selectedMailId ? "hidden md:flex" : "flex"}`}
        >
          <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Szukaj w poczcie..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {filteredMail.length > 0 ? (
              filteredMail.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMailId(m.id)}
                  className={`p-4 cursor-pointer hover:bg-blue-50/30 transition-colors flex items-start gap-4 ${!m.read ? "bg-blue-50/50" : ""} ${selectedMailId === m.id ? "border-l-4 border-blue-600 bg-blue-50/80" : "border-l-4 border-transparent"}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${!m.read ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"}`}
                  >
                    {m.from.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4
                        className={`text-sm truncate ${!m.read ? "font-bold text-slate-900" : "text-slate-600"}`}
                      >
                        {m.from}
                      </h4>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {m.date}
                      </span>
                    </div>
                    <p
                      className={`text-xs truncate ${!m.read ? "font-bold text-blue-600" : "text-slate-500"}`}
                    >
                      {m.subject}
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-1">
                      {m.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8">
                <Mail className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm italic">
                  Brak wiadomości w tej kategorii
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mail Content */}
        <div
          className={`flex-[1.5] flex flex-col min-w-0 bg-white border-l border-slate-100 transition-all ${selectedMailId ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0 pointer-events-none hidden md:flex"}`}
        >
          {selectedMail ? (
            <>
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedMailId(null)}
                  className="md:hidden p-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExportMailPDF(selectedMail)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Eksportuj do PDF"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  {selectedMail.archived ? (
                    <button
                      onClick={() => handleRestoreMail(selectedMail.id)}
                      className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Przywróć z archiwum"
                    >
                      <RefreshCcw className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleArchiveMail(selectedMail.id)}
                      className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Archiwizuj"
                    >
                      <Clock className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteMail(selectedMail.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Usuń permanentnie"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-8">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {selectedMail.subject}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      {selectedMail.from.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">
                        {selectedMail.from}
                      </p>
                      <p className="text-xs text-slate-500">
                        Do: ja@example.com • {selectedMail.date}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed">
                  {selectedMail.content.split("\n").map((para, i) => (
                    <p key={i} className="mb-4">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleReply(selectedMail)}
                    className="flex-1 bg-white border border-slate-200 py-2.5 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    Odpowiedz
                  </button>
                  <button
                    onClick={() => handleForward(selectedMail)}
                    className="flex-1 bg-white border border-slate-200 py-2.5 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    Przekaż dalej
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8">
              <Mail className="w-16 h-16 mb-4 opacity-10" />
              <p className="italic">
                Wybierz wiadomość, aby przeczytać jej treść
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ChatModule = () => {
    // Use local storage to simulate "real-time" sync between tabs
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const STORAGE_KEY = "chat_history_C1"; // Simulating chat for Client C1

    // Initial Load
    useEffect(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        // Default Welcome Message
        const initial: ChatMessage[] = [
          {
            id: 1,
            sender: "lawyer",
            text: "Dzień dobry! Jestem Twoim opiekunem prawnym. W czym mogę pomóc?",
            timestamp: new Date().toLocaleString("pl-PL"),
          },
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        setMessages(initial);
      }
    }, []);

    // Polling for new messages (Simulate real-time)
    useEffect(() => {
      const interval = setInterval(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.length !== messages.length) {
            setMessages(parsed);
          }
        }
      }, 1000); // Check every second
      return () => clearInterval(interval);
    }, [messages]);

    useEffect(() => {
      chatContainerRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
      if (!input.trim()) return;
      const newMsg: ChatMessage = {
        id: Date.now(),
        sender: "user",
        text: input,
        timestamp: new Date().toLocaleString("pl-PL"),
      };
      const updated = [...messages, newMsg];
      setMessages(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setInput("");
    };

    const saveChat = () => {
      const content = messages
        .map(
          (m) =>
            `[${m.timestamp}] ${m.sender === "user" ? "Klient" : "Prawnik"}: ${m.text}`,
        )
        .join("\n");
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Czat_LexPortal_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in font-sans">
        {/* Chat Header */}
        <div className="bg-slate-900 p-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-bold">
                AN
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
            </div>
            <div>
              <h3 className="font-bold text-sm">Mec. Anna Nowak</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Szyfrowane E2EE
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={saveChat}
              className="p-2 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white"
              title="Zapisz rozmowę"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`p-3 rounded-2xl text-sm shadow-sm ${
                    m.sender === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}
          <div ref={chatContainerRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <div className="flex gap-2 items-end">
            <button className="p-3 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
              <FilePlus className="w-5 h-5" />
            </button>
            <div className="flex-1 bg-slate-100 rounded-xl px-4 py-2 border border-transparent focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  (e.preventDefault(), sendMessage())
                }
                placeholder="Napisz wiadomość do prawnika..."
                className="w-full bg-transparent border-none outline-none text-sm resize-none max-h-24 py-1"
                rows={1}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    const newCase: Case = {
      id: `LP/23/${100 + cases.length + 5}`,
      title: newCaseData.title,
      category: newCaseData.category,
      status: "Oczekuje",
      progress: 0,
      lastUpdate: "Przed chwilą",
      description: newCaseData.description,
    };
    setCases([newCase, ...cases]);
    setShowNewCaseModal(false);
    setNewCaseData({ title: "", category: "Inne", description: "" });
    setActiveView("cases");
  };

  // --- MODALS RENDER ---
  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      {/* ... Sidebar and Main Content ... */}

      {/* EXISTING CONTENT (Sidebar + Main) */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 shadow-2xl fixed h-full z-20`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/50 bg-slate-950">
          {sidebarOpen ? (
            <span className="text-white font-sans font-bold text-lg tracking-wide flex items-center gap-2">
              <Layout className="w-5 h-5 text-amber-500" /> Panel Klienta
            </span>
          ) : (
            <Layout className="w-6 h-6 text-amber-500 mx-auto" />
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-500 hover:text-white lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-6 space-y-1 px-3">
          <NavItem
            icon={<Layout className="w-5 h-5" />}
            label="Pulpit"
            active={activeView === "dashboard"}
            onClick={() => setActiveView("dashboard")}
            expanded={sidebarOpen}
          />
          <NavItem
            icon={<Briefcase className="w-5 h-5" />}
            label="Moje Sprawy"
            active={activeView === "cases"}
            onClick={() => setActiveView("cases")}
            expanded={sidebarOpen}
          />
          <NavItem
            icon={<Mail className="w-5 h-5" />}
            label="Poczta"
            active={activeView === "mail"}
            onClick={() => setActiveView("mail")}
            expanded={sidebarOpen}
          />
          <NavItem
            icon={<MessageSquare className="w-5 h-5" />}
            label="Bezpieczny Czat"
            active={activeView === "chat"}
            onClick={() => setActiveView("chat")}
            expanded={sidebarOpen}
          />
          <NavItem
            icon={<Calendar className="w-5 h-5" />}
            label="Terminarz"
            active={activeView === "calendar"}
            onClick={() => setActiveView("calendar")}
            expanded={sidebarOpen}
          />
          <NavItem
            icon={<CreditCard className="w-5 h-5" />}
            label="Płatności"
            active={activeView === "payments"}
            onClick={() => setActiveView("payments")}
            expanded={sidebarOpen}
          />
          <NavItem
            icon={<Settings className="w-5 h-5" />}
            label="Ustawienia"
            active={activeView === "settings"}
            onClick={() => setActiveView("settings")}
            expanded={sidebarOpen}
          />
          <NavItem
            icon={<HelpCircle className="w-5 h-5" />}
            label="Pomoc"
            active={activeView === "help"}
            onClick={() => setActiveView("help")}
            expanded={sidebarOpen}
          />
        </nav>

        <div className="p-4 border-t border-slate-800/50 bg-slate-950">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-red-900/30 hover:text-red-400 transition-all text-red-500"
          >
            <LogOut className="w-5 h-5" />{" "}
            {sidebarOpen && (
              <span className="text-sm font-medium">Wyloguj</span>
            )}
          </button>
        </div>
      </aside>

      <main
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}
      >
        {/* Header and Content */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shadow-sm sticky top-0 z-10">
          <div>
            <h2 className="text-slate-900 font-bold text-lg">
              {activeView === "dashboard"
                ? "Pulpit"
                : activeView === "cases"
                  ? "Twoje Sprawy"
                  : activeView === "chat"
                    ? "Czat z Prawnikiem"
                    : activeView.charAt(0).toUpperCase() + activeView.slice(1)}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.some((n) => n.unread) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-top-2 z-50">
                  <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                    <h4 className="font-bold text-sm">Powiadomienia</h4>
                    <button
                      onClick={() =>
                        setNotifications(
                          notifications.map((n) => ({ ...n, unread: false })),
                        )
                      }
                      className="text-[10px] text-slate-400 hover:text-white uppercase tracking-wider font-bold"
                    >
                      Oznacz jako przeczytane
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${n.unread ? "bg-blue-50/50" : ""}`}
                        >
                          <p className="text-sm text-slate-800 leading-snug">
                            {n.text}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1">
                            {n.date}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-500 text-sm italic">
                        Brak nowych powiadomień
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                    <button className="text-xs text-blue-600 font-bold hover:underline">
                      Zobacz wszystkie
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">Jan Kowalski</p>
                <p className="text-xs text-slate-500">Klient Indywidualny</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                JK
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeView === "dashboard" && renderDashboard()}
          {activeView === "cases" && renderCases()}
          {activeView === "calendar" && renderCalendar()}
          {activeView === "payments" && renderPayments()}
          {activeView === "settings" && renderSettings()}
          {activeView === "help" && renderHelp()}
          {activeView === "chat" && <ChatModule />}
          {activeView === "mail" && renderMail()}
        </div>
      </main>

      {/* MODALS */}

      {/* New Mail Modal */}
      {showNewMailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowNewMailModal(false)}
          ></div>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-in zoom-in-95">
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-500" /> Nowa Wiadomość
              </h3>
              <button
                onClick={() => setShowNewMailModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSendMail} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Odbiorca
                </label>
                <input
                  type="text"
                  value={newMailData.to}
                  onChange={(e) =>
                    setNewMailData({ ...newMailData, to: e.target.value })
                  }
                  placeholder="np. Mec. Anna Nowak"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Temat
                </label>
                <input
                  type="text"
                  value={newMailData.subject}
                  onChange={(e) =>
                    setNewMailData({ ...newMailData, subject: e.target.value })
                  }
                  placeholder="Temat wiadomości"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Treść
                </label>
                <textarea
                  value={newMailData.content}
                  onChange={(e) =>
                    setNewMailData({ ...newMailData, content: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none h-48 resize-none"
                  placeholder="Treść wiadomości..."
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewMailModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-sm flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Wyślij
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAppointmentModal(false)}
          ></div>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in zoom-in-95">
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-500" /> Umów Konsultację
              </h3>
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleBookAppointment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Rodzaj wizyty
                </label>
                <select
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={appointmentData.type}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      type: e.target.value as "meeting" | "court",
                    })
                  }
                >
                  <option value="meeting">Spotkanie Online</option>
                  <option value="court">Wizyta w Kancelarii</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Data
                </label>
                <input
                  type="date"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={appointmentData.date}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      date: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Godzina
                </label>
                <input
                  type="time"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={appointmentData.time}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      time: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAppointmentModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-sm"
                >
                  Potwierdź rezerwację
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Case Modal - Already Defined in code, just kept here implicitly by not modifying it if it's outside the range I replaced. NO, I replaced the whole return. I need to include it. */}
      {showNewCaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowNewCaseModal(false)}
          ></div>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in zoom-in-95">
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-500" /> Utwórz nową
                sprawę
              </h3>
              <button
                onClick={() => setShowNewCaseModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCase} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tytuł sprawy
                </label>
                <input
                  type="text"
                  required
                  placeholder="np. Pozew o zapłatę od X"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newCaseData.title}
                  onChange={(e) =>
                    setNewCaseData({ ...newCaseData, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Kategoria
                </label>
                <select
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={newCaseData.category}
                  onChange={(e) =>
                    setNewCaseData({ ...newCaseData, category: e.target.value })
                  }
                >
                  <option>Inne</option>
                  <option>Prawo Rodzinne</option>
                  <option>Prawo Pracy</option>
                  <option>Nieruchomości</option>
                  <option>Windykacja</option>
                  <option>Spadki</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Krótki opis
                </label>
                <textarea
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                  placeholder="Opisz czego dotyczy sprawa..."
                  value={newCaseData.description}
                  onChange={(e) =>
                    setNewCaseData({
                      ...newCaseData,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewCaseModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-sm"
                >
                  Utwórz sprawę
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Case Details Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setSelectedCase(null)}
          ></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-in zoom-in-95 font-sans">
            <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
              <div>
                <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest block mb-1">
                  Szczegóły Sprawy
                </span>
                <h3 className="font-bold text-xl">{selectedCase.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                    ID
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedCase.id}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                    Status
                  </p>
                  <p className="text-sm font-semibold text-blue-600">
                    {selectedCase.status}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                    Kategoria
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedCase.category}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                    Postęp
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedCase.progress}%
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2 underline underline-offset-4 decoration-blue-500 decoration-2">
                  Opis Sprawy
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed bg-blue-50/30 p-4 rounded-xl border border-blue-50/50">
                  {selectedCase.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-3">
                    Ostatnie dokumenty
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-red-500" />
                        <span className="text-xs font-medium text-slate-700">
                          Wniosek_v1.pdf
                        </span>
                      </div>
                      <button
                        onClick={() => handleDownloadFile("Wniosek_v1.pdf")}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-all"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <ImageIcon className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-medium text-slate-700">
                          Dowod_osobisty.jpg
                        </span>
                      </div>
                      <button
                        onClick={() => handleDownloadFile("Dowod_osobisty.jpg")}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-all"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-3">
                    Kontakt ze sprawą
                  </h4>
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <p className="text-xs text-indigo-900 font-bold mb-1">
                      Mec. Anna Nowak
                    </p>
                    <p className="text-[10px] text-indigo-700 mb-3">
                      Główny opiekun prawny
                    </p>
                    <button
                      onClick={() => (
                        setSelectedCase(null),
                        setActiveView("chat")
                      )}
                      className="w-full bg-white text-indigo-700 py-2 rounded-lg text-xs font-bold hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-center gap-2 border border-indigo-200"
                    >
                      <MessageSquare className="w-3 h-3" /> Napisz wiadomość
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={() => setShowHistoryModal(true)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
              >
                <RefreshCcw className="w-3 h-3" /> Historia zmian
              </button>
              <button
                onClick={() => handleExportPDF(selectedCase)}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 text-sm"
              >
                <Download className="w-4 h-4" /> Eksportuj do PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowHistoryModal(false)}
          ></div>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 font-sans">
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2 text-sm">
                <RefreshCcw className="w-4 h-4 text-amber-500" /> Historia Zmian
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto space-y-5">
              {[
                {
                  date: "Dzisiaj, 10:30",
                  user: "System",
                  action: "Aktualizacja statusu sprawy",
                  details: 'Status zmieniony na "W toku"',
                },
                {
                  date: "Wczoraj, 14:15",
                  user: "Mec. Anna Nowak",
                  action: "Dodano nowy dokument",
                  details: "Wniosek_v1.pdf",
                },
                {
                  date: "2023-11-10",
                  user: "Jan Kowalski",
                  action: "Utworzenie sprawy",
                  details: "Zgłoszenie nowej sprawy",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="border-l-2 border-slate-200 pl-4 py-1 relative"
                >
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white"></div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                    {item.date}
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {item.action}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {item.details}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 italic">
                    Przez: {item.user}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper for Nav Items
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  expanded: boolean;
}

const NavItem = ({ icon, label, active, onClick, expanded }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg transition-all ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "hover:bg-slate-800 hover:text-white"} ${!expanded && "justify-center"}`}
  >
    {icon} {expanded && <span className="text-sm font-medium">{label}</span>}
  </button>
);

export default ClientDashboard;
