import React, { useState, useRef, useEffect } from "react";
import { Upload, X, FileText } from "lucide-react";
import { useCountdown } from "@/lib/hooks/useCountdown";
import { Link } from "react-router";
import { useGetTeamByIdQuery } from "@/features/team/api/teamApi";
import { useSelector } from "react-redux";
import { selectCurrentTeamId } from "@/features/auth/model/authSlice";
import {
  useGetSubmissionQuery,
  useSubmitSolutionMutation,
} from "./submissionApi";

export default function SubmissionTab() {
  const [projectName, setProjectName] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [presentationFile, setPresentationFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedTime, setSubmittedTime] = useState<string | null>(null);

  const teamId = useSelector(selectCurrentTeamId);

  const { data: team, isLoading: isTeamLoading } = useGetTeamByIdQuery(
    teamId!,
    {
      skip: !teamId,
    },
  );

  const { data: submission, isLoading: isSubmissionLoading } =
    useGetSubmissionQuery(teamId!, {
      skip: !teamId,
    });

  const [submitSolution, { isLoading: isSubmitting }] =
    useSubmitSolutionMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { days, hours, minutes, seconds, isExpired } = useCountdown(
    team?.hackathon.end_date ?? "",
  );

  useEffect(() => {
    if (!submission) return;

    setRepositoryUrl(submission.repository_url);
    setProjectDescription(submission.description);

    if (submission.submitted_at) {
      setSubmittedTime(
        new Date(submission.submitted_at).toLocaleTimeString("ru-RU"),
      );

      setIsSubmitted(true);
    }
  }, [submission]);

  const timeBlocks = [
    { value: days, label: "Дни" },
    { value: hours, label: "Час" },
    { value: minutes, label: "Мин" },
    { value: seconds, label: "Сек" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") setPresentationFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") setPresentationFile(file);
    }
  };

  const removeFile = () => {
    setPresentationFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!teamId) return;

    const payload = {
      description: projectDescription,
      repository_url: repositoryUrl,
      files: [],
    };

    try {
      await submitSolution({ teamId, payload }).unwrap();
      setSubmittedTime(new Date().toLocaleTimeString("ru-RU"));
      setIsSubmitted(true);
    } catch (err) {
      console.error("Не удалось отправить решение:", err);
    }
  };

  if (isTeamLoading || isSubmissionLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.75rem)] w-full">
        <span className="animate-pulse text-sm text-white">Загрузка...</span>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-text-accent text-sm p-6 text-center border border-dashed border-border rounded-xl bg-card-background/20 max-w-2xl mx-auto animate-fadeIn">
        <p className="mb-4">
          Вы не состоите в команде. Сдача проекта доступна только для
          подтвержденных команд хакатона.
        </p>
        <Link
          to="/team"
          className="text-red hover:underline text-xs font-medium"
        >
          Перейти к созданию или выбору команды
        </Link>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="flex flex-col bg-card-background border border-border items-center w-full max-w-sm min-h-75 text-center p-5 animate-fadeIn rounded-lg">
          <div className="flex w-full justify-end mb-3">
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="text-text-accent hover:text-white cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
          <div className="flex flex-col items-center mb-12">
            <img src="./submited-project-icon.svg" className="w-12 h-12 mb-5" />
            <h3 className="text-white text-base mb-4.5">Проект отправлен!</h3>
            <div className="flex flex-col items-center gap-2.5 text-xs text-text-accent">
              <p>// {projectName}</p>
              <p>// Заявка принята • {submittedTime}</p>
            </div>
          </div>
          <Link
            to="/leaderboard"
            className="flex justify-center items-center gap-2.5 w-full bg-red hover:bg-red/90 rounded p-2 text-white text-sm cursor-pointer"
          >
            <span>Смотреть рейтинг</span>
            <img
              src="./arrow-white-icon.svg"
              alt=""
              className="w-3.5 h-3.5 translate-y-px"
            />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl animate-fadeIn mx-auto grid grid-cols-[1fr_auto] items-start gap-10 pt-8 px-4 md:px-0">
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-1 items-center bg-red/5 text-red border border-red rounded-md px-4 py-2 text-xs">
          <Upload className="w-3 h-4" />
          <span>Финальная сдача проекта</span>
        </div>

        <div>
          <h2 className="text-white text-2xl mb-2 text-center">
            Отправить проект
          </h2>
          <p className="text-xs text-text-accent">
            // Команда {team?.name} • {team?.hackathon.title}
          </p>
        </div>

        <div className="bg-linear-to-r from-transparent via-red/30 to-transparent h-px w-full" />

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.6875rem] text-text-accent uppercase">
              Название проекта
            </label>
            <div className="relative flex items-center">
              <img
                src="./send-project-name-icon.svg"
                alt=""
                className="absolute left-3 w-3.5 h-3.5 text-text-accent group-focus-within:text-red transition-colors"
              />
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Введите название проекта"
                className="w-full h-10 bg-input-background border border-border rounded pl-9 pr-3 text-xs text-white placeholder-text-accent outline-none focus:border-red/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[0.6875rem] text-text-accent uppercase">
              Описание проекта
            </label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Добавьте важные детали, данные для входа (если необходимо) или описание вашей реализации..."
              className="w-full min-h-28 bg-input-background border border-border rounded p-3 text-xs text-white placeholder-text-accent outline-none focus:border-red/50 transition-colors resize-none leading-relaxed"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[0.6875rem] text-text-accent uppercase">
              GitHub репозиторий
            </label>
            <div className="relative flex items-center">
              <img
                src="./send-project-github-icon.svg"
                alt=""
                className="absolute left-3 w-3.5 h-3.5 text-text-accent group-focus-within:text-red transition-colors"
              />
              <input
                type="url"
                required
                value={repositoryUrl}
                onChange={(e) => setRepositoryUrl(e.target.value)}
                placeholder="https://github.com/your-team/repository"
                className="w-full h-10 bg-input-background border border-border rounded pl-9 pr-3 text-xs text-white placeholder-text-accent outline-none focus:border-red/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[0.6875rem] text-text-accent uppercase">
              Ссылка на демо
            </label>
            <div className="relative flex items-center">
              <img
                src="./send-project-demo-url-icon.svg"
                alt=""
                className="absolute left-3 w-3.5 h-3.5 text-text-accent group-focus-within:text-red transition-colors"
              />
              <input
                type="url"
                required
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://your-team.demo.com"
                className="w-full h-10 bg-input-background border border-border rounded pl-9 pr-3 text-xs text-white placeholder-text-accent outline-none focus:border-red/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[0.6875rem] text-text-accent uppercase">
              Презентация проекта (PDF)
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf"
              className="hidden"
            />

            {!presentationFile ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dotted border-red hover:border-red/60 rounded-lg py-6 flex flex-col items-center justify-center gap-2.5 bg-red/3 cursor-pointer transition-all group px-4 text-center"
              >
                <div className="w-9 h-9 bg-red/20 rounded-full flex items-center justify-center text-text-accent transition-colors">
                  <Upload className="w-4 h-4 text-red" />
                </div>
                <div>
                  <p className="text-xs text-white">
                    Нажмите для загрузки или перетащите файл
                  </p>
                  <p className="text-xs text-text-accent mt-3">
                    Только PDF файлы до 15 МБ
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between px-4 py-3 bg-input-background border border-border rounded-lg animate-fadeIn">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 bg-red/10 border border-red/20 rounded flex items-center justify-center text-red shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs text-white truncate">
                      {presentationFile.name}
                    </span>
                    <span className="text-[10px] text-text-accent mt-0.5">
                      {(presentationFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-text-accent hover:text-white p-1.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isExpired || isSubmitting}
            className="w-full flex justify-center items-center gap-3 h-11 px-2 bg-red text-white text-sm rounded hover:bg-red/90 transition-colors cursor-pointer"
          >
            <img src="./send-invite-icon.svg" alt="" className="w-4 h-4" />
            <span>{isSubmitting ? "Отправка..." : "Отправить решение"}</span>
          </button>
        </form>
      </div>

      <div className="hidden md:flex flex-col gap-1 items-end bg-input-background border border-red rounded-lg px-3.5 py-2">
        <p className="text-text-accent text-xs uppercase">Дедлайн</p>
        <div className="flex items-center">
          {isExpired ? (
            <span className="text-red text-xs">Время истекло!</span>
          ) : (
            timeBlocks.map((block, index) => (
              <div key={index} className="flex text-red">
                <div className="flex flex-col items-center">
                  <p>{block.value}</p>
                  <p className="text-[0.625rem]">{block.label}</p>
                </div>

                {index < timeBlocks.length - 1 && <span>:</span>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
