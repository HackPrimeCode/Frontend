import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import UserRegisterForm from "@/features/auth/components/UserRegisterForm";
import JuryRegisterForm from "@/features/auth/components/JuryRegisterForm";
import OrganizerRegisterForm from "@/features/auth/components/OrganizerRegisterForm";
import type { RegisterRole } from "@/features/auth/model/authTypes";

export default function RegisterPage() {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const emailFromUrl = searchParams.get("email");

  const [role, _setRole] = useState<RegisterRole>("user");
  const [invitedEmail, _setInvitedEmail] = useState<string | null>(
    emailFromUrl,
  );
  const [isLoading, setIsLoading] = useState(!!token);
  const [tokenError, setTokenError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    async function validateInvite() {
      try {
        if (!emailFromUrl) {
          throw new Error("Missing email");
        }
        setIsLoading(false);
      } catch (error) {
        setTokenError("Невалидный или просроченный токен приглашения");
        setIsLoading(false);
      }
    }

    validateInvite();
  }, [token, emailFromUrl]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center text-white py-10">
        <span className="animate-pulse text-sm">Проверка приглашения...</span>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="w-full max-w-md mx-auto px-2 sm:px-0 text-center py-6">
        <div className="text-red text-sm border border-red/20 bg-red/5 px-4 py-4 rounded-lg">
          {tokenError}
        </div>
        <Link
          to="/login"
          className="text-sm text-red hover:underline block mt-4"
        >
          Вернуться ко входу
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-2 sm:px-0 flex flex-col justify-center">
      <div className="mb-4 space-y-1 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl text-white font-medium">
          {role === "user" && "Присоединяйся"}
          {role === "judge" && "Оценивайте проекты"}
          {role === "organizator" && "Организуйте мероприятие"}
        </h1>
        <p className="text-xs sm:text-sm text-text-accent">
          // {role === "user" && "создайте аккаунт участника"}
          {role === "judge" && "создайте аккаунт жюри мероприятия"}
          {role === "organizator" && "создайте аккаунт организатора"}
        </p>
      </div>

      <div className="grid w-full grid-cols-2 p-1 bg-input-background border border-border h-11 rounded-lg mb-6 text-center text-xs sm:text-sm tracking-wide">
        <Link
          to="/login"
          className="flex items-center justify-center text-center text-text-accent hover:text-white rounded-md transition-all font-medium"
        >
          Войти
        </Link>
        <div className="flex items-center justify-center bg-red text-white transition-all cursor-pointer rounded-md font-medium">
          Регистрация
        </div>
      </div>

      {role === "user" && <UserRegisterForm />}
      {role === "judge" && (
        <JuryRegisterForm token={token || ""} email={invitedEmail || ""} />
      )}
      {role === "organizator" && (
        <OrganizerRegisterForm token={token || ""} email={invitedEmail || ""} />
      )}
    </div>
  );
}
