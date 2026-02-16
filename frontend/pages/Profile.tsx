import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Shield,
  CreditCard,
  Lock,
  MapPin,
  Smartphone,
  FileText,
  Download,
  AlertTriangle,
  ScanFace,
  Trash2,
  X,
  Printer,
  Mail,
  LogOut,
  HardDrive,
  Eye,
  EyeOff,
} from "lucide-react";
import { usersApi, authApi } from "../services/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";

const profileSchema = z.object({
  firstName: z.string().min(2, "Imię musi mieć min. 2 znaki"),
  lastName: z.string().min(2, "Nazwisko musi mieć min. 2 znaki"),
  pesel: z
    .string()
    .regex(/^\d{11}$/, "PESEL musi składać się z 11 cyfr")
    .optional()
    .or(z.literal("")),
  idNumber: z.string().optional(),
  phone: z.string().optional(),
  addressStreet: z.string().min(3, "Ulica jest wymagana"),
  addressCity: z.string().min(2, "Miejscowość jest wymagana"),
  addressPost: z
    .string()
    .regex(/^\d{2}-\d{3}$/, "Kod pocztowy musi być w formacie XX-XXX"),
  email: z.string().email(), // Read-only but good to have in schema
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Obecne hasło jest wymagane"),
    newPassword: z.string().min(8, "Nowe hasło musi mieć min. 8 znaków"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Hasła muszą być identyczne",
    path: ["confirmPassword"],
  });

type ProfileFormInputs = z.infer<typeof profileSchema>;
type PasswordFormInputs = z.infer<typeof passwordSchema>;

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: string;
  items: string;
  type: string;
}

