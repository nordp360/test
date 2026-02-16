import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Building2,
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Simple Google Icon Component
const GoogleIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const registerSchema = z
  .object({
    firstName: z.string().min(2, "Imię musi mieć min. 2 znaki"),
    lastName: z.string().min(2, "Nazwisko musi mieć min. 2 znaki"),
    email: z.string().email("Nieprawidłowy adres email"),
    password: z.string().min(8, "Hasło musi mieć min. 8 znaków"),
    confirmPassword: z.string(),
    companyName: z.string().optional(),
    nip: z
      .string()
      .regex(/^\d{10}$/, "NIP musi składać się z 10 cyfr")
      .optional()
      .or(z.literal("")),
    address: z.string().min(3, "Adres jest wymagany"),
    city: z.string().min(2, "Miejscowość jest wymagana"),
    zip: z
      .string()
      .regex(/^\d{2}-\d{3}$/, "Kod pocztowy musi być w formacie XX-XXX"),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "Wymagana akceptacja regulaminu",
    }),
    rodoAccepted: z.boolean().optional(), // This will be required conditionally
    marketingAccepted: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła muszą być identyczne",
    path: ["confirmPassword"],
  });

type RegisterFormInputs = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<"individual" | "company">(
    "individual",
  );
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register: registerUser } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      nip: "",
      address: "",
      city: "",
      zip: "",
      termsAccepted: false,
      rodoAccepted: false,
      marketingAccepted: false,
    },
  });

  // Watch for changes in accountType to conditionally validate company fields
  const watchedAccountType = accountType; // Use local state for account type

  // Reset company fields when switching account type
  const handleAccountTypeChange = (type: "individual" | "company") => {
    setAccountType(type);
    if (type === "individual") {
      setValue("companyName", "");
      setValue("nip", "");
      setValue("rodoAccepted", false); // Reset RODO for individual
      clearErrors(["companyName", "nip", "rodoAccepted"]);
    }
  };

  const onSubmit = async (data: RegisterFormInputs) => {
    setLoading(true);
    setApiError(null);

    // Manual validation for company-specific fields if accountType is company
    if (watchedAccountType === "company") {
      if (!data.companyName || data.companyName.length < 2) {
        setApiError("Nazwa firmy jest wymagana.");
        setLoading(false);
        return;
      }
      if (!data.nip || !/^\d{10}$/.test(data.nip)) {
        setApiError("NIP musi składać się z 10 cyfr.");
        setLoading(false);
        return;
      }
      if (!data.rodoAccepted) {
        setApiError(
          "Akceptacja Umowy Powierzenia Przetwarzania Danych Osobowych jest wymagana dla firm.",
        );
        setLoading(false);
        return;
      }
    }

    try {
      await registerUser({
        email: data.email,
        password: data.password,
        full_name:
          watchedAccountType === "company"
            ? data.companyName || ""
            : `${data.firstName} ${data.lastName}`.trim(),
        role: watchedAccountType === "individual" ? "client" : "company",
        // Additional fields like address, city, zip, NIP, etc., would be sent here if the backend supports them
        // For now, only basic registration data is sent to useAuth
      });
      alert("Konto zostało utworzone. Możesz się teraz zalogować.");
      navigate("/login");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Błąd rejestracji. Spróbuj ponownie.";
      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    alert("Rejestracja przez Google zostanie zintegrowana wkrótce.");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Utwórz konto w LexPortal
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Dołącz do platformy i zarządzaj sprawami prawnymi online.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors duration-200">
          {/* Account Type Toggle */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => handleAccountTypeChange("individual")}
              className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                accountType === "individual"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-b-2 border-blue-600"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <User className="w-5 h-5" /> Osoba Fizyczna
            </button>
            <button
              onClick={() => handleAccountTypeChange("company")}
              className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                accountType === "company"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-b-2 border-blue-600"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Building2 className="w-5 h-5" /> Firma
            </button>
          </div>

          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-600 animate-in fade-in zoom-in duration-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Identity Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {accountType === "individual" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Imię
                    </label>
                    <input
                      type="text"
                      {...register("firstName")}
                      className={`block w-full px-4 py-3 border ${
                        errors.firstName
                          ? "border-red-300"
                          : "border-slate-300 dark:border-slate-600"
                      } rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                      placeholder="Jan"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nazwisko
                    </label>
                    <input
                      type="text"
                      {...register("lastName")}
                      className={`block w-full px-4 py-3 border ${
                        errors.lastName
                          ? "border-red-300"
                          : "border-slate-300 dark:border-slate-600"
                      } rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                      placeholder="Kowalski"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nazwa Firmy
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        {...register("companyName")}
                        className={`block w-full pl-10 px-4 py-3 border ${
                          errors.companyName
                            ? "border-red-300"
                            : "border-slate-300 dark:border-slate-600"
                        } rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                        placeholder="Nazwa Firmy Sp. z o.o."
                      />
                    </div>
                    {errors.companyName && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.companyName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      NIP
                    </label>
                    <input
                      type="text"
                      {...register("nip")}
                      className={`block w-full px-4 py-3 border ${
                        errors.nip
                          ? "border-red-300"
                          : "border-slate-300 dark:border-slate-600"
                      } rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                      placeholder="Wpisz NIP (np. 1234567890)"
                      maxLength={10}
                    />
                    {errors.nip && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.nip.message}
                      </p>
                    )}
                  </div>
                  <div>
                    {/* Reuse firstName/lastName for representative or keep generic */}
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Imię reprezentanta
                    </label>
                    <input
                      type="text"
                      {...register("firstName")}
                      className={`block w-full px-4 py-3 border ${
                        errors.firstName
                          ? "border-red-300"
                          : "border-slate-300 dark:border-slate-600"
                      } rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                      placeholder="Jan"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nazwisko reprezentanta
                    </label>
                    <input
                      type="text"
                      {...register("lastName")}
                      className={`block w-full px-4 py-3 border ${
                        errors.lastName
                          ? "border-red-300"
                          : "border-slate-300 dark:border-slate-600"
                      } rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                      placeholder="Kowalski"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Address Section */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" /> Adres{" "}
                {accountType === "company" ? "siedziby" : "zamieszkania"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Ulica i numer
                  </label>
                  <input
                    type="text"
                    {...register("address")}
                    className={`block w-full px-4 py-3 border ${
                      errors.address
                        ? "border-red-300"
                        : "border-slate-300 dark:border-slate-600"
                    } rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                    placeholder="ul. Prawnicza 1/2"
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.address.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Kod pocztowy
                  </label>
                  <input
                    type="text"
                    {...register("zip")}
                    className={`block w-full px-4 py-3 border ${
                      errors.zip
                        ? "border-red-300"
                        : "border-slate-300 dark:border-slate-600"
                    } rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                    placeholder="00-000"
                  />
                  {errors.zip && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.zip.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Miejscowość
                  </label>
                  <input
                    type="text"
                    {...register("city")}
                    className={`block w-full px-4 py-3 border ${
                      errors.city
                        ? "border-red-300"
                        : "border-slate-300 dark:border-slate-600"
                    } rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                    placeholder="Miasto"
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400" /> Dane
                logowania
              </h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Adres Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    {...register("email")}
                    type="email"
                    className={`block w-full pl-10 px-4 py-3 border ${
                      errors.email
                        ? "border-red-300"
                        : "border-slate-300 dark:border-slate-600"
                    } rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                    placeholder="twoj@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Hasło
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      className={`block w-full pl-10 pr-10 px-4 py-3 border ${
                        errors.password
                          ? "border-red-300"
                          : "border-slate-300 dark:border-slate-600"
                      } rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                      placeholder="Minimum 8 znaków"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Powtórz hasło
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      {...register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      className={`block w-full pl-10 pr-10 px-4 py-3 border ${
                        errors.confirmPassword
                          ? "border-red-300"
                          : "border-slate-300 dark:border-slate-600"
                      } rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                      placeholder="Powtórz hasło"
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
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Consents */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    {...register("termsAccepted")}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors"></div>
                  <CheckCircle2 className="absolute w-3.5 h-3.5 text-white left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-sm text-slate-600 group-hover:text-slate-900">
                  Akceptuję{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Regulamin serwisu
                  </a>{" "}
                  <span className="text-red-500">*</span>
                </span>
              </label>
              {errors.termsAccepted && (
                <p className="ml-8 text-xs text-red-600">
                  {errors.termsAccepted.message}
                </p>
              )}

              {accountType === "company" && (
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      {...register("rodoAccepted")}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors"></div>
                    <CheckCircle2 className="absolute w-3.5 h-3.5 text-white left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-sm text-slate-600 group-hover:text-slate-900">
                    Akceptuję{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Umowę Powierzenia Przetwarzania Danych
                    </a>{" "}
                    (wymagane dla firm) <span className="text-red-500">*</span>
                  </span>
                </label>
              )}
              {accountType === "company" && errors.rodoAccepted && (
                <p className="ml-8 text-xs text-red-600">
                  {errors.rodoAccepted.message}
                </p>
              )}

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    {...register("marketingAccepted")}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors"></div>
                  <CheckCircle2 className="absolute w-3.5 h-3.5 text-white left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-sm text-slate-600 group-hover:text-slate-900">
                  Chcę otrzymywać informacje o nowościach i promocjach
                  (opcjonalne)
                </span>
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  "Tworzenie konta..."
                ) : (
                  <>
                    Utwórz konto{" "}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">
                Lub zarejestruj przez
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleRegister}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <GoogleIcon />
            Rejestracja z Google
          </button>

          <div className="text-center mt-4 text-sm text-slate-500">
            Masz już konto?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Zaloguj się
            </Link>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Twoje dane są szyfrowane i
            chronione zgodnie z RODO (Encryption at rest).
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
