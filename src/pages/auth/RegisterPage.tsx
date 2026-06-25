import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import UserRegisterForm from "@/features/auth/components/UserRegisterForm";
import JuryRegisterForm from "@/features/auth/components/JuryRegisterForm";
import OrganizerRegisterForm from "@/features/auth/components/OrganizerRegisterForm";
import type { RegisterRole } from "@/features/auth/model/authTypes";

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const emailFromUrl = searchParams.get("email");

  const [role, setRole] = useState<RegisterRole>("user");
  const [invitedEmail, setInvitedEmail] = useState<string | null>(emailFromUrl);
  const [isLoading, setIsLoading] = useState(!!token);
  const [tokenError, setTokenError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    async function validateInvite() {
      try {
        // const response = await api.auth.validateInvite(token);
        // setRole(response.role);
        // setInvitedEmail(response.email);_
        if (!emailFromUrl) {
          throw new Error("Missing email");
        }
        setIsLoading(false);
      } catch (error) {
        setTokenError("Ссылка для регистрации устарела или недействительна");
        setIsLoading(false);
      }
    }

    validateInvite();
  }, [token]);

  if (isLoading) {
    return (
      <div className="text-white text-center">Проверка приглашения...</div>
    );
  }

  if (tokenError) {
    return (
      <div className="text-center p-6 bg-card border border-red/20 rounded-xl">
        <h1 className="text-red text-lg font-medium mb-2">Ошибка доступа</h1>
        <p className="text-text-accent text-sm mb-4">{tokenError}</p>
        <button
          onClick={() => navigate("/")}
          className="text-white bg-red px-4 py-2 rounded-lg text-sm"
        >
          На главную
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-110 w-full mx-auto px-6 mt-6">
      <div className="mb-4 space-y-1">
        <h1 className="text-2xl text-white">
          {role === "user" && "Присоединяйся"}
          {role === "judge" && "Оценивайте проекты"}
          {role === "organizator" && "Организуйте мероприятие"}
        </h1>
        <p className="text-text-accent">
          // {role === "user" && "создайте аккаунт участника"}
          {role === "judge" && "создайте аккаунт жюри мероприятия"}
          {role === "organizator" && "создайте аккаунт организатора"}
        </p>
      </div>
      <div className="grid w-full grid-cols-2 space-x-1 bg-input-background border-[1.5px] border-border py-1 px-2 h-11 rounded-sm mb-4 text-center text-sm font-medium tracking-wide">
        <Link
          to="/login"
          className="flex items-center justify-center text-center text-text-accent hover:text-white rounded-md transition-all"
        >
          Войти
        </Link>
        <div className="flex items-center justify-center bg-red text-white transition-all cursor-pointer rounded-sm">
          Зарегистрироваться
        </div>
      </div>

      {role === "user" && <UserRegisterForm />}
      {role === "judge" && (
        <JuryRegisterForm token={token!} email={invitedEmail!} />
      )}
      {role === "organizator" && (
        <OrganizerRegisterForm token={token!} email={invitedEmail!} />
      )}
    </div>
  );
}
