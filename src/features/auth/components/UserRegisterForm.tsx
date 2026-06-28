import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Hash, Lock, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { useRegisterUserMutation } from "../api/authApi";

const userRegisterFormSchema = z
  .object({
    name: z.string().min(1, "Введите полное имя"),
    email: z.email("Некорректный формат email").min(1, "Введите email"),
    password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
    confirmPassword: z.string().min(1, "Повторите пароль"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

type UserRegisterFormValues = z.infer<typeof userRegisterFormSchema>;

export default function UserRegisterForm() {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterUserMutation();
  const location = useLocation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<UserRegisterFormValues>({
    resolver: zodResolver(userRegisterFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const from = location.state?.from?.pathname || "/hub";

  async function onSubmit(data: UserRegisterFormValues) {
    try {
      setSubmitError(null);
      const { name, email, password } = data;
      await register({ name, email, password }).unwrap();
      navigate(from, { replace: true });
    } catch (err: any) {
      const detailError = err?.data?.detail;

      if (detailError === "Email already registered") {
        setSubmitError("Пользователь с таким email уже существует");
      } else {
        setSubmitError(
          typeof detailError === "string"
            ? detailError
            : "Ошибка подключения к серверу",
        );
      }
    }
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <FieldLabel className="text-xs text-text-accent uppercase">
                  Полное имя
                </FieldLabel>
              </div>
              <div className="relative flex items-center group">
                <User className="absolute left-3 w-3.5 h-3.5 text-text-accent group-focus-within:text-red transition-colors" />
                <Input
                  {...field}
                  type="text"
                  placeholder="Алексей Иванов"
                  autoComplete="off"
                  className="h-12 w-full bg-input-background border-border text-sm text-white pl-9 pr-4 rounded-lg outline-none placeholder-text-accent transition-all"
                />
              </div>
              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className="text-xs text-red"
                />
              )}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <FieldLabel className="text-xs text-text-accent uppercase">
                  Email
                </FieldLabel>
              </div>
              <div className="relative flex items-center group">
                <Hash className="absolute left-3 w-3.5 h-3.5 text-text-accent group-focus-within:text-red transition-colors" />
                <Input
                  {...field}
                  type="email"
                  placeholder="alex@hackprimecode.ru"
                  autoComplete="off"
                  className="h-12 w-full bg-input-background border-border text-sm text-white pl-9 pr-4 rounded-lg outline-none placeholder-text-accent transition-all"
                />
              </div>
              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className="text-xs text-red"
                />
              )}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <FieldLabel className="text-xs text-text-accent uppercase tracking-wider">
                  Пароль
                </FieldLabel>
              </div>
              <div className="relative flex items-center group">
                <Lock className="absolute left-3 w-3.5 h-3.5 text-text-accent group-focus-within:text-red transition-colors" />
                <Input
                  {...field}
                  type="password"
                  placeholder="••••••••"
                  className="h-12 w-full bg-input-background border-border text-sm text-white pl-9 pr-4 rounded-lg outline-none placeholder-text-accent transition-all"
                />
              </div>
              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className="text-xs text-red"
                />
              )}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <FieldLabel className="text-xs text-text-accent uppercase tracking-wider">
                  Повторите пароль
                </FieldLabel>
              </div>
              <div className="relative flex items-center group">
                <Lock className="absolute left-3 w-3.5 h-3.5 text-text-accent group-focus-within:text-red transition-colors" />
                <Input
                  {...field}
                  type="password"
                  placeholder="••••••••"
                  className="h-12 w-full bg-input-background border-border text-sm text-white pl-9 pr-4 rounded-lg outline-none placeholder-text-accent transition-all"
                />
              </div>
              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className="text-xs text-red"
                />
              )}
            </Field>
          )}
        />

        <div className={isLoading ? "cursor-not-allowed w-full" : "w-full"}>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-red hover:bg-red/85 active:bg-red/60 text-white text-sm rounded-sm mt-2 transition-colors duration-150"
          >
            {isLoading ? "Регистрация..." : "Создать аккаунт"}
          </Button>
        </div>
      </form>
      {submitError && (
        <p className="text-red text-xs md:text-sm text-center mt-4 animate-pulse">
          {submitError}
        </p>
      )}
    </>
  );
}
