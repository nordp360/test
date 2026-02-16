import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  CreditCard,
  Activity,
  Server,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Megaphone,
  Search,
  CheckCircle,
  Settings,
  FileText,
  Database,
  Lock,
  LogOut,
  Bell,
  Menu,
  X,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Edit,
  RotateCcw,
  Download,
  Key,
  MousePointer2,
  AlertTriangle,
  Cpu,
  Plus,
  UserPlus,
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  plan: string;
  status: string;
  joined: string;
  lastLogin: string;
}

// --- MOCK DATA ---
const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: "Kancelaria Prawna Omega",
    email: "biuro@omega-legal.pl",
    role: "Firma (B2B)",
    plan: "Subskrypcja PRO",
    status: "Aktywny",
    joined: "2023-01-15",
    lastLogin: "2 min temu",
  },
  {
    id: 2,
    name: "Jan Kowalski",
    email: "jan.k@gmail.com",
    role: "Klient Ind.",
    plan: "Standard",
    status: "Aktywny",
    joined: "2023-05-20",
    lastLogin: "1 dzień temu",
  },
  {
    id: 3,
    name: "Anna Nowak (Mec.)",
    email: "anna.nowak@lexportal.pl",
    role: "Operator Prawny",
    plan: "-",
    status: "Aktywny",
    joined: "2022-11-01",
    lastLogin: "Teraz",
  },
  {
    id: 4,
    name: "Startup Sp. z o.o.",
    email: "kontakt@startup.io",
    role: "Firma (B2B)",
    plan: "Subskrypcja",
    status: "Zaległość",
    joined: "2023-08-10",
    lastLogin: "5 dni temu",
  },
  {
    id: 5,
    name: "Piotr Wiśniewski",
    email: "p.wisniewski@onet.pl",
    role: "Klient Ind.",
    plan: "Standard",
    status: "Zablokowany",
    joined: "2023-09-01",
    lastLogin: "30 dni temu",
  },
  {
    id: 6,
    name: "Maria Lewandowska",
    email: "m.lewandowska@wp.pl",
    role: "Klient Ind.",
    plan: "Standard",
    status: "Aktywny",
    joined: "2023-11-02",
    lastLogin: "3 godz. temu",
  },
];

const INITIAL_INVOICES = [
  {
    id: "FV/23/11/1050",
    client: "Kancelaria Omega",
    nip: "525-000-11-22",
    amount: "499.00 PLN",
    date: "2023-11-15",
    status: "Opłacona",
    method: "Stripe",
  },
  {
    id: "FV/23/11/1049",
    client: "Jan Kowalski",
    nip: "-",
    amount: "49.00 PLN",
    date: "2023-11-14",
    status: "Opłacona",
    method: "BLIK",
  },
  {
    id: "FV/23/11/1048",
    client: "Startup Sp. z o.o.",
    nip: "123-456-78-90",
    amount: "199.00 PLN",
    date: "2023-11-12",
    status: "Oczekuje",
    method: "Przelew",
  },
];

const INITIAL_CAMPAIGNS = [
  {
    id: 1,
    name: 'Search: "Pozew o rozwód"',
    platform: "Google Ads",
    status: "Aktywna",
    budget: "2000 PLN",
    clicks: 450,
    ctr: "4.2%",
  },
  {
    id: 2,
    name: "Remarketing: Porzucone koszyki",
    platform: "Meta/Google",
    status: "Aktywna",
    budget: "500 PLN",
    clicks: 120,
    ctr: "1.5%",
  },
  {
    id: 3,
    name: 'Blog: Topic Cluster "Spadki"',
    platform: "SEO/Content",
    status: "W trakcie",
    budget: "-",
    clicks: 890,
    ctr: "Org.",
  },
];

