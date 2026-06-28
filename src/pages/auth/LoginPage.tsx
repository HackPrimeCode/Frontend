import LoginForm from "@/features/auth/components/LoginForm";
import { Link } from "react-router";

export default function LoginPage() {
  return (
    <div className="max-w-110 w-full mx-auto px-6 mt-14 min-h-[calc(100vh-3.75rem)">
      <div className="mb-4 space-y-1">
        <h1 className="text-2xl text-white">С возвращением</h1>
        <p className="text-text-accent">// войдите в аккаунт</p>
      </div>
      <div className="grid w-full grid-cols-2 space-x-1 bg-input-background border-[1.5px] border-border py-1 px-2 h-11 rounded-sm mb-6 text-center text-sm  tracking-wide">
        <div className="flex items-center justify-center bg-red text-white transition-all cursor-pointer rounded-sm">
          Войти
        </div>
        <Link
          to="/register"
          className="flex items-center justify-center text-center text-text-accent hover:text-white rounded-md transition-all"
        >
          Зарегистрироваться
        </Link>
      </div>
      <LoginForm />
    </div>
  );
}
