import React, { useCallback, useState } from "react";
import { Upload, X, File as FileIcon, AlertCircle } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in bytes
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = ".pdf,.doc,.docx,.jpg,.png",
  maxSize = 10 * 1024 * 1024, // 10MB default
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const validateFile = useCallback(
    (file: File): boolean => {
      setError(null);
      if (file.size > maxSize) {
        setError(
          `Plik jest zbyt duży. Maksymalny rozmiar to ${maxSize / 1024 / 1024}MB.`,
        );
        return false;
      }
      // Simple extension check could be added here if accept is strict
      return true;
    },
    [maxSize],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (validateFile(file)) {
          setSelectedFile(file);
          onFileSelect(file);
        }
      }
    },
    [onFileSelect, validateFile],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <label
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
            }
            ${error ? "border-red-500 bg-red-50 dark:bg-red-900/10" : ""}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload
              className={`w-8 h-8 mb-3 ${isDragging ? "text-blue-500" : "text-slate-400"}`}
            />
            <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold">Kliknij, aby wybrać</span> lub
              przeciągnij plik
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              PDF, DOC, JPG (max. {maxSize / 1024 / 1024}MB)
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleChange}
          />
        </label>
      ) : (
        <div className="flex items-center p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
          <FileIcon className="w-8 h-8 text-blue-500 mr-3" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <button
            onClick={removeFile}
            className="ml-2 p-1 text-slate-400 hover:text-red-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
