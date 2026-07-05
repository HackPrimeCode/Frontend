import { useState, useRef } from "react";
import { Plus, X, FileText } from "lucide-react";
import { useUploadHackathonSpecificationFilesMutation } from "@/features/organizer/api";

interface TaskFile {
  id: string;
  name: string;
  size: string;
  file: File;
}

interface OrganizerTaskFilesTabProps {
  hackathonId: number | null;
}

export default function OrganizerTaskFilesTab({ hackathonId }: OrganizerTaskFilesTabProps) {
  const [files, setFiles] = useState<TaskFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadHackathonSpecificationFiles] = useUploadHackathonSpecificationFilesMutation();

  const handleAddFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const file = selectedFiles[0];
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

    const allowedExtensions = [".pdf", ".doc", ".docx", ".txt", ".md"];

    if (!allowedExtensions.includes(fileExtension)) {
      alert("Разрешены только файлы форматов: .pdf, .doc, .docx, .txt, .md");
      return;
    }

    if (!hackathonId) {
      alert("Сначала выберите мероприятие");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      await uploadHackathonSpecificationFiles({
        hackathonId,
        formData,
      }).unwrap();

      const newFile: TaskFile = {
        id: `${Date.now()}-${file.name}`,
        name: file.name,
        size: formatFileSize(file.size),
        file,
      };

      setFiles((prev) => [...prev, newFile]);
    } catch (error) {
      console.error("Failed to upload task file:", error);
      alert("Не удалось прикрепить файл");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="flex flex-col gap-2.5 animate-fadeIn">
      {files.length === 0 ? (
        <div className="flex items-center justify-center px-3 md:px-5 py-6 md:py-8 bg-card-background border border-border rounded-lg min-h-[200px]">
          <button
            onClick={handleAddFile}
            className="flex items-center gap-2 text-text-accent hover:text-white transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="text-xs">Добавьте файл задания</span>
          </button>
        </div>
      ) : (
        <>
          {files.map((file) => (
            <div
              key={file.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 md:px-5 py-3 md:py-3.5 bg-card-background border border-border rounded-lg gap-2 sm:gap-0"
            >
              <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                <FileText className="w-4 h-4 text-red flex-shrink-0" />
                <span className="text-xs text-white truncate">{file.name}</span>
              </div>
              <div className="flex items-center gap-2 md:gap-4 self-end sm:self-auto">
                <span className="text-[0.6875rem] text-text-accent border border-border px-1.5 py-0.5 rounded-sm">
                  {file.size}
                </span>
                <button
                  onClick={() => handleDeleteFile(file.id)}
                  className="text-text-accent hover:text-red transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-center px-3 md:px-5 py-3 md:py-3 bg-card-background border border-border rounded-lg">
            <button
              onClick={handleAddFile}
              className="flex items-center gap-2 text-text-accent hover:text-white transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs">Добавьте файл задания</span>
            </button>
          </div>
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.md"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
