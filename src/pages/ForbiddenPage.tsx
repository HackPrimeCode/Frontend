import { useNavigate } from "react-router";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background select-none">
      <div className="relative w-full max-w-100 bg-card-background border-2 border-border rounded-lg flex flex-col items-center p-6 text-center text-white animate-in fade-in zoom-in-95 duration-150">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red/10 border border-red/20 text-red mb-5">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="text-[11px] font-bold text-red uppercase tracking-widest mb-1">
          Доступ ограничен
        </span>

        <h2 className="text-xl font-medium mb-2 tracking-wide">
          Недостаточно прав
        </h2>

        <p className="text-xs text-text-accent leading-relaxed mb-6 max-w-75">
          У вашего аккаунта нет доступа к этому разделу платформы. Обратитесь к
          организаторам, если это ошибка.
        </p>

        <div className="flex gap-3 w-full">
          <Button
            onClick={() => navigate(-1)}
            className="flex-1 h-10 bg-border hover:bg-border/80 text-white text-xs font-medium rounded-md transition-colors duration-150 cursor-pointer"
          >
            Назад
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="flex-1 h-10 bg-red hover:bg-red/85 text-white text-xs font-medium rounded-md transition-colors duration-150 cursor-pointer tracking-wider"
          >
            На главную
          </Button>
        </div>
      </div>
    </div>
  );
}
