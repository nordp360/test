import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  FileText,
  Calendar,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  X,
  File as FileIcon,
} from "lucide-react";
import { casesApi } from "../services/api";
import FileUpload from "../components/FileUpload";

interface Document {
  id: string;
  filename: string;
  created_at: string;
}

interface Case {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  documents?: Document[];
}

const caseSchema = z.object({
  title: z.string().min(3, "Tytuł musi mieć co najmniej 3 znaki"),
  description: z.string().min(10, "Opis musi mieć co najmniej 10 znaków"),
});

type CaseFormInputs = z.infer<typeof caseSchema>;

const Cases: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CaseFormInputs>({
    resolver: zodResolver(caseSchema),
  });

  const fetchCases = async () => {
    try {
      setLoading(true);
      const data = await casesApi.list();
      setCases(data);
      setError(null);
    } catch (err) {
      setError("Nie udało się pobrać listy spraw.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const onSubmit = async (data: CaseFormInputs) => {
    try {
      await casesApi.create(data);
      setIsModalOpen(false);
      reset();
      fetchCases();
    } catch (err) {
      console.error(err);
      setError("Nie udało się utworzyć sprawy.");
    }
  };

  const handleFileUpload = async (caseId: string, file: File) => {
    try {
      setUploading(true);
      await casesApi.uploadDocument(caseId, file);
      // Refresh cases to show new document
      await fetchCases();
    } catch (err) {
      console.error(err);
      alert("Nie udało się przesłać pliku.");
    } finally {
      setUploading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedCaseId(expandedCaseId === id ? null : id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "CLOSED":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Moje Sprawy
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Zarządzaj swoimi sprawami i dokumentami
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Nowa Sprawa
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Case List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : cases.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">
              Brak spraw
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Utwórz nową sprawę, aby rozpocząć współpracę.
            </p>
          </div>
        ) : (
          cases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-200"
            >
              <div
                className="p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-between"
                onClick={() => toggleExpand(caseItem.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {caseItem.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(caseItem.created_at).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(
                          caseItem.status,
                        )}`}
                      >
                        {caseItem.status}
                      </span>
                    </div>
                  </div>
                </div>
                {expandedCaseId === caseItem.id ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </div>

              {expandedCaseId === caseItem.id && (
                <div className="px-6 pb-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Opis sprawy:
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-wrap">
                      {caseItem.description}
                    </p>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                      Dokumenty ({caseItem.documents?.length || 0}):
                    </h4>

                    <div className="space-y-2 mb-4">
                      {caseItem.documents?.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                        >
                          <div className="flex items-center gap-3">
                            <FileIcon className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-700 dark:text-slate-200 font-medium">
                              {doc.filename}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400">
                            {new Date(doc.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                      {(!caseItem.documents ||
                        caseItem.documents.length === 0) && (
                        <p className="text-sm text-slate-500 italic">
                          Brak dokumentów.
                        </p>
                      )}
                    </div>

                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Dodaj nowy dokument
                      </p>
                      {uploading ? (
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          Przesyłanie...
                        </div>
                      ) : (
                        <FileUpload
                          onFileSelect={(file) =>
                            handleFileUpload(caseItem.id, file)
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create Case Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg relative z-10 p-6 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Nowa Sprawa
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tytuł sprawy
                </label>
                <input
                  type="text"
                  {...register("title")}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="np. Rozwód z orzekaniem o winie"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Opis
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                  placeholder="Opisz szczegóły sprawy..."
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                  Utwórz sprawę
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cases;
