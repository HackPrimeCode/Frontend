import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { X, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useGetHackathonsQuery } from "@/features/hackathons/api/hackathonApi";
import type { TeamCreateFormData } from "../model/teamTypes";

const createTeamFormSchema = z.object({
  hackathon_id: z.number().min(1, "Выберите мероприятие"),
  team_name: z
    .string()
    .min(1, "Введите название команды")
    .max(255, "Максимум 255 символов"),
  description: z.string().max(1000, "Максимум 1000 символов").optional(),
});

type CreateTeamFormValues = z.infer<typeof createTeamFormSchema>;

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeamCreateFormData) => void;
  initialHackathonId?: number;
}

export default function CreateTeamModal({
  isOpen,
  onClose,
  onSubmit,
  initialHackathonId,
}: CreateTeamModalProps) {
  const { data: hackathons = [] } = useGetHackathonsQuery();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CreateTeamFormValues>({
    resolver: zodResolver(createTeamFormSchema),
    defaultValues: {
      hackathon_id: initialHackathonId ?? 0,
      team_name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        hackathon_id: initialHackathonId ?? 0,
        team_name: "",
        description: "",
      });
      setSubmitError(null);
    }
  }, [isOpen, form, initialHackathonId]);

  if (!isOpen) return null;

  const availableHackathons = hackathons.filter(
    (h) => h.status === "REGISTRATION" || h.status === "IN_PROGRESS",
  );

  async function handleSubmit(data: CreateTeamFormValues) {
    try {
      setSubmitError(null);
      await onSubmit({
        hackathon_id: data.hackathon_id,
        teamPayload: {
          team_name: data.team_name,
          description: data.description || "",
        },
      });
    } catch (err: any) {
      const detailError = err?.data?.detail;
      if (detailError === "User is already registered for this hackathon") {
        setSubmitError("Вы уже зарегистрированы на этот хакатон");
      } else if (
        detailError === "Teams can only be created during registration"
      ) {
        setSubmitError("Команды можно создавать только во время регистрации");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-xs"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-card-background border-2 border-border rounded-lg flex flex-col overflow-hidden text-white animate-in fade-in zoom-in-95 duration-150">
        <div className="flex flex-col px-6 py-5 border-b-2 border-border gap-1">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <img
                src="./create-team-modal-icon.svg"
                className="w-3.5 h-3.5"
                alt=""
              />
              <span className="text-xs text-red uppercase">
                Создание команды
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-text-accent hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <h3 className="text-lg">Создайте свою команду</h3>
        </div>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-5 p-6"
        >
          <Controller
            name="hackathon_id"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="flex flex-col gap-1.5"
              >
                <FieldLabel className="text-xs text-text-accent uppercase">
                  Выберите мероприятие *
                </FieldLabel>
                <select
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="h-12 w-full bg-input-background border border-border text-sm text-white px-4 rounded-sm outline-none focus-visible:border-red transition-all appearance-none cursor-pointer"
                >
                  <option value={0} disabled>
                    Выберите хакатон...
                  </option>
                  {availableHackathons.map((hack) => (
                    <option key={hack.id} value={hack.id}>
                      {hack.title}
                    </option>
                  ))}
                </select>
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
            name="team_name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="flex flex-col gap-1.5"
              >
                <FieldLabel className="text-xs text-text-accent uppercase">
                  Название команды *
                </FieldLabel>
                <div className="relative flex items-center group">
                  <Users className="absolute left-3 w-3.5 h-3.5 text-text-accent group-focus-within:text-red transition-colors" />
                  <Input
                    {...field}
                    type="text"
                    placeholder="UmnikI, ProgTeam ..."
                    autoComplete="off"
                    className="h-12 w-full bg-input-background border border-border text-sm text-white pl-9 pr-4 rounded-sm outline-none placeholder-text-accent transition-all"
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
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="flex flex-col gap-1.5"
              >
                <FieldLabel className="text-xs text-text-accent uppercase">
                  Описание команды
                </FieldLabel>
                <div className="relative flex items-start group">
                  <FileText className="absolute left-3 top-3.5 w-3.5 h-3.5 text-text-accent group-focus-within:text-red transition-colors" />
                  <textarea
                    {...field}
                    placeholder="Расскажите о вашей команде ..."
                    rows={3}
                    className="h-auto min-h-12 w-full bg-input-background border border-border text-sm text-white pl-9 pr-4 py-3 rounded-sm outline-none placeholder-text-accent transition-all resize-none"
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

          <div className="w-full">
            <Button
              type="submit"
              className="flex justify-center items-center gap-2 w-full h-12 bg-red hover:bg-red/85 active:bg-red/60 text-white text-sm cursor-pointer rounded-sm mt-2 transition-colors duration-150"
            >
              <img
                src="./create-team-icon.svg"
                alt=""
                className="w-5 h-5 translate-y-px"
              />
              Создать команду
            </Button>
          </div>

          {submitError && (
            <p className="text-red text-xs md:text-sm text-center mt-2 animate-pulse">
              {submitError}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