// MOCK INVOICES/DOCS
const MOCK_INVOICES = [
  {
    id: "FV/2023/11/05",
    date: "2023-11-05",
    amount: "49.00 PLN",
    status: "Opłacona",
    items: "Wzór: Umowa Najmu Okazjonalnego",
    type: "invoice",
  },
  {
    id: "FV/2023/10/22",
    date: "2023-10-22",
    amount: "89.00 PLN",
    status: "Opłacona",
    items: "Usługa: Weryfikacja Ekspres",
    type: "invoice",
  },
  {
    id: "DOC/2023/09/10",
    date: "2023-09-10",
    amount: "-",
    status: "Gotowy",
    items: "Pismo: Wezwanie do zapłaty",
    type: "document",
  },
];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState<
    "personal" | "payments" | "security"
  >("personal");
  const [previewDocument, setPreviewDocument] = useState<Invoice | null>(null);

  // PROFILE FORM
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    setValue: setProfileValue,
    watch: watchProfile,
  } = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      pesel: "",
      idNumber: "",
      phone: "",
      addressStreet: "",
      addressCity: "",
      addressPost: "",
      email: "",
    },
  });

  const userData = watchProfile(); // Sync with sidebar

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // PASSWORD FORM
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<PasswordFormInputs>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await authApi.getMe();
        if (data.profile) {
          // Parse address if possible
          let street = "",
            post = "",
            city = "";
          if (data.profile.address) {
            const parts = data.profile.address.split(", ");
            street = parts[0] || "";
            if (parts[1]) {
              const cityParts = parts[1].split(" ");
              post = cityParts[0] || "";
              city = cityParts.slice(1).join(" ") || "";
            }
          }

          setProfileValue("firstName", data.profile.first_name || "");
          setProfileValue("lastName", data.profile.last_name || "");
          setProfileValue("pesel", data.profile.pesel || "");
          setProfileValue("idNumber", ""); // Not in backend yet
          setProfileValue("email", data.email);
          setProfileValue("phone", ""); // Not in backend yet
          setProfileValue("addressStreet", street);
          setProfileValue("addressCity", city);
          setProfileValue("addressPost", post);
        } else {
          // If no profile, still set email
          setProfileValue("email", data.email);
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUserData();
  }, [setProfileValue]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const onSubmitProfile = async (data: ProfileFormInputs) => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const address = `${data.addressStreet}, ${data.addressPost} ${data.addressCity}`;

      await usersApi.updateProfile({
        first_name: data.firstName,
        last_name: data.lastName,
        pesel: data.pesel,
        address: address,
      });

      setSaveMessage({
        type: "success",
        text: "Zmiany zostały zapisane pomyślnie.",
      });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Błąd podczas zapisywania zmian.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmitPassword = async (data: PasswordFormInputs) => {
    setIsChangingPassword(true);
    setPasswordMessage(null);

    try {
      await usersApi.changePassword({
        current_password: data.currentPassword,
        new_password: data.newPassword,
      });

      setPasswordMessage({
        type: "success",
        text: "Hasło zostało zmienione.",
      });
      resetPasswordForm(); // Clear form
      setTimeout(() => setShowPasswordForm(false), 2000);
    } catch (error) {
      setPasswordMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Błąd zmiany hasła.",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleShare = (platform: string, fileName: string) => {
    let msg = "";
    if (platform === "whatsapp") {
      msg = `Udostępniam dokument: ${fileName} przez WhatsApp (Szyfrowane)`;
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
    } else if (platform === "gmail") {
      window.open(
        `mailto:?subject=Dokument z LexPortal&body=W załączeniu przesyłam dokument: ${fileName}`,
        "_blank",
      );
    } else if (platform === "drive") {
      alert(`Zapisano ${fileName} na Google Drive (Symulacja API)`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const openDocumentPreview = (doc: Invoice) => {
    setPreviewDocument(doc);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "personal":
        return (
          <form
            onSubmit={handleProfileSubmit(onSubmitProfile)}
            className="space-y-6 animate-in fade-in"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Dane Osobowe
              </h2>
              <div className="flex items-center gap-4">
                {saveMessage && (
                  <span
                    className={`text-sm font-medium ${saveMessage.type === "success" ? "text-green-600" : "text-red-600"} animate-in fade-in slide-in-from-right-2`}
                  >
                    {saveMessage.text}
                  </span>
                )}
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 ${isSaving ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isSaving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Zapisywanie...
                    </>
                  ) : (
                    "Zapisz zmiany"
                  )}
                </button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Imię
                </label>
                <input
                  type="text"
                  {...registerProfile("firstName")}
                  className={`w-full border rounded-lg px-3 py-2 text-slate-900 dark:text-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none ${profileErrors.firstName ? "border-red-500" : "border-slate-300 dark:border-slate-700"}`}
                />
                {profileErrors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {profileErrors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Nazwisko
                </label>
                <input
                  type="text"
                  {...registerProfile("lastName")}
                  className={`w-full border rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none ${profileErrors.lastName ? "border-red-500" : "border-slate-300"}`}
                />
                {profileErrors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {profileErrors.lastName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  PESEL
                </label>
                <input
                  type="text"
                  {...registerProfile("pesel")}
                  className={`w-full border rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none ${profileErrors.pesel ? "border-red-500" : "border-slate-300 bg-slate-50"}`}
                />
                {profileErrors.pesel && (
                  <p className="text-red-500 text-xs mt-1">
                    {profileErrors.pesel.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Nr Dowodu Osobistego
                </label>
                <input
                  type="text"
                  {...registerProfile("idNumber")}
                  className={`w-full border rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none ${profileErrors.idNumber ? "border-red-500" : "border-slate-300"}`}
                />
              </div>
              <div className="md:col-span-2 pt-4 border-t border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Adres Zamieszkania
                </h3>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Ulica i numer
                </label>
                <input
                  type="text"
                  {...registerProfile("addressStreet")}
                  className={`w-full border rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none ${profileErrors.addressStreet ? "border-red-500" : "border-slate-300"}`}
                />
                {profileErrors.addressStreet && (
                  <p className="text-red-500 text-xs mt-1">
                    {profileErrors.addressStreet.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Kod Pocztowy
                </label>
                <input
                  type="text"
                  {...registerProfile("addressPost")}
                  className={`w-full border rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none ${profileErrors.addressPost ? "border-red-500" : "border-slate-300"}`}
                />
                {profileErrors.addressPost && (
                  <p className="text-red-500 text-xs mt-1">
                    {profileErrors.addressPost.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Miejscowość
                </label>
                <input
                  type="text"
                  {...registerProfile("addressCity")}
                  className={`w-full border rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none ${profileErrors.addressCity ? "border-red-500" : "border-slate-300"}`}
                />
                {profileErrors.addressCity && (
                  <p className="text-red-500 text-xs mt-1">
                    {profileErrors.addressCity.message}
                  </p>
                )}
              </div>
              <div className="md:col-span-2 pt-4 border-t border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" /> Dane Kontaktowe
                </h3>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...registerProfile("email")}
                  readOnly
                  className="w-full border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-slate-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Telefon
                </label>
                <input
                  type="text"
                  {...registerProfile("phone")}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </form>
        );
      case "payments":
        return (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Historia Zamówień i Dokumenty
              </h2>
              <button className="text-sm border border-slate-300 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50">
                Pobierz zbiorczo (ZIP)
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 mb-6">
              <CreditCard className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-blue-900">
                  Wszystkie płatności są zabezpieczone
                </p>
                <p className="text-xs text-blue-700">
                  Twoje faktury są generowane automatycznie przez integrację z
                  Fakturownia.pl / wFirma.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {MOCK_INVOICES.map((doc, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-blue-300 transition-colors shadow-sm"
                >
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-100 pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {doc.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${doc.status === "Opłacona" || doc.status === "Gotowy" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                        >
                          {doc.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">
                        {doc.date} • {doc.amount}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {doc.type === "invoice" && (
                        <button
                          onClick={() => openDocumentPreview(doc)}
                          className="flex items-center gap-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg transition-colors"
                        >
                          <FileText className="w-4 h-4" /> Faktura
                        </button>
                      )}
                      <button
                        onClick={() => openDocumentPreview(doc)}
                        className="flex items-center gap-1 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors shadow-sm"
                      >
                        <Download className="w-4 h-4" />{" "}
                        {doc.type === "invoice" ? "Pobierz Pismo" : "Pobierz"}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-slate-50 rounded border border-slate-200">
                        <FileText className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {doc.items}
                        </p>
                        <p className="text-xs text-slate-500">
                          Generowany automatycznie
                        </p>
                      </div>
                    </div>

                    {/* SHARING OPTIONS */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium mr-2 hidden md:inline">
                        Udostępnij bezpiecznie:
                      </span>
                      <button
                        onClick={() => handleShare("whatsapp", doc.id)}
                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                        title="WhatsApp"
                      >
                        <Smartphone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleShare("gmail", doc.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Gmail"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleShare("drive", doc.id)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Google Drive"
                      >
                        <HardDrive className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "security":
        return (
          <form
            onSubmit={handlePasswordSubmit(onSubmitPassword)}
            className="space-y-6 animate-in fade-in"
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Bezpieczeństwo i Compliance
            </h2>
            <div className="bg-green-50 border border-green-200 p-6 rounded-xl flex items-start gap-4">
              <div className="p-3 bg-white rounded-full shadow-sm">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-green-900 text-lg">
                  Twoje dane są chronione
                </h3>
                <p className="text-green-700 text-sm mt-1">
                  Wszystkie pliki są szyfrowane w spoczynku (Encryption at
                  Rest). Dostęp do dokumentów masz tylko Ty i wskazani prawnicy
                  (Tajemnica zawodowa).
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    Weryfikacja dwuetapowa (2FA)
                  </p>
                  <p className="text-xs text-slate-500">
                    Aktywna: SMS na numer ...700
                  </p>
                </div>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                  <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <ScanFace className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">
                      Status weryfikacji KYC / AML
                    </p>
                    <p className="text-xs text-slate-500">
                      Wymagane dla usług powyżej 1000 EUR
                    </p>
                  </div>
                </div>
                <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">
                  Nieweryfikowany
                </span>
              </div>

              <div className="p-4 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between pointer-events-none mb-4">
                  <div>
                    <p className="font-bold text-slate-800">Zmień hasło</p>
                    <p className="text-xs text-slate-500">
                      Ostatnia zmiana: 30 dni temu
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="pointer-events-auto px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50"
                  >
                    {showPasswordForm ? "Anuluj" : "Zmień"}
                  </button>
                </div>

                {showPasswordForm && (
                  <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                    {passwordMessage && (
                      <div
                        className={`text-sm p-3 rounded-lg ${passwordMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {passwordMessage.text}
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                        Obecne hasło
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          {...registerPassword("currentPassword")}
                          className={`w-full border rounded-lg px-3 py-2 text-slate-900 dark:text-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none pr-10 ${passwordErrors.currentPassword ? "border-red-500" : "border-slate-300 dark:border-slate-700"}`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className="text-red-500 text-xs mt-1">
                          {passwordErrors.currentPassword.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                        Nowe hasło
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          {...registerPassword("newPassword")}
                          className={`w-full border rounded-lg px-3 py-2 text-slate-900 dark:text-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none pr-10 ${passwordErrors.newPassword ? "border-red-500" : "border-slate-300 dark:border-slate-700"}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="text-red-500 text-xs mt-1">
                          {passwordErrors.newPassword.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                        Powtórz nowe hasło
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          {...registerPassword("confirmPassword")}
                          className={`w-full border rounded-lg px-3 py-2 text-slate-900 dark:text-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none pr-10 ${passwordErrors.confirmPassword ? "border-red-500" : "border-slate-300 dark:border-slate-700"}`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">
                          {passwordErrors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isChangingPassword
                        ? "Zmienianie..."
                        : "Zatwierdź zmianę hasła"}
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" /> Strefa RODO
                  (GDPR)
                </h3>
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-red-900 text-sm">
                      Prawo do bycia zapomnianym
                    </p>
                    <p className="text-xs text-red-700">
                      Trwale usuń konto i zanonimizuj dane w bazie.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      window.confirm(
                        "Czy na pewno chcesz usunąć konto? Ta operacja jest nieodwracalna i spowoduje anonimizację danych.",
                      )
                    }
                    className="bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Usuń konto
                  </button>
                </div>
              </div>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 min-h-[600px] flex flex-col md:flex-row transition-colors duration-200">
        {/* Sidebar */}
        <div className="md:w-72 bg-slate-50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 p-6 shrink-0 no-print">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold text-white border-4 border-white dark:border-slate-800 shadow-md mb-3">
              JK
            </div>
            <h2 className="font-bold text-slate-900 dark:text-white">
              Jan Kowalski
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Klient Indywidualny
            </p>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveSection("personal")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeSection === "personal" ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            >
              <User className="w-4 h-4" /> Dane Osobowe
            </button>
            <button
              onClick={() => setActiveSection("payments")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeSection === "payments" ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            >
              <CreditCard className="w-4 h-4" /> Płatności i Dokumenty
            </button>
            <button
              onClick={() => setActiveSection("security")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeSection === "security" ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            >
              <Lock className="w-4 h-4" /> Bezpieczeństwo
            </button>
            <div className="my-4 border-t border-slate-200"></div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-auto"
            >
              <LogOut className="w-4 h-4" /> Wyloguj
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto">{renderContent()}</div>
      </div>

      {/* DOCUMENT PREVIEW / PRINT MODAL */}
      {previewDocument && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:bg-white print:p-0 print:block">
          <div className="bg-white w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col print:h-auto print:shadow-none print:w-full print:max-w-none print:rounded-none">
            {/* Modal Header (Hidden on Print) */}
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center no-print">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-amber-500" />
                <h3 className="font-bold text-lg">{previewDocument.items}</h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4" /> Drukuj / Zapisz jako PDF
                </button>
                <button
                  onClick={() => setPreviewDocument(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Document Content (Visible on Print) */}
            <div className="flex-1 overflow-y-auto p-12 bg-slate-50 print:bg-white print:p-0 print:overflow-visible print-area">
              <div className="max-w-[210mm] mx-auto bg-white shadow-sm p-[15mm] min-h-[297mm] print:shadow-none print:min-h-0 print:w-full">
                {/* INVOICE / DOCUMENT TEMPLATE */}
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2 uppercase">
                      {previewDocument.type === "invoice"
                        ? "Faktura VAT"
                        : "Dokument"}
                    </h1>
                    <p className="text-slate-500 text-sm">
                      Nr:{" "}
                      <span className="font-mono text-slate-900">
                        {previewDocument.id}
                      </span>
                    </p>
                    <p className="text-slate-500 text-sm">
                      Data: {previewDocument.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900 flex items-center gap-2 justify-end">
                      <Shield className="w-8 h-8 text-amber-500" /> LexPortal
                    </div>
                    <p className="text-sm text-slate-500 mt-2">
                      LexPortal Sp. z o.o.
                      <br />
                      ul. Prawnicza 100
                      <br />
                      00-001 Warszawa
                      <br />
                      NIP: 525-000-00-00
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-12">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Sprzedawca / Nadawca
                    </h4>
                    <p className="font-bold text-slate-900">
                      LexPortal Sp. z o.o.
                    </p>
                    <p className="text-sm text-slate-600">
                      ul. Prawnicza 100, 00-001 Warszawa
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Nabywca / Odbiorca
                    </h4>
                    <p className="font-bold text-slate-900">
                      {userData.firstName} {userData.lastName}
                    </p>
                    <p className="text-sm text-slate-600">
                      {userData.addressStreet}
                    </p>
                    <p className="text-sm text-slate-600">
                      {userData.addressPost} {userData.addressCity}
                    </p>
                  </div>
                </div>

                {previewDocument.type === "invoice" ? (
                  <>
                    <table className="w-full mb-12">
                      <thead className="border-b-2 border-slate-100">
                        <tr>
                          <th className="text-left py-3 text-sm font-bold text-slate-600">
                            Nazwa usługi / towaru
                          </th>
                          <th className="text-right py-3 text-sm font-bold text-slate-600">
                            Ilość
                          </th>
                          <th className="text-right py-3 text-sm font-bold text-slate-600">
                            Wartość Brutto
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-50">
                          <td className="py-4 text-slate-800">
                            {previewDocument.items}
                          </td>
                          <td className="py-4 text-right text-slate-800">1</td>
                          <td className="py-4 text-right font-bold text-slate-900">
                            {previewDocument.amount}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="flex justify-end border-t-2 border-slate-100 pt-6">
                      <div className="text-right">
                        <p className="text-sm text-slate-500 mb-1">
                          Razem do zapłaty:
                        </p>
                        <p className="text-3xl font-bold text-slate-900">
                          {previewDocument.amount}
                        </p>
                        <p className="text-xs text-green-600 font-bold mt-2 uppercase">
                          {previewDocument.status}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="prose max-w-none text-slate-800 leading-relaxed text-justify">
                    <h3 className="text-center font-bold text-xl mb-8 uppercase">
                      {previewDocument.items.replace("Pismo: ", "")}
                    </h3>
                    <p>
                      W odpowiedzi na Państwa wniosek z dnia{" "}
                      {previewDocument.date}, przesyłamy niniejsze pismo
                      przygotowane w systemie LexPortal.
                    </p>
                    <p>
                      Treść właściwa dokumentu (Lorem ipsum dolor sit amet,
                      consectetur adipiscing elit. Proin nibh augue, suscipit a,
                      scelerisque sed, lacinia in, mi. Cras vel lorem. Etiam
                      pellentesque aliquet tellus. Phasellus pharetra nulla ac
                      diam. Quisque semper justo at risus. Donec venenatis,
                      turpis vel hendrerit interdum, dui ligula ultricies purus,
                      sed posuere libero dui id orci.)...
                    </p>
                    <p className="mt-8">Z poważaniem,</p>
                    <p className="font-bold">Zespół Prawny LexPortal</p>
                  </div>
                )}

                <div className="mt-24 pt-8 border-t border-slate-100 text-center text-xs text-slate-400">
                  Dokument wygenerowany elektronicznie w systemie LexPortal. Nie
                  wymaga podpisu pieczęcią.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
