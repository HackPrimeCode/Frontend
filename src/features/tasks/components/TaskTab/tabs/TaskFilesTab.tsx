import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { File } from "@/features/hackathons/model/hackathonTypes";

interface TaskFilesTabProps {
  files: File[];
}

export default function TaskFilesTab({ files }: TaskFilesTabProps) {
  const handleDownload = (fileName: string) => {
    console.log(`Скачивание файла: ${fileName}`);
  };

  return (
    <div className="flex flex-col gap-2.5 animate-fadeIn w-full">
      {files.map((file, idx) => (
        <div
          key={idx}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-3.5 bg-card-background border border-border rounded-lg min-w-0"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <FileText className="w-4 h-4 text-red shrink-0" />
            <span className="text-xs text-white truncate">{file.name}</span>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t border-border/20 sm:border-none">
            <span className="text-[0.6875rem] text-text-accent border border-border px-1.5 py-0.5 rounded-sm">
              {file.size}
            </span>
            <Button
              size="sm"
              className="h-8 px-4 border-red text-red bg-red/6 hover:bg-red/25 text-sm flex items-center gap-1.5 cursor-pointer rounded"
              onClick={() => handleDownload(file.name)}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Скачать</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
