import ProfileHeader from "@/features/profile/components/ProfileHeader";
import CurrentHackathonSection from "@/features/profile/components/CurrentHackathonSection";
import CurrentTeamSection from "@/features/profile/components/CurrentTeamSection";
import HackathonHistorySection from "@/features/profile/components/HackathonHistorySection";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/features/profile/api/profileApi";
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
import type { HackathonDetailRead } from "@/features/hackathons/model/hackathonTypes";
import HackathonDetailsModal from "@/features/hackathons/components/HackathonDetailsModal";

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
  const { data: user, isLoading, isError } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHackathonModalOpen, setIsHackathonModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const handleApply = () => {};

  const [selectedHackathon, setSelectedHackathon] =
    useState<HackathonDetailRead | null>(null);
  // const [selectedHistoryEvent, setSelectedHistoryEvent] =
  //   useState<HackathonDetailRead | null>(null);

  const [name, setName] = useState("");
  const [skillsString, setSkillsString] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setSkillsString(user.tech_stack ? user.tech_stack.join(", ") : "");
    }
  }, [user, isEditModalOpen]);

  const isParticipant = user?.global_role === "user";
  const roleLabel = getRoleLabel(user?.global_role);

  console.log(user);

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        name,
        tech_stack: parseSkillsInput(skillsString),
      }).unwrap();

      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Не удалось обновить профиль:", err);
    }
  };

  const handleHistoryDetailsClick = (event: HackathonDetailRead) => {
    setSelectedHackathon(event);
    setIsHistoryModalOpen(true);
  };

  const handleHackathonDetailsClick = (event: HackathonDetailRead) => {
    setSelectedHackathon(event);
    setIsHackathonModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="w-full p-6 text-center text-text-accent text-sm animate-pulse">
        Загрузка личного кабинета...
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="w-full p-12 text-center text-text-accent text-sm border border-dashed border-border rounded-xl max-w-md mx-auto mt-10">
        Не удалось загрузить профиль. Попробуйте перезайти в аккаунт или
        обновить страницу.
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.75rem)] w-full bg-background p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-300 flex-col gap-4 sm:gap-6">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <div className="space-y-3 sm:space-y-4">
            <ProfileHeader
              profile={user}
              onEditClick={() => setIsEditModalOpen(true)}
              showSkills
              showStats={isParticipant}
              roleLabel={roleLabel}
            />
            {isParticipant && <CurrentTeamSection team={user.current_team} />}
          </div>

          <div className="space-y-6 sm:space-y-8">
            <CurrentHackathonSection
              hackathon={user.active_hackathon}
              onDetailsClick={handleHackathonDetailsClick}
            />
            {isParticipant && (
              <HackathonHistorySection
                history={user?.past_hackathons ?? []}
                onDetailsClick={handleHistoryDetailsClick}
              />
            )}
          </div>
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="border-border bg-card-background text-text">
          <DialogHeader>
            <DialogTitle className="text-text">
              Редактировать профиль
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-text-accent">Имя</label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ваше имя"
                className="mt-2 border-border bg-input-background text-text"
              />
            </div>
            <div>
              <label className="text-sm text-text-accent">Навыки</label>
              <Input
                value={skillsString}
                onChange={(event) => setSkillsString(event.target.value)}
                placeholder="Python, React, Go..."
                className="mt-2 border-border bg-input-background text-text"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 border-border text-text hover:bg-text-accent/10"
              >
                Отмена
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={isUpdating}
                className="flex-1 bg-red text-text hover:bg-red/90"
              >
                {isUpdating ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <HackathonDetailsModal
        isOpen={isHackathonModalOpen || isHistoryModalOpen}
        onClose={() => setIsHackathonModalOpen(true)}
        hackathon={selectedHackathon}
        onApply={handleApply}
      />
    </div>
  );
}
