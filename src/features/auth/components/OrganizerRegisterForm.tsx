import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Hash, Lock, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLocation, useNavigate } from "react-router";
import { useRegisterUserMutation } from "../api/authApi";

interface OrganizerRegisterFormProps {
  token: string;
  email: string;
}

const organizerRegisterFormSchema = z
  .object({
    token: z.string(),
    fullName: z.string().min(1, "Введите полное имя"),
    email: z.email("Некорректный формат email").min(1, "Введите email"),
    password: z.string().min(5, "Пароль должен содержать минимум 5 символов"),
    confirmPassword: z.string().min(1, "Повторите пароль"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

type OrganizerRegisterFormValues = z.infer<typeof organizerRegisterFormSchema>;

export default function OrganizerRegisterForm({
  token,
  email,
}: OrganizerRegisterFormProps) {
  const navigate = useNavigate();
  const [login, { isLoading }] = useRegisterUserMutation();
  const location = useLocation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<OrganizerRegisterFormValues>({
    resolver: zodResolver(organizerRegisterFormSchema),
    defaultValues: {
      token: token || "",
      fullName: "",
      email: email || "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (email) form.setValue("email", email);
    if (token) form.setValue("token", token);
  }, [email, token, form]);

  function onSubmit(data: OrganizerRegisterFormValues) {
    console.log("Регистрация организатора:", data);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <Controller
        name="fullName"
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
            <div className="relative flex items-center group cursor-not-allowed">
              <Hash className="absolute left-3 w-3.5 h-3.5 text-white transition-colors pointer-events-none" />
              <Input
                {...field}
                type="email"
                placeholder="alex@hackprimecode.ru"
                disabled={true}
                autoComplete="off"
                className="h-12 w-full bg-input-background text-sm pl-9 pr-4 rounded-lg outline-none placeholder-text-accent transition-all disabled:opacity-100 disabled:pointer-events-none text-white! border-2! border-white!"
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
                placeholder="•••••"
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
                placeholder="•••••"
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

      <Button
        type="submit"
        className="w-full h-12 bg-red hover:bg-red/85 active:bg-red/60 text-white text-sm cursor-pointer rounded-sm mt-2 transition-colors duration-150"
      >
        Создать аккаунт
      </Button>
    </form>
    // {submitError && (
    //     <p className="text-red text-xs md:text-sm text-center mt-2 animate-pulse">
    //       {submitError}
    //     </p>
    //   )}
  );
}
