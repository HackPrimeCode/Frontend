import { useParams, useNavigate, Link } from "react-router";
import { useSelector } from "react-redux";
import { X, Mail, ShieldAlert, Loader2, LogIn, UserPlus } from "lucide-react";
import { selectIsAuthenticated } from "@/features/auth/model/authSlice";
import { Button } from "@/components/ui/button";
import {
  useAcceptInviteMutation,
  useDeclineInviteMutation,
  useValidateInviteQuery,
} from "@/features/invites/inviteApi";

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectIsAuthenticated);

  const {
    data: invite,
    isLoading: isValidating,
    error: validationError,
  } = useValidateInviteQuery(token ?? "", { skip: !token });

  const [acceptInvite, { isLoading: isAccepting }] = useAcceptInviteMutation();
  const [declineInvite, { isLoading: isDeclining }] =
    useDeclineInviteMutation();

  const handleAccept = async () => {
    if (!token) return;
    try {
      await acceptInvite(token).unwrap();
      navigate("/team");
    } catch (err) {
      console.error("Не удалось принять приглашение:", err);
    }
  };

  const handleDecline = async () => {
    if (!token) return;
    try {
      await declineInvite(token).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Не удалось отклонить приглашение:", err);
    }
  };

  if (isValidating) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 text-red animate-spin" />
      </div>
    );
  }

  if (validationError || !invite) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center max-w-sm w-full bg-card-background border border-border rounded-lg p-6 text-center">
          <ShieldAlert className="w-12 h-12 text-red mb-4" />
          <h3 className="text-white text-base mb-2 font-medium">
            Приглашение недействительно
          </h3>
          <p className="text-xs text-text-accent leading-relaxed mb-6">
            Ссылка устарела, была использована ранее или содержит ошибку.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="w-full h-9 bg-border text-white text-xs rounded hover:bg-border/80"
          >
            На главную
          </Button>
        </div>
      </div>
    );
  }

  const teamInitial = invite.team_name
    ? invite.team_name[0]?.toUpperCase()
    : "?";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background">
      <div className="relative w-full max-w-110 bg-card-background border-2 border-border rounded-lg flex flex-col p-4.5 text-white animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 text-text-accent hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        <div className="flex items-center gap-2 text-red text-[11px] uppercase tracking-wider mb-2 font-medium">
          <Mail className="w-3.5 h-3.5 text-red" />
          <span>Приглашение в команду</span>
        </div>

        <h2 className="mb-5">Вас пригласили в команду</h2>

        <div className="flex items-center justify-start border-t border-border py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg text-white bg-red">
              {teamInitial}
            </div>
            <span className="text-white text-lg">{invite.team_name}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mb-5">
          <h4 className="text-xs text-text-accent uppercase">О команде</h4>
          <p className="text-xs text-white">
            {invite.role === "participant"
              ? "Вас пригласили принять участие в разработке проекта. Объединяйте усилия, пишите чистый код и побеждайте!"
              : "Вас пригласили в качестве эксперта для оценивания решений участников на данном мероприятии."}
          </p>
        </div>

        <div className="flex flex-col gap-1.5 mb-6">
          <h4 className="text-xs text-text-accent uppercase">Мероприятие</h4>
          <div className="w-full h-10 bg-input-background border border-border rounded px-3 flex items-center justify-between text-xs">
            <span className="truncate pr-4">{invite.hackathon_title}</span>
          </div>
        </div>

        {isAuthenticated ? (
          <div className="flex items-center gap-3 w-full">
            <Button
              onClick={handleAccept}
              disabled={isAccepting || isDeclining}
              className="flex-1 h-10 bg-[#00E87A] hover:bg-[#00E87A]/90 text-white text-xs rounded-md cursor-pointer transition-colors"
            >
              {isAccepting ? "Принятие..." : "Принять"}
            </Button>
            <Button
              onClick={handleDecline}
              disabled={isAccepting || isDeclining}
              className="flex-1 h-10 bg-red hover:bg-red/90 text-white text-xs rounded-md cursor-pointer transition-colors"
            >
              {isDeclining ? "Отклонение..." : "Отклонить"}
            </Button>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-3">
            <div className="text-center p-3 bg-red/5 border border-dashed border-red/30 rounded-md text-[11px] text-text-accent">
              Чтобы принять приглашение, необходимо авторизоваться под email{" "}
              <span className="text-white font-medium">{invite.email}</span>
            </div>

            <div className="flex gap-3 w-full">
              <Link
                to={`/login?redirect=/invite/${token}`}
                className="flex-1 flex items-center justify-center gap-2 h-10 bg-red hover:bg-red/90 text-white text-xs font-medium rounded-md transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Войти</span>
              </Link>
              <Link
                to={`/register?redirect=/invite/${token}`}
                className="flex-1 flex items-center justify-center gap-2 h-10 bg-border hover:bg-border/80 text-white text-xs font-medium rounded-md transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Регистрация</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