const MOCK_AUDIT_LOGS = [
  {
    id: 102,
    action: "LOGIN_FAILURE",
    user: "admin@lexportal.pl",
    ip: "45.12.11.90",
    time: "Dzisiaj, 14:22",
    level: "WARN",
  },
  {
    id: 101,
    action: "CONFIG_CHANGE",
    user: "dev_team",
    ip: "192.168.1.5",
    time: "Dzisiaj, 13:00",
    level: "INFO",
  },
  {
    id: 100,
    action: "USER_DELETED",
    user: "admin_main",
    ip: "10.0.0.12",
    time: "Wczoraj, 18:45",
    level: "INFO",
  },
  {
    id: 99,
    action: "EXPORT_DATA",
    user: "anna.nowak",
    ip: "89.12.33.11",
    time: "Wczoraj, 16:30",
    level: "INFO",
  },
  {
    id: 98,
    action: "API_ERROR_500",
    user: "system",
    ip: "localhost",
    time: "10.11.2023 09:15",
    level: "ERROR",
  },
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Users State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [userFilter, setUserFilter] = useState("");

  // User Modal State
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    role: "Klient Ind.",
    plan: "Standard",
  });

  // Invoices State
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceFormData, setInvoiceFormData] = useState({
    client: "",
    nip: "",
    amount: "",
    method: "Przelew",
    status: "Oczekuje",
  });

  // Marketing State
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [showSEOPlanModal, setShowSEOPlanModal] = useState(false);

  // Config States
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [aiTemperature, setAiTemperature] = useState(0.7);
  const [apiKeyGemini] = useState("**********************");

  // --- ACTIONS ---

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // --- USER ACTIONS ---
  const openAddUserModal = () => {
    setEditingUser(null);
    setUserFormData({
      name: "",
      email: "",
      role: "Klient Ind.",
      plan: "Standard",
    });
    setShowUserModal(true);
  };

  const openEditUserModal = (user: User) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
    });
    setShowUserModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      // Edit existing
      setUsers(
        users.map((u) =>
          u.id === editingUser.id ? { ...u, ...userFormData } : u,
        ),
      );
    } else {
      // Add new
      const newUser: User = {
        id: Date.now(),
        ...userFormData,
        status: "Aktywny",
        joined: "Teraz",
        lastLogin: "-",
      };
      setUsers([...users, newUser]);
    }
    setShowUserModal(false);
  };

  const handleDeleteUser = (id: number) => {
    if (window.confirm("Czy na pewno chcesz zarchiwizować tego użytkownika?")) {
      setUsers(
        users.map((u) =>
          u.id === id ? { ...u, status: "Zarchiwizowany" } : u,
        ),
      );
    }
  };

  const handleRestoreUser = (id: number) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: "Aktywny" } : u)));
  };

  // --- OTHER ACTIONS ---
  const handleAddCampaign = () => {
    const name = window.prompt("Nazwa kampanii:");
    if (name) {
      const newCamp = {
        id: Date.now(),
        name: name,
        platform: "Google Ads",
        status: "Oczekuje",
        budget: "1000 PLN",
        clicks: 0,
        ctr: "0.0%",
      };
      setCampaigns([...campaigns, newCamp]);
    }
  };

  const handleOpenInvoiceModal = () => {
    setInvoiceFormData({
      client: "",
      nip: "",
      amount: "",
      method: "Przelew",
      status: "Oczekuje",
    });
    setShowInvoiceModal(true);
  };

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const newInv = {
      id: `FV/23/11/${1050 + invoices.length + 1}`,
      date: new Date().toLocaleDateString(),
      ...invoiceFormData,
    };
    setInvoices([newInv, ...invoices]);
    setShowInvoiceModal(false);
  };

  const handleExportInvoicesCSV = () => {
    const headers = [
      "ID",
      "Klient",
      "NIP",
      "Kwota",
      "Data",
      "Status",
      "Metoda",
    ];
    const rows = invoices.map((inv) => [
      inv.id,
      inv.client,
      inv.nip,
      inv.amount,
      inv.date,
      inv.status,
      inv.method,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "faktury_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadChecklist = () => {
    setShowChecklistModal(true);
  };

  const handleViewSEOPlan = () => {
    setShowSEOPlanModal(true);
  };

  // --- RENDER FUNCTIONS ---

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={<CreditCard className="text-blue-400" />}
          title="Przychód MRR"
          value="42,500 PLN"
          trend="+12.5%"
          trendUp={true}
        />
        <StatCard
          icon={<Users className="text-purple-400" />}
          title="Nowi Klienci"
          value="128"
          trend="+8.2%"
          trendUp={true}
        />
        <StatCard
          icon={<FileText className="text-green-400" />}
          title="Wygenerowane Pisma"
          value="1,402"
          trend="+24%"
          trendUp={true}
        />
        <StatCard
          icon={<Server className="text-orange-400" />}
          title="Obciążenie API"
          value="24%"
          subtext="Stabilne"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" /> Aktywność na Żywo
          </h3>
          <div className="h-64 flex items-end justify-between gap-2 px-2 pb-2 border-b border-slate-600">
            {[40, 60, 45, 70, 85, 60, 75, 50, 65, 90, 80, 95].map((h, i) => (
              <div
                key={i}
                className="w-full bg-blue-600/50 hover:bg-blue-500 transition-all rounded-t"
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            Ostatnie 12 godzin (Requests / min)
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" /> Ostatnie Alerty
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm border-l-2 border-red-500 pl-3 py-1">
              <span className="font-mono text-xs px-1 rounded bg-red-500/20 text-red-400">
                WARN
              </span>
              <div>
                <p className="text-slate-300">
                  Wykryto 5 nieudanych prób logowania (Admin)
                </p>
                <p className="text-xs text-slate-500">14:22 • 45.12.11.90</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm border-l-2 border-blue-500 pl-3 py-1">
              <span className="font-mono text-xs px-1 rounded bg-blue-500/20 text-blue-400">
                INFO
              </span>
              <div>
                <p className="text-slate-300">Zmiana konfiguracji API Gemini</p>
                <p className="text-xs text-slate-500">13:00 • dev_team</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTab("security");
            }}
            className="w-full mt-4 py-2 text-sm text-slate-400 hover:bg-slate-700 rounded transition-colors border border-slate-700"
          >
            Zobacz dziennik zdarzeń
          </button>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl animate-in fade-in">
      <div className="p-6 border-b border-slate-700 flex flex-col md:flex-row justify-between items-center bg-slate-800/50 gap-4">
        <div>
          <h3 className="font-bold text-white text-lg">Baza Użytkowników</h3>
          <p className="text-slate-400 text-sm">
            Zarządzaj dostępem klientów i operatorów.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Szukaj (Email, Nazwa, NIP)..."
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none w-full md:w-64"
            />
          </div>
          <button
            onClick={openAddUserModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Dodaj użytkownika
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-400">
          <thead className="bg-slate-900/50 uppercase text-xs font-semibold text-slate-500">
            <tr>
              <th className="px-6 py-4">Użytkownik</th>
              <th className="px-6 py-4">Rola</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {users
              .filter(
                (u) =>
                  u.name.toLowerCase().includes(userFilter.toLowerCase()) ||
                  u.email.includes(userFilter),
              )
              .map((u) => (
                <tr
                  key={u.id}
                  className={`hover:bg-slate-700/30 transition-colors ${u.status === "Zarchiwizowany" ? "opacity-50" : ""}`}
                >
                  <td className="px-6 py-4">
                    <div
                      className={`font-medium text-white ${u.status === "Zarchiwizowany" && "line-through"}`}
                    >
                      {u.name}
                    </div>
                    <div className="text-xs">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">{u.role}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-700 px-2 py-1 rounded text-xs text-white">
                      {u.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        u.status === "Aktywny"
                          ? "bg-green-500/10 text-green-400"
                          : u.status === "Zaległość"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : u.status === "Zarchiwizowany"
                              ? "bg-slate-700 text-slate-500"
                              : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button
                      onClick={() => openEditUserModal(u)}
                      className="p-1.5 hover:bg-slate-600 rounded text-blue-400"
                      title="Edytuj"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {u.status === "Zarchiwizowany" ? (
                      <button
                        onClick={() => handleRestoreUser(u.id)}
                        className="p-1.5 hover:bg-slate-600 rounded text-green-400"
                        title="Przywróć"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 hover:bg-slate-600 rounded text-amber-400"
                        title="Zarchiwizuj"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl animate-in fade-in">
      <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
        <div>
          <h3 className="font-bold text-white text-lg">Rejestr Faktur</h3>
          <p className="text-slate-400 text-sm">
            Historia płatności i dokumenty sprzedażowe.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleOpenInvoiceModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Generuj
          </button>
          <button
            onClick={handleExportInvoicesCSV}
            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Eksportuj CSV
          </button>
        </div>
      </div>
      <table className="w-full text-sm text-left text-slate-400">
        <thead className="bg-slate-900/50 uppercase text-xs font-semibold text-slate-500">
          <tr>
            <th className="px-6 py-4">Numer Faktury</th>
            <th className="px-6 py-4">Klient</th>
            <th className="px-6 py-4">Kwota Brutto</th>
            <th className="px-6 py-4">Metoda</th>
            <th className="px-6 py-4">Data</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Pobierz</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {invoices.map((inv) => (
            <tr
              key={inv.id}
              className="hover:bg-slate-700/30 transition-colors"
            >
              <td className="px-6 py-4 font-mono text-white">{inv.id}</td>
              <td className="px-6 py-4">
                <div className="text-white">{inv.client}</div>
                <div className="text-xs">NIP: {inv.nip}</div>
              </td>
              <td className="px-6 py-4 font-bold text-white">{inv.amount}</td>
              <td className="px-6 py-4">{inv.method}</td>
              <td className="px-6 py-4">{inv.date}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    inv.status === "Opłacona"
                      ? "bg-green-500/10 text-green-400"
                      : inv.status === "Oczekuje"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {inv.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-blue-400 hover:text-blue-300">
                  <Download className="w-4 h-4 ml-auto" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderMarketing = () => (
    <div className="space-y-8 animate-in fade-in">
      {/* Strategy Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <div className="bg-blue-900/50 w-10 h-10 rounded-lg flex items-center justify-center mb-4 border border-blue-500/30">
            <Globe className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="font-bold text-white mb-2">E-E-A-T Strategy</h3>
          <p className="text-sm text-slate-400 mb-2">
            Experience, Expertise, Authoritativeness, Trustworthiness.
          </p>
          <div className="text-xs text-slate-500 bg-slate-900 p-2 rounded border border-slate-800">
            Branża &quot;YMYL&quot; (Your Money Your Life) wymaga treści
            autoryzowanych przez prawników.
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <div className="bg-purple-900/50 w-10 h-10 rounded-lg flex items-center justify-center mb-4 border border-purple-500/30">
            <Database className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="font-bold text-white mb-2">Topic Clusters</h3>
          <p className="text-sm text-slate-400 mb-2">
            Budowanie autorytetu poprzez grupy tematyczne.
          </p>
          <div className="text-xs text-slate-500 bg-slate-900 p-2 rounded border border-slate-800">
            np. Klaster &quot;Rozwód&quot; linkuje do &quot;Podział
            majątku&quot;, &quot;Alimenty&quot;, &quot;Opieka&quot;.
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <div className="bg-green-900/50 w-10 h-10 rounded-lg flex items-center justify-center mb-4 border border-green-500/30">
            <MousePointer2 className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="font-bold text-white mb-2">PPC & Long-tail</h3>
          <p className="text-sm text-slate-400 mb-2">
            Celowanie w precyzyjne frazy o wysokiej konwersji.
          </p>
          <div className="text-xs text-slate-500 bg-slate-900 p-2 rounded border border-slate-800">
            Fraza &quot;jak napisać pozew o zapłatę faktury wzór&quot; tańsza
            niż &quot;prawnik&quot;.
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <div className="bg-orange-900/50 w-10 h-10 rounded-lg flex items-center justify-center mb-4 border border-orange-500/30">
            <Cpu className="w-6 h-6 text-orange-400" />
          </div>
          <h3 className="font-bold text-white mb-2">Schema Markup</h3>
          <p className="text-sm text-slate-400 mb-2">
            Dane strukturalne dla Google.
          </p>
          <div className="text-xs text-slate-500 bg-slate-900 p-2 rounded border border-slate-800">
            Tagi &quot;LegalService&quot; oraz &quot;FAQPage&quot; dla wyników
            rozszerzonych.
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h3 className="font-bold text-white text-lg">
            Aktywne Kampanie Marketingowe
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadChecklist}
              className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Checklista
            </button>
            <button
              onClick={handleViewSEOPlan}
              className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> Plan SEO
            </button>
            <button
              onClick={handleAddCampaign}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2"
            >
              <Megaphone className="w-4 h-4" /> Nowa Kampania
            </button>
          </div>
        </div>
        <table className="w-full text-sm text-left text-slate-400">
          <thead className="bg-slate-900/50 uppercase text-xs font-semibold text-slate-500">
            <tr>
              <th className="px-6 py-4">Nazwa Kampanii / Fraza</th>
              <th className="px-6 py-4">Platforma</th>
              <th className="px-6 py-4">Budżet</th>
              <th className="px-6 py-4">Kliknięcia</th>
              <th className="px-6 py-4">CTR</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {campaigns.map((camp) => (
              <tr key={camp.id}>
                <td className="px-6 py-4 font-medium text-white">
                  {camp.name}
                </td>
                <td className="px-6 py-4">{camp.platform}</td>
                <td className="px-6 py-4">{camp.budget}</td>
                <td className="px-6 py-4">{camp.clicks}</td>
                <td className="px-6 py-4">{camp.ctr}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${camp.status === "Aktywna" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}
                  >
                    {camp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-400" /> Ustawienia Globalne
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-700">
              <div>
                <p className="text-sm font-bold text-white">
                  Wymuś 2FA dla wszystkich
                </p>
                <p className="text-xs text-slate-500">
                  Wymaga kodu SMS/App przy każdym logowaniu.
                </p>
              </div>
              <ToggleLeft className="w-8 h-8 text-slate-600 cursor-pointer hover:text-white" />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-700">
              <div>
                <p className="text-sm font-bold text-white">
                  Polityka Haseł (NIST)
                </p>
                <p className="text-xs text-slate-500">
                  Min. 12 znaków, znaki specjalne.
                </p>
              </div>
              <ToggleRight className="w-8 h-8 text-green-500 cursor-pointer" />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-700">
              <div>
                <p className="text-sm font-bold text-white">
                  Blokada IP (Geo-fencing)
                </p>
                <p className="text-xs text-slate-500">
                  Zezwalaj na dostęp tylko z PL/UE.
                </p>
              </div>
              <ToggleRight className="w-8 h-8 text-green-500 cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-400" /> Status Systemu
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Database (PostgreSQL)</span>
              <span className="text-green-400 font-bold">
                Online (Encryption Enabled)
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Storage (S3 - Frankfurt)</span>
              <span className="text-green-400 font-bold">
                Online (Private Access)
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Backup (Cross-Region)</span>
              <span className="text-green-400 font-bold">Synced 4h ago</span>
            </div>
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-200">
              <AlertTriangle className="w-4 h-4 inline mr-2 mb-0.5" />
              Certyfikat SSL wygasa za 45 dni. Automatyczne odnowienie włączone.
            </div>
          </div>
        </div>
      </div>

      {/* AUDIT LOG TABLE */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-700">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-400" /> Dziennik Zdarzeń
            (Audit Log)
          </h3>
          <p className="text-slate-400 text-sm">
            Pełna historia operacji w systemie.
          </p>
        </div>
        <table className="w-full text-sm text-left text-slate-400">
          <thead className="bg-slate-900/50 uppercase text-xs font-semibold text-slate-500">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Akcja</th>
              <th className="px-6 py-4">Użytkownik</th>
              <th className="px-6 py-4">Adres IP</th>
              <th className="px-6 py-4">Czas</th>
              <th className="px-6 py-4">Poziom</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {MOCK_AUDIT_LOGS.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-slate-700/30 transition-colors"
              >
                <td className="px-6 py-4 font-mono text-slate-500">
                  #{log.id}
                </td>
                <td className="px-6 py-4 font-bold text-white">{log.action}</td>
                <td className="px-6 py-4">{log.user}</td>
                <td className="px-6 py-4 font-mono text-xs">{log.ip}</td>
                <td className="px-6 py-4">{log.time}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      log.level === "WARN"
                        ? "bg-red-500/10 text-red-400"
                        : log.level === "ERROR"
                          ? "bg-red-600/20 text-red-500"
                          : "bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {log.level}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderConfig = () => (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl">
        <h3 className="font-bold text-white mb-6 flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-400" /> Ustawienia Aplikacji
        </h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Tryb Konserwacji</p>
              <p className="text-xs text-slate-400">
                Wyłącza dostęp dla klientów.
              </p>
            </div>
            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className="text-slate-400 hover:text-white"
            >
              {maintenanceMode ? (
                <ToggleRight className="w-10 h-10 text-orange-500" />
              ) : (
                <ToggleLeft className="w-10 h-10" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Rejestracja Użytkowników</p>
              <p className="text-xs text-slate-400">
                Zezwalaj na zakładanie nowych kont.
              </p>
            </div>
            <button
              onClick={() => setAllowRegistration(!allowRegistration)}
              className="text-slate-400 hover:text-white"
            >
              {allowRegistration ? (
                <ToggleRight className="w-10 h-10 text-green-500" />
              ) : (
                <ToggleLeft className="w-10 h-10" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl">
        <h3 className="font-bold text-white mb-6 flex items-center gap-2">
          <Key className="w-5 h-5 text-indigo-400" /> Konfiguracja API i
          Integracje
        </h3>
        <div className="space-y-4">
          <div className="bg-slate-900 p-3 rounded border border-slate-700">
            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">
              Google Gemini API Key
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKeyGemini}
                readOnly
                className="flex-1 bg-transparent border-none text-white text-sm focus:ring-0 px-0"
              />
              <button className="text-xs text-blue-400 hover:text-blue-300">
                Zmień
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Temperatura AI (Kreatywność)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={aiTemperature}
              onChange={(e) => setAiTemperature(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Precyzyjny (0.0)</span>
              <span className="text-white font-bold">{aiTemperature}</span>
              <span>Kreatywny (1.0)</span>
            </div>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm w-full font-medium">
            Zapisz i Restartuj Usługi
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} flex-shrink-0 bg-slate-950 border-r border-slate-800 transition-all duration-300 flex flex-col fixed h-full z-20 md:relative`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          {sidebarOpen && (
            <span className="font-bold text-xl text-white tracking-tight">
              Lex<span className="text-blue-500">Admin</span>
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
            icon={<Activity />}
            label="Przegląd"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            expanded={sidebarOpen}
          />
          <NavItem
            icon={<Users />}
            label="Użytkownicy"
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
            expanded={sidebarOpen}
          />
          <NavItem
            icon={<FileText />}
            label="Faktury & Płatności"
            active={activeTab === "invoices"}
            onClick={() => setActiveTab("invoices")}
            expanded={sidebarOpen}
          />
          <NavItem
            icon={<Megaphone />}
            label="Marketing & SEO"
            active={activeTab === "marketing"}
            onClick={() => setActiveTab("marketing")}
            expanded={sidebarOpen}
          />
          <NavItem
            icon={<ShieldAlert />}
            label="Bezpieczeństwo"
            active={activeTab === "security"}
            onClick={() => setActiveTab("security")}
            expanded={sidebarOpen}
          />
          <NavItem
            icon={<Settings />}
            label="Konfiguracja API"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
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
            {activeTab === "overview"
              ? "Panel Główny"
              : activeTab === "invoices"
                ? "Faktury i Płatności"
                : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
          <div className="flex items-center gap-4">
            <div className="bg-slate-800 rounded-full px-3 py-1 flex items-center gap-2 border border-slate-700">
              <div
                className={`w-2 h-2 rounded-full ${maintenanceMode ? "bg-orange-500 animate-pulse" : "bg-green-500 animate-pulse"}`}
              ></div>
              <span className="text-xs font-mono text-slate-300">
                {maintenanceMode ? "MAINTENANCE" : "SYSTEM ONLINE"}
              </span>
            </div>
            <button className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 relative">
              <Bell className="w-5 h-5 text-slate-300" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-800"></span>
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white">
              A
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "users" && renderUsers()}
          {activeTab === "invoices" && renderInvoices()}
          {activeTab === "marketing" && renderMarketing()}
          {activeTab === "security" && renderSecurity()}
          {activeTab === "settings" && renderConfig()}
        </div>
      </main>

      {/* ADD/EDIT USER MODAL */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowUserModal(false)}
          ></div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {editingUser ? "Edytuj Użytkownika" : "Dodaj Użytkownika"}
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Nazwa / Imię i Nazwisko
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={userFormData.name}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={userFormData.email}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Rola
                </label>
                <select
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={userFormData.role}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, role: e.target.value })
                  }
                >
                  <option>Klient Ind.</option>
                  <option>Firma (B2B)</option>
                  <option>Operator Prawny</option>
                  <option>Administrator</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Plan
                </label>
                <select
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={userFormData.plan}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, plan: e.target.value })
                  }
                >
                  <option>Standard</option>
                  <option>Subskrypcja</option>
                  <option>Subskrypcja PRO</option>
                  <option>-</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 text-slate-400 hover:bg-slate-700 rounded-lg"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-sm"
                >
                  Zapisz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD INVOICE MODAL */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowInvoiceModal(false)}
          ></div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                Generuj Nową Fakturę
              </h3>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveInvoice} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Klient / Firma
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={invoiceFormData.client}
                  onChange={(e) =>
                    setInvoiceFormData({
                      ...invoiceFormData,
                      client: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  NIP
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={invoiceFormData.nip}
                  onChange={(e) =>
                    setInvoiceFormData({
                      ...invoiceFormData,
                      nip: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Kwota (PLN)
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={invoiceFormData.amount}
                    onChange={(e) =>
                      setInvoiceFormData({
                        ...invoiceFormData,
                        amount: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Metoda Płatności
                  </label>
                  <select
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={invoiceFormData.method}
                    onChange={(e) =>
                      setInvoiceFormData({
                        ...invoiceFormData,
                        method: e.target.value,
                      })
                    }
                  >
                    <option>Przelew</option>
                    <option>BLIK</option>
                    <option>Stripe</option>
                    <option>PayPal</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Status Płatności
                </label>
                <select
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={invoiceFormData.status}
                  onChange={(e) =>
                    setInvoiceFormData({
                      ...invoiceFormData,
                      status: e.target.value,
                    })
                  }
                >
                  <option>Oczekuje</option>
                  <option>Opłacona</option>
                  <option>Zaległa</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-4 py-2 text-slate-400 hover:bg-slate-700 rounded-lg"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-sm"
                >
                  Zapisz i Wyślij
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEO CHECKLIST MODAL */}
      {showChecklistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowChecklistModal(false)}
          ></div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" /> Checklista
                SEO
              </h3>
              <button
                onClick={() => setShowChecklistModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                {[
                  "Integracja Google Search Console",
                  "Mapa witryny (sitemap.xml)",
                  "Plik robots.txt",
                  "Optymalizacja Meta Tagów (Title & Desc)",
                  "Struktura nagłówków H1-H3",
                  "Optymalizacja obrazów (Alt tags)",
                  "Szybkość ładowania (Core Web Vitals)",
                  "Responsywność (Mobile Friendly)",
                  "Certyfikat SSL (HTTPS)",
                  "Dane strukturalne (Schema.org)",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="bg-green-500/20 p-1 rounded-full">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-slate-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <div className="pt-6 flex justify-end">
                <button
                  onClick={() => {
                    alert("Pobrano raport PDF!");
                    setShowChecklistModal(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Pobierz PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO PLAN MODAL */}
      {showSEOPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSEOPlanModal(false)}
          ></div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-400" /> Strategia i Plan
                SEO
              </h3>
              <button
                onClick={() => setShowSEOPlanModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="relative border-l-2 border-slate-700 ml-4 space-y-8 pb-4">
                <div className="relative pl-8">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-green-500 rounded-full border-4 border-slate-900"></div>
                  <h4 className="text-white font-bold mb-1">
                    Faza 1: Audyt i Fundamenty
                  </h4>
                  <p className="text-xs text-green-400 font-mono mb-2">
                    UKOŃCZONO
                  </p>
                  <p className="text-sm text-slate-400">
                    Analiza techniczna, konfiguracja narzędzi Google, poprawa
                    błędów indeksacji, wdrożenie SSL.
                  </p>
                </div>
                <div className="relative pl-8">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-blue-500 rounded-full border-4 border-slate-900 animate-pulse"></div>
                  <h4 className="text-white font-bold mb-1">
                    Faza 2: Content Marketing & Topic Clusters
                  </h4>
                  <p className="text-xs text-blue-400 font-mono mb-2">
                    W TRAKCIE (Q4 2023)
                  </p>
                  <p className="text-sm text-slate-400">
                    Tworzenie treści eksperckich (YMYL), rozbudowa bloga
                    prawnego, linkowanie wewnętrzne.
                  </p>
                </div>
                <div className="relative pl-8">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-slate-600 rounded-full border-4 border-slate-900"></div>
                  <h4 className="text-white font-bold mb-1">
                    Faza 3: Link Building & PR
                  </h4>
                  <p className="text-xs text-slate-500 font-mono mb-2">
                    PLANOWANE (Q1 2024)
                  </p>
                  <p className="text-sm text-slate-400">
                    Pozyskiwanie linków z portali branżowych, współpraca z
                    partnerami, publikacje gościnne.
                  </p>
                </div>
              </div>
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 mt-4">
                <h5 className="text-sm font-bold text-slate-300 mb-2">
                  Aktualne cele (KPI):
                </h5>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">Top 3</div>
                    <div className="text-xs text-slate-500">
                      Pozycja lokalna
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">+25%</div>
                    <div className="text-xs text-slate-500">
                      Wzrost ruchu/msc
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">4.8</div>
                    <div className="text-xs text-slate-500">Średnia ocen</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
interface NavItemProps {
  icon: React.ReactElement<{ size?: string | number; className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
  expanded: boolean;
}

const NavItem = ({ icon, label, active, onClick, expanded }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" : "text-slate-400 hover:bg-slate-800 hover:text-white"} ${!expanded && "justify-center"}`}
  >
    {React.cloneElement(icon, { size: 20 })}
    {expanded && <span className="font-medium text-sm">{label}</span>}
  </button>
);

interface StatCardProps {
  icon: React.ReactElement<{ size?: string | number; className?: string }>;
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  subtext?: string;
}

const StatCard = ({
  icon,
  title,
  value,
  trend,
  trendUp,
  subtext,
}: StatCardProps) => (
  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
    <div className="flex justify-between items-start mb-4">
      <div className="bg-slate-700/50 p-3 rounded-lg">{icon}</div>
      {trend && (
        <span
          className={`flex items-center text-xs font-bold px-2 py-1 rounded ${trendUp ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}
        >
          {trendUp ? (
            <ArrowUpRight className="w-3 h-3 mr-1" />
          ) : (
            <ArrowDownRight className="w-3 h-3 mr-1" />
          )}
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-400 text-xs uppercase font-bold tracking-wider">
      {title}
    </h3>
    <p className="text-2xl font-bold text-white mt-1">{value}</p>
    {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
  </div>
);

export default AdminDashboard;
