import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { casesApi } from "../services/api";
import {
  Briefcase,
  Calendar as CalendarIcon,
  Clock,
  FileText,
  MessageSquare,
  Search,
  Filter,
  ChevronRight,
  User,
  Users,
  Plus,
  Mail,
  PenTool,
  X,
  Save,
  ShieldAlert,
  ShieldCheck,
  Send,
  FileSignature,
  Check,
  UserPlus,
  Settings,
  LogOut,
  Menu,
  MoreVertical,
  ChevronLeft,
  Trash2,
  Phone,
  Inbox,
  RefreshCw,
  Paperclip,
  Download,
  Edit,
} from "lucide-react";

// --- TYPES ---
interface Task {
  id: number;
  title: string;
  deadline: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  caseId?: string; // Link to case
  description?: string;
  startTime?: string; // HH:00 format for calendar
}

interface ChatMessage {
  id: number;
  sender: "lawyer" | "user";
  text: string;
  timestamp: string;
}

interface Case {
  id: string;
  title?: string;
  client: string;
  clientId: string;
  type: string;
  status: string;
  date: string;
  description: string;
  tasks: Task[];
  messages: ChatMessage[];
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "Aktywny" | "Nieaktywny" | "Nowy";
  casesCount: number;
  avatar: string;
  address?: string;
  pesel?: string;
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
const MOCK_MESSAGES_INITIAL: ChatMessage[] = [
  {
    id: 1,
    sender: "user",
    text: "Dzień dobry, przesłałem skany dokumentów.",
    timestamp: "15.11.2023 10:00",
  },
  {
    id: 2,
    sender: "lawyer",
    text: "Dziękuję, przystępuję do analizy.",
    timestamp: "15.11.2023 10:15",
  },
];

const MOCK_CASES_INITIAL: Case[] = [
  {
    id: "LP/2023/101",
    client: "Jan Kowalski",
    clientId: "C1",
    type: "Prawo Rodzinne",
    status: "Do akceptacji",
    date: "2023-11-15",
    description:
      "Pozew o rozwód bez orzekania o winie. Klientowi zależy na szybkim terminie. Wspólność majątkowa.",
    tasks: [
      {
        id: 1,
        title: "Weryfikacja formalna pozwu",
        deadline: "2023-11-16",
        startTime: "10:00",
        priority: "high",
        completed: false,
        caseId: "LP/2023/101",
      },
      {
        id: 2,
        title: "Kontakt w sprawie świadków",
        deadline: "2023-11-18",
        startTime: "14:00",
        priority: "medium",
        completed: false,
        caseId: "LP/2023/101",
      },
    ],
    messages: MOCK_MESSAGES_INITIAL,
  },
  {
    id: "LP/2023/098",
    client: "Anna Nowak",
    clientId: "C2",
    type: "Prawo Cywilne",
    status: "W toku",
    date: "2023-11-14",
    description: "Spór o miedzę. Analiza map geodezyjnych.",
    tasks: [],
    messages: [],
  },
  {
    id: "LP/2023/095",
    client: "TechSolutions Sp. z o.o.",
    clientId: "C3",
    type: "Obsługa B2B",
    status: "Oczekuje na klienta",
    date: "2023-11-12",
    description: "Analiza umowy wdrożeniowej IT.",
    tasks: [],
    messages: [],
  },
];

const MOCK_CLIENTS: Client[] = [
  {
    id: "C1",
    name: "Jan Kowalski",
    email: "jan.k@example.com",
    phone: "+48 500 600 700",
    status: "Aktywny",
    casesCount: 1,
    avatar: "JK",
    address: "ul. Polna 1, Warszawa",
    pesel: "80010112345",
  },
  {
    id: "C2",
    name: "Anna Nowak",
    email: "anna.n@example.com",
    phone: "+48 600 700 800",
    status: "Aktywny",
    casesCount: 1,
    avatar: "AN",
    address: "ul. Leśna 5, Kraków",
  },
  {
    id: "C3",
    name: "TechSolutions Sp. z o.o.",
    email: "kontakt@techsolutions.pl",
    phone: "+48 22 123 45 67",
    status: "Nowy",
    casesCount: 1,
    avatar: "TS",
    address: "al. Jerozolimskie 100, Warszawa",
  },
];

const MOCK_MAIL: MailMessage[] = [
  {
    id: 1,
    from: "Sąd Rejonowy Warszawa-Mokotów",
    subject: "Zawiadomienie o terminie rozprawy Sygn. akt V C 123/23",
    date: "Dzisiaj, 09:30",
    read: false,
    content:
      "Sąd Rejonowy zawiadamia o terminie rozprawy wyznaczonym na dzień 20.12.2023 r.",
  },
  {
    id: "2",
    from: "Jan Kowalski",
    subject: "Uzupełnienie dokumentacji",
    date: "Wczoraj, 18:45",
    read: true,
    content: "W załączeniu przesyłam brakujące akty stanu cywilnego.",
  },
  {
    id: "3",
    from: "Okręgowa Izba Radców Prawnych",
    subject: "Newsletter OIRP Listopad 2023",
    date: "10.11.2023",
    read: true,
    content: "Zapraszamy na szkolenia zawodowe...",
  },
];

// Helper to generate hours
const HOURS_24 = Array.from(
  { length: 24 },
  (_, i) => `${i.toString().padStart(2, "0")}:00`,
);

const LawyerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  // const { user } = useAuth(); // Unused for now
  const [activeView, setActiveView] = useState<
    "dashboard" | "cases" | "calendar" | "clients" | "mail" | "case_detail"
  >("dashboard");
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [cases, setCases] = useState<Case[]>(MOCK_CASES_INITIAL);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [mail, setMail] = useState<MailMessage[]>(MOCK_MAIL);
  // const [isLoading, setIsLoading] = useState(true); // Unused for now
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMailFilter, setActiveMailFilter] = useState<
    "inbox" | "sent" | "archived"
  >("inbox");

  // Mail State
  const [selectedMailId, setSelectedMailId] = useState<number | string | null>(
    null,
  );
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [forwardTo, setForwardTo] = useState("");
  const [forwardNote, setForwardNote] = useState("");

  // Calendar State
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">(
    "month",
  );
  const [calendarDate, setCalendarDate] = useState(new Date(2023, 10, 15)); // Fixed date for demo: Nov 15 2023
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEventData, setNewEventData] = useState({
    title: "",
    date: "",
    time: "09:00",
    description: "",
    caseId: "",
  });

  // Client State
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClientData, setNewClientData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [selectedClient, setSelectedClient] = useState<Client | null>(null); // For Details Modal

  // Editor State
  const [editorContent, setEditorContent] = useState(
    `UMOWA O ŚWIADCZENIE USŁUG PRAWNYCH\n\nZawarta w dniu 15.11.2023 pomiędzy...\n\n§4. W przypadku odstąpienia od umowy przez Klienta, zobowiązany jest on do zapłaty kary umownej w wysokości 200% wynagrodzenia.\n\n§5. Spory rozstrzyga sąd właściwy dla siedziby Wykonawcy.`,
  );

  // Modals & Sidebars State
  const [aiAnalysisVisible, setAiAnalysisVisible] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [newCaseData, setNewCaseData] = useState({
    title: "",
    client: "",
    clientId: "C1",
    type: "Inne",
    status: "W toku",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [signingStatus, setSigningStatus] = useState<
    "none" | "sending" | "sent"
  >("none");

  // Chat State
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Tab State for Case Detail
  const [caseTab, setCaseTab] = useState<"editor" | "tasks" | "chat">("editor");

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const casesData = await casesApi.list();
        setCases(casesData);
      } catch (error) {
        console.error("Failed to fetch cases:", error);
        setCases(MOCK_CASES_INITIAL);
      } finally {
        // setIsLoading(false); // Commented out since isLoading is unused
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // --- REAL-TIME CHAT SYNC ---
  useEffect(() => {
    if (
      activeView === "case_detail" &&
      caseTab === "chat" &&
      selectedCase?.clientId === "C1"
    ) {
      const STORAGE_KEY = "chat_history_C1";
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setChatMessages(JSON.parse(stored));
      } else {
        setChatMessages(selectedCase.messages);
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(selectedCase.messages),
        );
      }

      const interval = setInterval(() => {
        const currentStored = localStorage.getItem(STORAGE_KEY);
        if (currentStored) {
          const parsed = JSON.parse(currentStored);
          setChatMessages((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(parsed)) return parsed;
            return prev;
          });
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [activeView, caseTab, selectedCase]);

  useEffect(() => {
    if (activeView === "case_detail" && caseTab === "chat") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, caseTab, activeView]);

  // --- ACTIONS ---

  // Mark email as read when opened
  const handleMarkAsRead = (id: number | string) => {
    setMail(mail.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const handleArchiveMail = (id: number | string) => {
    setMail(mail.map((m) => (m.id === id ? { ...m, archived: true } : m)));
    setSelectedMailId(null);
  };

  const handleRestoreMail = (id: number | string) => {
    setMail(mail.map((m) => (m.id === id ? { ...m, archived: false } : m)));
  };

  const handleExportMailPDF = (mailMessage: MailMessage) => {
    try {
      // Create PDF content
      const pdfContent = `
OD: ${mailMessage.from}
DATA: ${mailMessage.date}
TEMAT: ${mailMessage.subject}

${mailMessage.content}
      `;

      // Create blob and download
      const blob = new Blob([pdfContent], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `email_${mailMessage.id}_${mailMessage.date.replace(/[^0-9]/g, "")}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert("✅ Wiadomość została pobrana jako plik tekstowy.");
    } catch (error) {
      console.error("Error exporting mail:", error);
      alert("❌ Błąd podczas eksportu wiadomości.");
    }
  };

  const openCase = (id: string) => {
    setSelectedCaseId(id);
    setActiveView("case_detail");
    setAiAnalysisVisible(false);
    setCaseTab("editor");
  };

  const handleSendToSign = async () => {
    if (!selectedCase) return;

    setSigningStatus("sending");

    try {
      // Prepare document data for signing
      const documentData = {
        caseId: selectedCase.id,
        title: selectedCase.title || `Sprawa ${selectedCase.id}`,
        content: editorContent,
        client: selectedCase.client,
        clientEmail:
          clients.find((c) => c.name === selectedCase.client)?.email || "",
        timestamp: new Date().toISOString(),
      };

      // In production, this would call the Autenti API
      // For now, we'll simulate the API call
      const response = await fetch("/api/documents/send-to-sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(documentData),
      });

      if (!response.ok) {
        throw new Error("Nie udało się wysłać dokumentu do podpisu");
      }

      await response.json(); // Parse response but don't store if not needed
      setSigningStatus("sent");
      alert(
        `✅ Dokument wysłany do podpisu!\n\nPlatforma: Autenti\nOdbiorca: ${documentData.client}\nEmail: ${documentData.clientEmail}\n\nKlient otrzyma link do podpisu na adres email.`,
      );

      // Update case status
      setCases(
        cases.map((c) =>
          c.id === selectedCase.id
            ? { ...c, status: "Oczekuje na podpis" as Case["status"] }
            : c,
        ),
      );
    } catch (error) {
      console.error("Error sending document to sign:", error);
      setSigningStatus("none");
      alert(
        `❌ Błąd podczas wysyłania dokumentu:\n\n${error instanceof Error ? error.message : "Nieznany błąd"}\n\nSprawdź połączenie z internetem i spróbuj ponownie.`,
      );
    }
  };

  const handleAddTask = () => {
    if (selectedCaseId && newTaskTitle && newTaskDate) {
      const newTask: Task = {
        id: Date.now(),
        title: newTaskTitle,
        deadline: newTaskDate.replace("T", " "),
        priority: newTaskPriority,
        completed: false,
        caseId: selectedCaseId,
      };

      setCases((prevCases) =>
        prevCases.map((c) => {
          if (c.id === selectedCaseId) {
            return { ...c, tasks: [...c.tasks, newTask] };
          }
          return c;
        }),
      );

      setShowAddTaskModal(false);
      setNewTaskTitle("");
      setNewTaskDate("");
      setNewTaskPriority("medium");
    }
  };

  const handleCreateNewCase = (e: React.FormEvent) => {
    e.preventDefault();
    const nextId = `LP/2023/${100 + cases.length + 1}`;
    const newCase: Case = {
      id: nextId,
      title: newCaseData.title,
      client: newCaseData.client,
      clientId: newCaseData.clientId || "C1",
      type: newCaseData.type,
      status: newCaseData.status,
      date: newCaseData.date,
      description: newCaseData.description,
      tasks: [],
      messages: [],
    };
    setCases([newCase, ...cases]);
    setShowNewCaseModal(false);
    setNewCaseData({
      title: "",
      client: "",
      clientId: "C1",
      type: "Inne",
      status: "W toku",
      date: new Date().toISOString().split("T")[0],
      description: "",
    });
    alert("Sprawa została utworzona pomyślnie.");
  };

  const handleToggleTaskComplete = (taskId: number) => {
    if (!selectedCaseId) return;
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === selectedCaseId) {
          return {
            ...c,
            tasks: c.tasks.map((t) =>
              t.id === taskId ? { ...t, completed: !t.completed } : t,
            ),
          };
        }
        return c;
      }),
    );
  };

  const handleEditTask = (taskId: number) => {
    if (!selectedCaseId) return;
    const task = selectedCase?.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newTitle = window.prompt("Edytuj tytuł zadania:", task.title);
    if (newTitle !== null && newTitle.trim() !== "") {
      setCases((prev) =>
        prev.map((c) => {
          if (c.id === selectedCaseId) {
            return {
              ...c,
              tasks: c.tasks.map((t) =>
                t.id === taskId ? { ...t, title: newTitle } : t,
              ),
            };
          }
          return c;
        }),
      );
    }
  };

  const handleDeleteTask = (taskId: number) => {
    if (!selectedCaseId) return;
    if (window.confirm("Czy na pewno chcesz usunąć ten termin?")) {
      setCases((prev) =>
        prev.map((c) => {
          if (c.id === selectedCaseId) {
            return {
              ...c,
              tasks: c.tasks.filter((t) => t.id !== taskId),
            };
          }
          return c;
        }),
      );
    }
  };

  const handleSendMessage = () => {
    if (selectedCaseId && chatInput.trim()) {
      const newMsg: ChatMessage = {
        id: Date.now(),
        sender: "lawyer",
        text: chatInput,
        timestamp: new Date().toLocaleString("pl-PL"),
      };
      setChatMessages((prev) => [...prev, newMsg]);
      if (selectedCase?.clientId === "C1") {
        const STORAGE_KEY = "chat_history_C1";
        const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, newMsg]));
      }
      setChatInput("");
    }
  };

  const handleDeleteMessage = (id: number) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę wiadomość?")) {
      setChatMessages((prev) => {
        const updated = prev.filter((m) => m.id !== id);
        if (selectedCase?.clientId === "C1") {
          localStorage.setItem("chat_history_C1", JSON.stringify(updated));
        }
        return updated;
      });
    }
  };

  const handleEditMessage = (id: number, currentText: string) => {
    const newText = window.prompt("Edytuj wiadomość:", currentText);
    if (newText !== null && newText.trim() !== "") {
      setChatMessages((prev) => {
        const updated = prev.map((m) =>
          m.id === id ? { ...m, text: newText } : m,
        );
        if (selectedCase?.clientId === "C1") {
          localStorage.setItem("chat_history_C1", JSON.stringify(updated));
        }
        return updated;
      });
    }
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: Client = {
      id: `C${clients.length + 1}`,
      name: newClientData.name,
      email: newClientData.email,
      phone: newClientData.phone,
      address: newClientData.address,
      status: "Nowy",
      casesCount: 0,
      avatar: newClientData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2),
    };
    setClients([...clients, newClient]);
    setShowAddClientModal(false);
    setNewClientData({ name: "", email: "", phone: "", address: "" });
    alert("Klient został dodany pomyślnie.");
  };

  const handleReplyMail = () => {
    if (!replyContent.trim()) {
      alert("⚠️ Treść odpowiedzi nie może być pusta.");
      return;
    }

    const originalMail = mail.find((m) => m.id === selectedMailId);
    if (!originalMail) return;

    // Create reply message
    const replyMessage: MailMessage = {
      id: Date.now(),
      from: "Kancelaria",
      subject: `Re: ${originalMail.subject}`,
      content: replyContent,
      date: new Date().toLocaleString("pl-PL"),
      read: true,
      sent: true,
      archived: false,
    };

    // Add to sent messages
    setMail([...mail, replyMessage]);

    alert(`✅ Wysłano odpowiedź do: ${originalMail.from}`);
    setShowReplyModal(false);
    setReplyContent("");

    // Switch to sent folder to show the reply
    setTimeout(() => {
      setActiveMailFilter("sent");
    }, 500);
  };

  const handleForwardMail = () => {
    if (!forwardTo.trim()) {
      alert("⚠️ Podaj adres email odbiorcy.");
      return;
    }

    const originalMail = mail.find((m) => m.id === selectedMailId);
    if (!originalMail) return;

    // Create mailto link to open user's email client
    const subject = encodeURIComponent(`Fwd: ${originalMail.subject}`);
    const body = encodeURIComponent(
      `${forwardNote ? forwardNote + "\n\n---\n\n" : ""}Przekazana wiadomość:\n\nOd: ${originalMail.from}\nData: ${originalMail.date}\nTemat: ${originalMail.subject}\n\n${originalMail.content}`,
    );
    const mailtoLink = `mailto:${forwardTo}?subject=${subject}&body=${body}`;

    // Open user's default email client
    window.location.href = mailtoLink;

    // Close modal and reset state
    setShowForwardModal(false);
    setForwardTo("");
    setForwardNote("");
    alert("✅ Przekierowano do klienta pocztowego.");
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    // Add event logic here (adding to a global task list or case list)
    const newTask: Task = {
      id: Date.now(),
      title: newEventData.title,
      deadline: newEventData.date,
      startTime: newEventData.time,
      priority: "medium",
      completed: false,
      caseId: newEventData.caseId || undefined,
      description: newEventData.description,
    };

    // If associated with a case, add to case tasks, otherwise we might need a general tasks state (omitted for brevity, adding to first case for demo if no ID)
    if (newEventData.caseId) {
      setCases((prev) =>
        prev.map((c) =>
          c.id === newEventData.caseId
            ? { ...c, tasks: [...c.tasks, newTask] }
            : c,
        ),
      );
    } else {
      // Just for demo, attaching to the first case to show it exists
      setCases((prev) =>
        prev.map((c, i) =>
          i === 0 ? { ...c, tasks: [...c.tasks, newTask] } : c,
        ),
      );
    }

    setShowAddEventModal(false);
    setNewEventData({
      title: "",
      date: "",
      time: "09:00",
      description: "",
      caseId: "",
    });
  };

  // --- SUB-VIEWS RENDERERS ---

  // 1. CASES LIST
  const renderCases = () => (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-in fade-in">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h2 className="text-lg font-bold text-slate-900 font-sans">
          Kolejka Spraw (CMS)
        </h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Szukaj..."
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-amber-500 outline-none w-64"
            />
          </div>
          <button className="text-sm px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 flex items-center gap-2 bg-white font-medium text-slate-600">
            <Filter className="w-4 h-4" /> Filtruj
          </button>
          <button
            onClick={() => setShowNewCaseModal(true)}
            className="text-sm px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" /> Nowa Sprawa
          </button>
        </div>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="bg-white text-slate-500 font-bold border-b border-slate-200 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-6 py-4">Sygnatura</th>
            <th className="px-6 py-4">Klient</th>
            <th className="px-6 py-4">Typ sprawy</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Data wpływu</th>
            <th className="px-6 py-4 text-right">Akcja</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {cases.map((c) => (
            <tr
              key={c.id}
              className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
              onClick={() => openCase(c.id)}
            >
              <td className="px-6 py-4 font-mono text-slate-500 font-medium group-hover:text-blue-600">
                {c.id}
              </td>
              <td className="px-6 py-4 font-bold text-slate-900">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                    {c.client.charAt(0)}
                  </div>
                  {c.client}
                </div>
              </td>
              <td className="px-6 py-4 text-slate-600">{c.type}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide 
                        ${
                          c.status === "Do akceptacji"
                            ? "bg-amber-100 text-amber-700"
                            : c.status === "W toku"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                >
                  {c.status}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-500">{c.date}</td>
              <td className="px-6 py-4 text-right">
                <button className="text-slate-400 hover:text-slate-900 p-2">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // 2. CALENDAR
  const renderCalendar = () => {
    // Helper to get events for a date
    const getEventsForDate = (dateStr: string) => {
      return cases
        .flatMap((c) =>
          c.tasks.map((t) => ({
            ...t,
            caseTitle: c.title || c.id,
            clientName: c.client,
          })),
        )
        .filter((t) => t.deadline === dateStr);
    };

    // Helper to render Day/Week timeline cells
    const renderTimelineCell = (hour: string, dateStr: string) => {
      const events = getEventsForDate(dateStr).filter(
        (e) => e.startTime && e.startTime.startsWith(hour.split(":")[0]),
      );
      return (
        <div
          key={hour}
          className="h-20 border-b border-slate-100 relative hover:bg-slate-50 transition-colors group cursor-pointer"
          onClick={() => {
            setNewEventData({ ...newEventData, date: dateStr, time: hour });
            setShowAddEventModal(true);
          }}
        >
          <span className="absolute left-2 top-2 text-xs text-slate-400 group-hover:text-slate-600 select-none">
            {hour}
          </span>
          <div className="ml-14 h-full py-1 pr-2 space-y-1">
            {events.map((ev, i) => (
              <div
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  if (ev.caseId) openCase(ev.caseId);
                }}
                className={`text-xs p-1.5 rounded border-l-4 truncate cursor-pointer hover:opacity-80 transition-opacity shadow-sm ${ev.priority === "high" ? "bg-red-50 border-red-500 text-red-800" : "bg-blue-50 border-blue-500 text-blue-800"}`}
              >
                <span className="font-bold">{ev.startTime}</span> {ev.title}{" "}
                {ev.caseId && <span className="opacity-75">({ev.caseId})</span>}
              </div>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className="h-full flex flex-col bg-white rounded-xl shadow border border-slate-200 overflow-hidden animate-in fade-in">
        {/* Calendar Header */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold font-sans text-slate-900">
              {calendarDate.toLocaleDateString("pl-PL", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div className="flex bg-white rounded-lg border border-slate-200 p-1">
              <button
                onClick={() => setCalendarView("month")}
                className={`px-3 py-1 text-xs font-bold rounded ${calendarView === "month" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
              >
                Miesiąc
              </button>
              <button
                onClick={() => setCalendarView("week")}
                className={`px-3 py-1 text-xs font-bold rounded ${calendarView === "week" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
              >
                Tydzień
              </button>
              <button
                onClick={() => setCalendarView("day")}
                className={`px-3 py-1 text-xs font-bold rounded ${calendarView === "day" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
              >
                Dzień
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="p-2 hover:bg-slate-200 rounded-lg"
              onClick={() => {
                const d = new Date(calendarDate);
                if (calendarView === "month") d.setMonth(d.getMonth() - 1);
                else if (calendarView === "week") d.setDate(d.getDate() - 7);
                else d.setDate(d.getDate() - 1);
                setCalendarDate(d);
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              className="px-4 py-2 hover:bg-slate-200 rounded-lg text-sm font-bold"
              onClick={() => setCalendarDate(new Date())}
            >
              Dzisiaj
            </button>
            <button
              className="p-2 hover:bg-slate-200 rounded-lg"
              onClick={() => {
                const d = new Date(calendarDate);
                if (calendarView === "month") d.setMonth(d.getMonth() + 1);
                else if (calendarView === "week") d.setDate(d.getDate() + 7);
                else d.setDate(d.getDate() + 1);
                setCalendarDate(d);
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* MONTH VIEW */}
          {calendarView === "month" && (
            <div className="grid grid-cols-7 gap-px bg-slate-200 min-h-full">
              {["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"].map((day) => (
                <div
                  key={day}
                  className="bg-slate-50 p-2 text-center text-xs font-bold text-slate-500 uppercase sticky top-0 z-10"
                >
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }).map((_, i) => {
                const date = new Date(
                  calendarDate.getFullYear(),
                  calendarDate.getMonth(),
                  1,
                );
                // Simple logic to start from Monday (adjust as needed for accurate calendar logic)
                const startDay = (date.getDay() + 6) % 7;
                date.setDate(i - startDay + 1);

                const dateStr = date.toISOString().slice(0, 10);
                const events = getEventsForDate(dateStr);
                const isToday =
                  dateStr === new Date().toISOString().slice(0, 10);

                return (
                  <div
                    key={i}
                    className={`bg-white min-h-[100px] p-2 relative hover:bg-slate-50 transition-colors cursor-pointer group border border-transparent hover:border-blue-200 ${date.getMonth() !== calendarDate.getMonth() ? "opacity-40 bg-slate-50" : ""}`}
                    onClick={() => {
                      setCalendarDate(date);
                      setCalendarView("day");
                    }}
                  >
                    <span
                      className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? "bg-slate-900 text-white" : "text-slate-700"}`}
                    >
                      {date.getDate()}
                    </span>
                    <div className="mt-2 space-y-1">
                      {events.slice(0, 3).map((ev, idx) => (
                        <div
                          key={idx}
                          className="text-[10px] px-1.5 py-0.5 rounded truncate bg-blue-100 text-blue-800 border border-blue-200"
                        >
                          {ev.startTime} {ev.title}
                        </div>
                      ))}
                      {events.length > 3 && (
                        <div className="text-[10px] text-slate-400 pl-1">
                          +{events.length - 3} więcej
                        </div>
                      )}
                    </div>
                    <button
                      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-blue-100 rounded text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewEventData({ ...newEventData, date: dateStr });
                        setShowAddEventModal(true);
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* WEEK VIEW */}
          {calendarView === "week" && (
            <div className="flex flex-col min-w-[800px]">
              <div className="grid grid-cols-8 border-b border-slate-200 sticky top-0 bg-white z-20">
                <div className="p-2 text-xs text-slate-400 text-center pt-8">
                  GMT+1
                </div>
                {Array.from({ length: 7 }).map((_, i) => {
                  const date = new Date(calendarDate);
                  const day = date.getDay() || 7;
                  if (day !== 1) date.setHours(-24 * (day - 1));
                  date.setDate(date.getDate() + i);
                  const isToday =
                    date.toISOString().slice(0, 10) ===
                    new Date().toISOString().slice(0, 10);
                  return (
                    <div
                      key={i}
                      className={`p-2 text-center border-l border-slate-100 ${isToday ? "bg-blue-50" : ""}`}
                    >
                      <div className="text-xs text-slate-500 uppercase font-bold">
                        {["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"][i]}
                      </div>
                      <div
                        className={`text-xl font-bold ${isToday ? "text-blue-600" : "text-slate-800"}`}
                      >
                        {date.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-8 flex-1">
                <div className="border-r border-slate-200">
                  {HOURS_24.map((h) => (
                    <div
                      key={h}
                      className="h-20 text-xs text-slate-400 text-center pt-2 border-b border-slate-100 relative -top-3"
                    >
                      {h}
                    </div>
                  ))}
                </div>
                {Array.from({ length: 7 }).map((_, i) => {
                  const date = new Date(calendarDate);
                  const day = date.getDay() || 7;
                  if (day !== 1) date.setHours(-24 * (day - 1));
                  date.setDate(date.getDate() + i);
                  const dateStr = date.toISOString().slice(0, 10);
                  return (
                    <div key={i} className="border-r border-slate-100">
                      {HOURS_24.map((h) => renderTimelineCell(h, dateStr))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* DAY VIEW */}
          {calendarView === "day" && (
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
                {HOURS_24.map((h) =>
                  renderTimelineCell(
                    h,
                    calendarDate.toISOString().slice(0, 10),
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 3. CLIENTS
  const renderClients = () => (
    <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden animate-in fade-in">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h2 className="text-lg font-bold text-slate-900 font-sans">
          Baza Klientów
        </h2>
        <button
          onClick={() => setShowAddClientModal(true)}
          className="text-sm px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Dodaj Klienta
        </button>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="bg-white text-slate-500 font-bold border-b border-slate-200 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-6 py-4">Klient</th>
            <th className="px-6 py-4">Kontakt</th>
            <th className="px-6 py-4">Sprawy</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Akcje</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-slate-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">
                    {client.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{client.name}</p>
                    <p className="text-xs text-slate-500">ID: {client.id}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  <p className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-3 h-3" /> {client.email}
                  </p>
                  <p className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3 h-3" /> {client.phone}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4 font-medium text-slate-900">
                {client.casesCount} aktywnych
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${client.status === "Aktywny" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
                >
                  {client.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => setSelectedClient(client)}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Szczegóły
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // 4. MAIL
  const renderMail = () => {
    const filteredMail = mail.filter((m) => {
      if (activeMailFilter === "archived") return m.archived;
      if (activeMailFilter === "sent") return m.sent && !m.archived;
      return !m.sent && !m.archived; // inbox
    });

    return (
      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden flex h-[600px] animate-in fade-in">
        {/* Mail Navigation Sidebar */}
        <div className="w-48 border-r border-slate-200 bg-slate-50 flex flex-col pt-4">
          <button
            onClick={() => setActiveMailFilter("inbox")}
            className={`mx-2 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 mb-1 transition-colors ${activeMailFilter === "inbox" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
          >
            <Inbox className="w-4 h-4" /> Odebrane
          </button>
          <button
            onClick={() => setActiveMailFilter("sent")}
            className={`mx-2 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 mb-1 transition-colors ${activeMailFilter === "sent" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
          >
            <Send className="w-4 h-4" /> Wysłane
          </button>
          <button
            onClick={() => setActiveMailFilter("archived")}
            className={`mx-2 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 mb-1 transition-colors ${activeMailFilter === "archived" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
          >
            <Trash2 className="w-4 h-4" /> Archiwum
          </button>
        </div>

        <div className="w-1/3 border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              {activeMailFilter === "inbox"
                ? "Skrzynka odbiorcza"
                : activeMailFilter === "sent"
                  ? "Wysłane"
                  : "Archiwum"}
            </h3>
            <button
              onClick={() => alert("Odświeżanie wiadomości...")}
              className="text-slate-500 hover:text-slate-900 transition-colors p-1 hover:bg-slate-200 rounded"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-y-auto flex-1">
            {filteredMail.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Brak wiadomości
              </div>
            ) : (
              filteredMail.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedMailId(m.id);
                    handleMarkAsRead(m.id);
                  }}
                  className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${selectedMailId === m.id ? "bg-blue-50 border-l-4 border-l-blue-600" : ""} ${!m.read ? "font-semibold" : ""}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-500">{m.date}</span>
                    {!m.read && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                  <h4 className="text-sm text-slate-900 truncate mb-1">
                    {m.from}
                  </h4>
                  <p className="text-xs text-slate-600 truncate">{m.subject}</p>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="flex-1 bg-slate-50 flex flex-col">
          {selectedMailId ? (
            (() => {
              const m = mail.find((x) => x.id === selectedMailId);
              if (!m) return null;
              return (
                <div className="flex-1 flex flex-col">
                  <div className="p-6 bg-white border-b border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                      {m.subject}
                    </h2>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                          {m.from.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {m.from}
                          </p>
                          <p className="text-xs text-slate-500">
                            Do: Kancelaria
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {m.archived ? (
                          <button
                            onClick={() => handleRestoreMail(m.id)}
                            className="p-2 hover:bg-slate-100 rounded text-green-600"
                            title="Przywróć"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleArchiveMail(m.id)}
                            className="p-2 hover:bg-slate-100 rounded text-slate-500"
                            title="Archiwizuj"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleExportMailPDF(m)}
                          className="p-2 hover:bg-slate-100 rounded text-slate-500"
                          title="Eksportuj PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {!m.archived && !m.sent && (
                          <>
                            <button
                              onClick={() => setShowReplyModal(true)}
                              className="px-3 py-1 bg-slate-900 text-white rounded text-sm flex items-center gap-2 hover:bg-slate-800"
                            >
                              <MessageSquare className="w-3 h-3" /> Odpisz
                            </button>
                            <button
                              onClick={() => setShowForwardModal(true)}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm flex items-center gap-2 hover:bg-blue-700"
                            >
                              <Send className="w-3 h-3" /> Przekaż
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-8 text-slate-700 leading-relaxed overflow-y-auto bg-white flex-1">
                    {m.content}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 flex-col gap-2 bg-white">
              <Mail className="w-12 h-12 opacity-20" />
              <p>Wybierz wiadomość z listy</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 5. CASE DETAIL (CMS + AI EDITOR + CHAT)
  const renderCaseDetail = () => {
    if (!selectedCase) return null;
    return (
      <div className="flex flex-col h-[calc(100vh-100px)] animate-in slide-in-from-right-4 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Detail Header */}
        <div className="bg-white p-6 border-b border-slate-200 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveView("cases")}
              className="text-slate-400 hover:text-slate-900 transition-colors p-2 hover:bg-slate-50 rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-sans font-bold text-slate-900">
                  {selectedCase.title || `Sprawa ${selectedCase.id}`}
                </h1>
                <span className="px-2 py-0.5 rounded text-xs border border-slate-300 text-slate-500">
                  {selectedCase.type}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                <User className="w-3 h-3" /> Klient:{" "}
                <span className="font-medium text-slate-700">
                  {selectedCase.client}
                </span>
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setAiAnalysisVisible(!aiAnalysisVisible)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors border ${aiAnalysisVisible ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-white border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-600"}`}
            >
              <PenTool className="w-4 h-4" /> Asystent AI
            </button>
            {signingStatus === "sent" ? (
              <button
                disabled
                className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-medium flex items-center gap-2 cursor-default border border-emerald-200"
              >
                <Check className="w-4 h-4" /> Wysłano (Autenti)
              </button>
            ) : (
              <button
                onClick={handleSendToSign}
                disabled={signingStatus === "sending"}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-slate-800 shadow-md transition-all"
              >
                {signingStatus === "sending" ? (
                  <Clock className="w-4 h-4 animate-spin" />
                ) : (
                  <FileSignature className="w-4 h-4" />
                )}
                Wyślij do podpisu
              </button>
            )}
          </div>
        </div>

        {/* Internal Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-8 flex gap-8 shrink-0">
          <button
            onClick={() => setCaseTab("editor")}
            className={`py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${caseTab === "editor" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            <FileText className="w-4 h-4" /> Edytor Pism
          </button>
          <button
            onClick={() => setCaseTab("tasks")}
            className={`py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${caseTab === "tasks" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            <CalendarIcon className="w-4 h-4" /> Terminarz i Zadania
            {selectedCase.tasks.filter((t) => !t.completed).length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                {selectedCase.tasks.filter((t) => !t.completed).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setCaseTab("chat")}
            className={`py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${caseTab === "chat" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            <MessageSquare className="w-4 h-4" /> Komunikacja
          </button>
        </div>

        {/* Workspace */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 bg-slate-50/50 p-8 overflow-y-auto flex flex-col gap-6 relative">
            {caseTab === "tasks" && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-in fade-in h-full">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      Lista Zadań
                    </h3>
                    <p className="text-slate-500 text-sm">
                      Zarządzaj terminami sądowymi i procesowymi.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddTaskModal(true)}
                    className="text-sm px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 shadow-sm font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Dodaj termin sądowy
                  </button>
                </div>
                <div className="space-y-4">
                  {selectedCase.tasks.length > 0 ? (
                    selectedCase.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-1 h-12 rounded-full ${task.priority === "high" ? "bg-red-500" : task.priority === "medium" ? "bg-amber-500" : "bg-green-500"}`}
                          ></div>
                          <div>
                            <div className="flex items-center gap-3">
                              <span
                                className={`font-medium text-base ${task.completed ? "line-through text-slate-400" : "text-slate-800"}`}
                              >
                                {task.title}
                              </span>
                              {task.priority === "high" && (
                                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold uppercase">
                                  Pilne
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Termin:{" "}
                              {task.deadline}{" "}
                              {task.startTime && `• ${task.startTime}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditTask(task.id)}
                            className="text-xs border border-slate-300 px-3 py-1.5 rounded hover:bg-slate-50 text-slate-600"
                          >
                            Edytuj
                          </button>
                          <button
                            onClick={() => handleToggleTaskComplete(task.id)}
                            className={`text-xs px-3 py-1.5 rounded transition-colors ${task.completed ? "bg-slate-200 text-slate-500" : "bg-slate-900 text-white hover:bg-slate-800"}`}
                          >
                            {task.completed
                              ? "Przywróć"
                              : "Oznacz jako wykonane"}
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-xs border border-red-200 text-red-600 px-3 py-1.5 rounded hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 text-slate-400 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                      <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="font-medium">
                        Brak terminów w tej sprawie.
                      </p>
                      <p className="text-xs mt-1">
                        Dodaj nowy termin używając przycisku powyżej.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {caseTab === "editor" && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col flex-1 min-h-[500px] animate-in fade-in h-full">
                <div className="border-b border-slate-200 p-3 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
                  <div className="flex gap-2">
                    <button
                      className="p-2 hover:bg-white hover:shadow-sm rounded transition-all text-slate-600"
                      title="Zapisz"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <div className="h-8 w-px bg-slate-200 mx-1"></div>
                    <span className="text-xs text-slate-400 flex items-center px-2">
                      Ostatni zapis: 14:02 (Auto)
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs font-medium text-slate-600 px-3 py-1.5 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-all">
                      Podgląd PDF
                    </button>
                  </div>
                </div>
                <div className="flex-1 relative">
                  <textarea
                    className="absolute inset-0 w-full h-full p-10 font-sans text-slate-800 leading-loose resize-none focus:outline-none text-lg selection:bg-amber-200"
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                  ></textarea>
                </div>
              </div>
            )}

            {caseTab === "chat" && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full animate-in fade-in overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {selectedCase.client.charAt(0)}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {selectedCase.client}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-green-600" />{" "}
                      Połączenie szyfrowane E2EE
                    </p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                  {chatMessages.map((msg) => {
                    const isLawyer = msg.sender === "lawyer";
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isLawyer ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex flex-col ${isLawyer ? "items-end" : "items-start"} max-w-[70%]`}
                        >
                          <div
                            className={`px-5 py-3 rounded-2xl text-sm shadow-sm leading-relaxed relative group ${
                              isLawyer
                                ? "bg-slate-900 text-white rounded-tr-none"
                                : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                            }`}
                          >
                            {msg.text}
                            {isLawyer && (
                              <div className="absolute -left-16 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-md rounded-lg p-1 border border-white/20">
                                <button
                                  onClick={() =>
                                    handleEditMessage(msg.id, msg.text)
                                  }
                                  className="p-1 hover:text-amber-400 transition-colors"
                                  title="Edytuj"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="p-1 hover:text-red-400 transition-colors"
                                  title="Usuń"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 px-1 font-medium">
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef}></div>
                </div>
                <div className="p-4 border-t border-slate-200 bg-white">
                  <div className="flex gap-2 items-end">
                    <button className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl flex items-center px-4 py-2 focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-transparent transition-all">
                      <textarea
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          !e.shiftKey &&
                          (e.preventDefault(), handleSendMessage())
                        }
                        placeholder="Napisz wiadomość..."
                        className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 placeholder:text-slate-400 resize-none max-h-32 py-2"
                        rows={1}
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim()}
                      className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Assistant Panel */}
          {aiAnalysisVisible && (
            <div className="w-96 border-l border-slate-200 bg-white flex flex-col animate-in slide-in-from-right-4">
              <div className="p-4 border-b border-slate-200 bg-linear-to-r from-amber-50 to-amber-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <PenTool className="w-5 h-5 text-amber-600" />
                    Asystent AI
                  </h3>
                  <button
                    onClick={() => setAiAnalysisVisible(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-600">
                  Analiza prawna dokumentu i sugestie
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* AI Analysis Content */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Analiza dokumentu
                  </h4>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    Dokument zawiera {editorContent.split(" ").length} słów.
                    Struktura wydaje się poprawna dla tego typu pisma
                    procesowego.
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-bold text-amber-900 text-sm mb-2">
                    ⚠️ Sugestie
                  </h4>
                  <ul className="text-xs text-amber-800 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">•</span>
                      <span>
                        Sprawdź czy wszystkie dane osobowe są aktualne
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">•</span>
                      <span>Dodaj podstawę prawną dla żądania</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">•</span>
                      <span>Rozważ dodanie dowodów na poparcie twierdzeń</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h4 className="font-bold text-emerald-900 text-sm mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Zgodność formalna
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Check className="w-3 h-3" />
                      <span>Nagłówek pisma</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Check className="w-3 h-3" />
                      <span>Data i miejsce</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Check className="w-3 h-3" />
                      <span>Podpis</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h4 className="font-bold text-slate-900 text-sm mb-3">
                    🤖 Zapytaj AI
                  </h4>
                  <textarea
                    placeholder="Zadaj pytanie dotyczące sprawy..."
                    className="w-full border border-slate-300 rounded-lg p-3 text-xs resize-none focus:ring-2 focus:ring-amber-500 outline-none"
                    rows={3}
                  />
                  <button className="mt-2 w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors">
                    Wyślij zapytanie
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} shrink-0 bg-slate-950 border-r border-slate-800 transition-all duration-300 flex flex-col fixed h-full z-20 md:relative`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          {sidebarOpen && (
            <span className="font-bold text-xl text-white tracking-tight">
              Lex<span className="text-amber-500">Operator</span>
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-slate-800 rounded"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-3">
          <NavItem
            icon={<Briefcase />}
            label="Sprawy"
            active={activeView === "cases" || activeView === "case_detail"}
            onClick={() => setActiveView("cases")}
            expanded={sidebarOpen}
          />
          <NavItem
            icon={<CalendarIcon />}
            label="Kalendarz"
            active={activeView === "calendar"}
            onClick={() => setActiveView("calendar")}
            expanded={sidebarOpen}
          />
          <NavItem
            icon={<Users />}
            label="Klienci"
            active={activeView === "clients"}
            onClick={() => setActiveView("clients")}
            expanded={sidebarOpen}
          />
          <NavItem
            icon={<Mail />}
            label="Poczta"
            active={activeView === "mail"}
            onClick={() => setActiveView("mail")}
            expanded={sidebarOpen}
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg w-full transition-colors ${!sidebarOpen && "justify-center"}`}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Wyloguj</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-900 pb-10">
        {/* Top Header */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10 px-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {activeView === "dashboard"
              ? "Panel Główny"
              : activeView === "cases"
                ? "Baza Spraw"
                : activeView === "case_detail"
                  ? "Szczegóły Sprawy"
                  : activeView === "calendar"
                    ? "Kalendarz"
                    : activeView === "clients"
                      ? "Baza Klientów"
                      : "Poczta"}
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveView("mail")}
              className={`p-2 rounded-full transition-colors relative ${activeView === "mail" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
            >
              <Mail className="w-5 h-5" />
              {mail.filter((m) => !m.read).length > 0 && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-800"></span>
              )}
            </button>
            <div className="relative group">
              <button className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center font-bold text-slate-900 hover:ring-2 hover:ring-amber-400 transition-all flex-shrink-0">
                OP
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden hidden group-hover:block animate-in fade-in slide-in-from-top-2 z-50">
                <div className="p-3 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-900">
                    Mec. Anna Nowak
                  </p>
                  <p className="text-xs text-slate-500">Operator Prawny</p>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                  <User className="w-4 h-4" /> Mój Profil
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Ustawienia
                </button>
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-4 h-4" /> Wyloguj
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {activeView === "dashboard" && renderCases()}
          {activeView === "cases" && renderCases()}
          {activeView === "calendar" && renderCalendar()}
          {activeView === "clients" && renderClients()}
          {activeView === "mail" && renderMail()}
          {activeView === "case_detail" && renderCaseDetail()}
        </div>
      </main>

      {/* Add Client Modal */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddClientModal(false)}
          ></div>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95">
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-500" /> Dodaj Nowego
                Klienta
              </h3>
              <button
                onClick={() => setShowAddClientModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddClient} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Imię i Nazwisko
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none"
                  value={newClientData.name}
                  onChange={(e) =>
                    setNewClientData({ ...newClientData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none"
                  value={newClientData.email}
                  onChange={(e) =>
                    setNewClientData({
                      ...newClientData,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none"
                  value={newClientData.phone}
                  onChange={(e) =>
                    setNewClientData({
                      ...newClientData,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Adres
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none"
                  value={newClientData.address}
                  onChange={(e) =>
                    setNewClientData({
                      ...newClientData,
                      address: e.target.value,
                    })
                  }
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-bold shadow-sm"
                >
                  Zapisz Klienta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Client Details Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedClient(null)}
          ></div>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in zoom-in-95">
            <div className="bg-slate-900 p-6 text-white relative">
              <button
                onClick={() => setSelectedClient(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white text-slate-900 rounded-full flex items-center justify-center font-bold text-2xl border-4 border-amber-500">
                  {selectedClient.avatar}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedClient.name}</h2>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${selectedClient.status === "Aktywny" ? "bg-green-500 text-white" : "bg-slate-500"}`}
                  >
                    {selectedClient.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500 font-bold uppercase text-xs">
                    Email
                  </p>
                  <p className="text-slate-900">{selectedClient.email}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-bold uppercase text-xs">
                    Telefon
                  </p>
                  <p className="text-slate-900">{selectedClient.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-500 font-bold uppercase text-xs">
                    Adres
                  </p>
                  <p className="text-slate-900">
                    {selectedClient.address || "Brak danych"}
                  </p>
                </div>
                {selectedClient.pesel && (
                  <div className="col-span-2">
                    <p className="text-slate-500 font-bold uppercase text-xs">
                      PESEL
                    </p>
                    <p className="text-slate-900">{selectedClient.pesel}</p>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Aktywne Sprawy
                </h4>
                <div className="space-y-2">
                  {cases.filter((c) => c.clientId === selectedClient.id)
                    .length > 0 ? (
                    cases
                      .filter((c) => c.clientId === selectedClient.id)
                      .map((c) => (
                        <div
                          key={c.id}
                          className="p-3 bg-slate-50 rounded border border-slate-200 flex justify-between items-center hover:bg-blue-50 cursor-pointer"
                          onClick={() => {
                            setSelectedClient(null);
                            openCase(c.id);
                          }}
                        >
                          <div>
                            <p className="font-bold text-sm text-slate-900">
                              {c.title || c.id}
                            </p>
                            <p className="text-xs text-slate-500">{c.type}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      ))
                  ) : (
                    <p className="text-sm text-slate-500 italic">
                      Brak aktywnych spraw.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `Czy na pewno chcesz usunąć klienta ${selectedClient?.name}? Będzie można go przywrócić.`,
                    )
                  ) {
                    setClients(
                      clients.map((c) =>
                        c.id === selectedClient?.id
                          ? { ...c, status: "Nieaktywny" }
                          : c,
                      ),
                    );
                    setSelectedClient(null);
                  }
                }}
                className="text-sm text-red-600 hover:text-red-800 font-medium px-4"
              >
                Usuń klienta
              </button>
              <button
                onClick={() => setSelectedClient(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-sm font-bold"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Mail Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowReplyModal(false)}
          ></div>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in zoom-in-95">
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5" /> Odpowiedz
              </h3>
              <button
                onClick={() => setShowReplyModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-slate-500">
                  Do:{" "}
                  <span className="font-bold text-slate-900">
                    {mail.find((m) => m.id === selectedMailId)?.from}
                  </span>
                </p>
                <p className="text-sm text-slate-500">
                  Temat:{" "}
                  <span className="font-bold text-slate-900">
                    Re: {mail.find((m) => m.id === selectedMailId)?.subject}
                  </span>
                </p>
              </div>
              <textarea
                className="w-full h-48 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 outline-none resize-none"
                placeholder="Treść wiadomości..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleReplyMail}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Wyślij
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forward Mail Modal */}
      {showForwardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowForwardModal(false)}
          ></div>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in zoom-in-95">
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2">
                <Send className="w-5 h-5" /> Przekaż wiadomość
              </h3>
              <button
                onClick={() => setShowForwardModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-slate-500 mb-4">
                  Oryginalna wiadomość:{" "}
                  <span className="font-bold text-slate-900">
                    {mail.find((m) => m.id === selectedMailId)?.subject}
                  </span>
                </p>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Przekaż do (email):
                </label>
                <input
                  type="email"
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 outline-none mb-4"
                  placeholder="adres@email.com"
                  value={forwardTo}
                  onChange={(e) => setForwardTo(e.target.value)}
                />
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notatka (opcjonalnie):
                </label>
                <textarea
                  className="w-full h-32 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 outline-none resize-none"
                  placeholder="Dodaj notatkę do przekazanej wiadomości..."
                  value={forwardNote}
                  onChange={(e) => setForwardNote(e.target.value)}
                />
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowForwardModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleForwardMail}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Przekaż
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddEventModal(false)}
          ></div>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95">
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-amber-500" /> Dodaj
                Wydarzenie
              </h3>
              <button
                onClick={() => setShowAddEventModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tytuł
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none"
                  value={newEventData.title}
                  onChange={(e) =>
                    setNewEventData({ ...newEventData, title: e.target.value })
                  }
                  placeholder="np. Spotkanie z klientem"
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
                    value={newEventData.date}
                    onChange={(e) =>
                      setNewEventData({ ...newEventData, date: e.target.value })
                    }
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
                    value={newEventData.time}
                    onChange={(e) =>
                      setNewEventData({ ...newEventData, time: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Powiązana sprawa (Opcjonalnie)
                </label>
                <select
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none bg-white"
                  value={newEventData.caseId}
                  onChange={(e) =>
                    setNewEventData({ ...newEventData, caseId: e.target.value })
                  }
                >
                  <option value="">Brak powiązania</option>
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title || c.id} ({c.client})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notatka
                </label>
                <textarea
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none h-24 resize-none"
                  value={newEventData.description}
                  onChange={(e) =>
                    setNewEventData({
                      ...newEventData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Szczegóły..."
                ></textarea>
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-bold shadow-sm"
                >
                  Dodaj
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddTaskModal(false)}
          ></div>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95">
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" /> Dodaj Termin Sądowy
              </h3>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nazwa wydarzenia
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="np. Rozprawa sądowa"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Data i Godzina
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none"
                    value={newTaskDate}
                    onChange={(e) => setNewTaskDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Priorytet
                  </label>
                  <select
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none bg-white font-medium"
                    value={newTaskPriority}
                    onChange={(e) =>
                      setNewTaskPriority(
                        e.target.value as "low" | "medium" | "high",
                      )
                    }
                  >
                    <option value="low">Niski</option>
                    <option value="medium">Średni</option>
                    <option value="high">Wysoki</option>
                  </select>
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleAddTask}
                  className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-bold shadow-sm"
                >
                  Zapisz termin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Case Modal */}
      {showNewCaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowNewCaseModal(false)}
          ></div>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in zoom-in-95">
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-500" /> Nowa Sprawa
              </h3>
              <button
                onClick={() => setShowNewCaseModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateNewCase} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tytuł Sprawy
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none"
                    value={newCaseData.title}
                    onChange={(e) =>
                      setNewCaseData({ ...newCaseData, title: e.target.value })
                    }
                    placeholder="np. Sprawa rozwodowa - Kowalski"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Klient
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none"
                    value={newCaseData.client}
                    onChange={(e) =>
                      setNewCaseData({ ...newCaseData, client: e.target.value })
                    }
                    placeholder="Jan Kowalski"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Typ Sprawy
                  </label>
                  <select
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none bg-white"
                    value={newCaseData.type}
                    onChange={(e) =>
                      setNewCaseData({ ...newCaseData, type: e.target.value })
                    }
                  >
                    <option value="Cywilna">Cywilna</option>
                    <option value="Karna">Karna</option>
                    <option value="Rodzinna">Rodzinna</option>
                    <option value="Gospodarcza">Gospodarcza</option>
                    <option value="Inne">Inne</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status Początkowy
                  </label>
                  <select
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none bg-white"
                    value={newCaseData.status}
                    onChange={(e) =>
                      setNewCaseData({ ...newCaseData, status: e.target.value })
                    }
                  >
                    <option value="W toku">W toku</option>
                    <option value="Nowa">Nowa</option>
                    <option value="Oczekuje">Oczekuje</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Data Utworzenia
                  </label>
                  <input
                    type="date"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none"
                    value={newCaseData.date}
                    onChange={(e) =>
                      setNewCaseData({ ...newCaseData, date: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Opis Sprawy
                  </label>
                  <textarea
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none h-24 resize-none"
                    value={newCaseData.description}
                    onChange={(e) =>
                      setNewCaseData({
                        ...newCaseData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Krótki opis..."
                  ></textarea>
                </div>
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
                  className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-bold shadow-sm"
                >
                  Utwórz Sprawę
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const NavItem = ({
  icon,
  label,
  active,
  onClick,
  expanded,
}: {
  icon: React.ReactElement;
  label: string;
  active: boolean;
  onClick: () => void;
  expanded: boolean;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" : "text-slate-400 hover:bg-slate-800 hover:text-white"} ${!expanded && "justify-center"}`}
  >
    {React.cloneElement(icon, { size: 20 } as Partial<unknown>)}
    {expanded && <span className="font-medium text-sm">{label}</span>}
  </button>
);

export default LawyerDashboard;
