import LoginForm from "@/features/auth/components/LoginForm";
import { Link } from "react-router";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md mx-auto px-2 sm:px-0 lg:mt-10 flex flex-col justify-center">
      <div className="mb-4 space-y-1 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl text-white font-medium">
          С возвращением
        </h1>
        <p className="text-xs sm:text-sm text-text-accent">
          // войдите в аккаунт
        </p>
      </div>

      <div className="grid w-full grid-cols-2 p-1 bg-input-background border border-border h-11 rounded-lg mb-6 text-center text-xs sm:text-sm tracking-wide">
        <div className="flex items-center justify-center bg-red text-white transition-all cursor-pointer rounded-md font-medium">
          Войти
        </div>
        <Link
          to="/register"
          className="flex items-center justify-center text-center text-text-accent hover:text-white rounded-md transition-all font-medium"
        >
          Регистрация
        </Link>
      </div>

      <LoginForm />
    </div>
  );
}
