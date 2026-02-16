import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Smartphone,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  X,
  Mail,
} from "lucide-react";
import { authApi } from "../services/api";
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

const loginSchema = z.object({
  email: z.string().email("Nieprawidłowy adres email"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"credentials" | "2fa">("credentials");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [code, setCode] = useState("");

  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const handleLoginSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    setError(null);

    try {
      // Authenticate credentials first
      await login(data);

      // Simulate 2FA requirement
      setLoading(false);
      setStep("2fa");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Błąd logowania. Sprawdź dane.",
      );
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert("Logowanie Google zostanie zintegrowane wkrótce.");
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(resetEmail);
      setResetSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd wysyłania linku.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate 2FA check
    setTimeout(() => {
      setLoading(false);
      const role = localStorage.getItem("userRole")?.toLowerCase() || "client";
      navigate(
        role === "admin"
          ? "/admin-dashboard"
          : role === "lawyer"
            ? "/lawyer-dashboard"
            : "/client-dashboard",
      );
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
            <ShieldCheck className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
          Bezpieczne logowanie
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          Twoje dane są chronione szyfrowaniem end-to-end.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200 dark:border-slate-800 transition-colors duration-200">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-600 animate-in fade-in zoom-in duration-300">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {step === "credentials" ? (
            <div className="space-y-6">
              <form
                className="space-y-6"
                onSubmit={handleSubmit(handleLoginSubmit)}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Adres Email
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      {...register("email")}
                      className={`appearance-none block w-full pl-10 px-3 py-2 border ${
                        errors.email
                          ? "border-red-300"
                          : "border-slate-300 dark:border-slate-600"
                      } rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                      placeholder="twoj@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Hasło
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      {...register("password")}
                      className={`appearance-none block w-full pl-10 px-3 py-2 border ${
                        errors.password
                          ? "border-red-300"
                          : "border-slate-300 dark:border-slate-600"
                      } rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                      placeholder="••••••••"
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-slate-900 dark:text-slate-300"
                    >
                      Zapamiętaj mnie
                    </label>
                  </div>

                  <div className="text-sm">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="font-medium text-blue-600 hover:text-blue-500 bg-transparent border-none p-0 cursor-pointer"
                    >
                      Nie pamiętasz hasła?
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="shrink-0">
                        <AlertCircle
                          className="h-5 w-5 text-red-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Błąd logowania
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{error}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                        Logowanie...
                      </>
                    ) : (
                      "Zaloguj się"
                    )}
                  </button>
                </div>
              </form>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-50 text-slate-500">
                    Lub zaloguj przez
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <GoogleIcon />
                  Kontynuuj z Google
                </button>
              </div>

              <div className="mt-6 text-center text-sm text-slate-500">
                Nie masz konta?{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Zarejestruj się
                </Link>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-xs text-yellow-800">
                <p className="font-bold mb-1">Dostęp testowy (Argon2):</p>
                <p>
                  Admin:{" "}
                  <span className="font-mono">
                    admin@lexportal.pl / admin123
                  </span>
                </p>
                <p>
                  Operator:{" "}
                  <span className="font-mono">
                    anna.nowak@lexportal.pl / lawyer123
                  </span>
                </p>
                <p>
                  Klient:{" "}
                  <span className="font-mono">
                    jan.kowalski@example.com / password123
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleVerify}>
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <Smartphone className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">
                  Weryfikacja dwuetapowa (2FA)
                </h3>
                <p className="text-sm text-slate-500 mt-2">
                  Wysłaliśmy kod weryfikacyjny SMS na numer kończący się na
                  ...892. Możesz też użyć Google Authenticator.
                </p>
              </div>

              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-slate-700 text-center"
                >
                  Kod weryfikacyjny (SMS/OTP)
                </label>
                <div className="mt-2">
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="000 000"
                    className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-lg text-center tracking-widest"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || code.length < 3}
                  className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    "Weryfikacja..."
                  ) : (
                    <>
                      Zaloguj bezpiecznie <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setStep("credentials")}
                  className="text-sm text-slate-500 hover:text-slate-900"
                >
                  Wróć do logowania
                </button>
              </div>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">
                  Bezpieczeństwo gwarantowane przez
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 grayscale opacity-70">
                <Lock className="w-3 h-3" /> SSL Encryption
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 grayscale opacity-70">
                <ShieldCheck className="w-3 h-3" /> RODO Compliant
              </div>
            </div>
          </div>
        </div>
      </div>
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowForgotPassword(false)}
          />
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative z-10 p-6 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {resetSent ? (
              <div className="text-center space-y-4">
                <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm">
                  Wysłaliśmy link resetujący na adres{" "}
                  <strong>{resetEmail}</strong>. Sprawdź skrzynkę odbiorczą (i
                  spam).
                </div>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetSent(false);
                    setResetEmail("");
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Zamknij
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <div className="mb-4">
                  <label
                    htmlFor="reset-email"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Adres Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      id="reset-email"
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="twoj@email.com"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                  >
                    Wyślij link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
