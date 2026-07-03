import ProfileHeader from "@/features/profile/components/ProfileHeader";
import CurrentHackathonSection from "@/features/profile/components/CurrentHackathonSection";
import CurrentTeamSection from "@/features/profile/components/CurrentTeamSection";
import HackathonHistorySection from "@/features/profile/components/HackathonHistorySection";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/features/profile/api/profileApi";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GlobalRole } from "@/features/auth/model/authTypes";
import { updateUser } from "@/features/auth/model/authSlice";
import type {
  CurrentHackathon,
  HackathonParticipation,
} from "@/features/profile/model/profileTypes";

function getRoleLabel(role: GlobalRole | undefined) {
  if (role === "admin") return "Администратор";
  if (role === "organizator") return "Организатор";
  return undefined;
}

function parseSkillsInput(value: string) {
  return value
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateUserProfileMutation();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editSkills, setEditSkills] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [selectedHackathon, setSelectedHackathon] =
    useState<CurrentHackathon | null>(null);
  const [selectedHistoryEvent, setSelectedHistoryEvent] =
    useState<HackathonParticipation | null>(null);
  const [isHackathonModalOpen, setIsHackathonModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const isParticipant = user?.global_role === "user";
  const roleLabel = getRoleLabel(user?.global_role);

  useEffect(() => {
    if (isEditDialogOpen && profile) {
      setEditName(profile.name);
      setEditSkills(profile.skills.join(", "));
      setSaveError(null);
    }
  }, [isEditDialogOpen, profile]);

  const handleSaveProfile = async () => {
    const name = editName.trim();
    if (!name) {
      setSaveError("Имя не может быть пустым");
      return;
    }

    try {
      const updatedProfile = await updateProfile({
        name,
        tech_stack: parseSkillsInput(editSkills),
      }).unwrap();

      dispatch(updateUser({ name: updatedProfile.name }));
      setIsEditDialogOpen(false);
    } catch {
      setSaveError("Не удалось сохранить профиль");
    }
  };

  const handleHackathonDetailsClick = (hackathon: CurrentHackathon) => {
    setSelectedHackathon(hackathon);
    setIsHackathonModalOpen(true);
  };

  const handleHistoryDetailsClick = (event: HackathonParticipation) => {
    setSelectedHistoryEvent(event);
    setIsHistoryModalOpen(true);
  };

  return (
    <div className="min-h-[calc(100vh-3.75rem)] w-full bg-background p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 sm:gap-6">
        {profileError && (
          <div className="rounded-lg border border-red bg-red/10 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-red">
            Ошибка при загрузке профиля
          </div>
        )}

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <div className="space-y-3 sm:space-y-4">
            <ProfileHeader
              profile={profile}
              isLoading={profileLoading}
              onEditClick={() => setIsEditDialogOpen(true)}
              showSkills
              showStats={isParticipant}
              roleLabel={roleLabel}
            />
            {isParticipant && (
              <CurrentTeamSection team={null} isLoading={profileLoading} />
            )}
          </div>

          <div className="space-y-6 sm:space-y-8">
            <CurrentHackathonSection
              hackathon={null}
              isLoading={profileLoading}
              onDetailsClick={handleHackathonDetailsClick}
            />
            {isParticipant && (
              <HackathonHistorySection
                history={[]}
                isLoading={profileLoading}
                onDetailsClick={handleHistoryDetailsClick}
              />
            )}
          </div>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="border-border bg-card-background text-text">
          <DialogHeader>
            <DialogTitle className="text-text">Редактировать профиль</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-text-accent">Имя</label>
              <Input
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
                placeholder="Ваше имя"
                className="mt-2 border-border bg-input-background text-text"
              />
            </div>
            <div>
              <label className="text-sm text-text-accent">Навыки</label>
              <Input
                value={editSkills}
                onChange={(event) => setEditSkills(event.target.value)}
                placeholder="Python, React, Go..."
                className="mt-2 border-border bg-input-background text-text"
              />
            </div>
            {saveError && (
              <p className="text-sm text-red">{saveError}</p>
            )}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isSaving}
                className="flex-1 border-border text-text hover:bg-text-accent/10"
              >
                Отмена
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex-1 bg-red text-text hover:bg-red/90"
              >
                {isSaving ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isHackathonModalOpen} onOpenChange={setIsHackathonModalOpen}>
        <DialogContent className="max-w-2xl border-border bg-card-background text-text">
          <DialogHeader>
            <DialogTitle className="text-text">
              {selectedHackathon?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-text-accent">
                Описание
              </h3>
              <p className="text-text">{selectedHackathon?.description}</p>
            </div>

            {selectedHackathon?.skills &&
              selectedHackathon.skills.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-text-accent">
                    Требуемые навыки
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedHackathon.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded border border-border bg-transparent px-2.5 py-1 text-xs text-text-accent"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1 text-xs text-text-accent">Дата</p>
                <p className="font-medium text-text">
                  {selectedHackathon?.date}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-text-accent">Место</p>
                <p className="font-medium text-text">
                  {selectedHackathon?.location}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-text-accent">
                  Продолжительность
                </p>
                <p className="font-medium text-text">
                  {selectedHackathon?.duration_hours} часов
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-text-accent">Участников</p>
                <p className="font-medium text-text">
                  {selectedHackathon?.team_members}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsHackathonModalOpen(false)}
                className="flex-1 border-border text-text hover:bg-text-accent/10"
              >
                Закрыть
              </Button>
              <Button className="flex-1 bg-red text-text hover:bg-red/90">
                Перейти к мероприятию
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {isParticipant && (
        <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
          <DialogContent className="max-w-2xl border-border bg-card-background text-text">
            <DialogHeader>
              <DialogTitle className="text-text">
                {selectedHistoryEvent?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-text-accent">
                  Информация о участии
                </h3>
                {selectedHistoryEvent?.team_name && (
                  <p className="mb-2 text-text">
                    <span className="text-text-accent">Команда:</span>{" "}
                    {selectedHistoryEvent.team_name}
                  </p>
                )}
                <p className="mb-2 text-text">
                  <span className="text-text-accent">Дата:</span>{" "}
                  {selectedHistoryEvent?.date &&
                    new Date(selectedHistoryEvent.date).toLocaleDateString(
                      "ru-RU",
                    )}
                </p>
              </div>

              {selectedHistoryEvent?.status === "FINISHED" && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-text-accent">
                    Результаты
                  </h3>
                  <div className="space-y-2">
                    {selectedHistoryEvent.position && (
                      <p className="text-text">
                        <span className="text-text-accent">Место:</span>{" "}
                        <span className="font-bold text-red">
                          {selectedHistoryEvent.position}
                        </span>
                      </p>
                    )}
                    {selectedHistoryEvent.score !== undefined && (
                      <p className="text-text">
                        <span className="text-text-accent">Балл:</span>{" "}
                        <span className="font-bold text-yellow">
                          {selectedHistoryEvent.score.toFixed(1)}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="flex-1 border-border text-text hover:bg-text-accent/10"
                >
                  Закрыть
                </Button>
                <Button className="flex-1 bg-red text-text hover:bg-red/90">
                  Перейти к мероприятию
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
