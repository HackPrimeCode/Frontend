import ProfileHeader from "@/features/profile/components/ProfileHeader";
import CurrentHackathonSection from "@/features/profile/components/CurrentHackathonSection";
import CurrentTeamSection from "@/features/profile/components/CurrentTeamSection";
import HackathonHistorySection from "@/features/profile/components/HackathonHistorySection";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GlobalRole } from "@/features/auth/model/authTypes";
import type { CurrentHackathon, HackathonParticipation, CurrentTeam, UserProfile } from "@/features/profile/model/profileTypes";

function getRoleLabel(role: GlobalRole | undefined) {
  if (role === "admin") return "Администратор";
  if (role === "organizator") return "Организатор";
  return undefined;
}

const mockProfile = {
  id: 1,
  name: "Алексей Иванов",
  email: "killoq7@gmail.com",
  github_url: "https://github.com/KilloQ",
  skills: ["ML", "Python", "React", "Go", "AI", "LLM", "Computer Vision"],
  stats: {
    total_hackathons: 3,
    total_wins: 2,
    average_score: 9.1,
  },
};

const mockCurrentTeam: CurrentTeam = {
  id: 1,
  name: "ByteForce",
  role: "captain",
  members_count: 3,
  initials: "BF",
  color: "#7B5EA7",
};

const mockCurrentHackathon: CurrentHackathon = {
  id: 1,
  title: "HackPrimeCode Лето 2026",
  description:
    "Создавайте инновационные решения с использованием современных технологий. Работайте в команде, представляйте проекты жюри и получайте обратную связь от экспертов индустрии.",
  status: "IN_PROGRESS" as const,
  skills: ["ML", "Python", "React", "Go"],
  date: "18-20 июля 2026",
  location: "Москва + Онлайн",
  duration_hours: 48,
  team_name: "ByteForce",
  team_members: 3,
  deadline: "2026-07-20T18:00:00",
};

const mockHistory: HackathonParticipation[] = [
  {
    id: 1,
    hackathon_id: 1,
    title: "CyberSecurity Cup",
    status: "FINISHED" as const,
    role: "captain",
    team_name: "ByteForce",
    position: 2,
    score: 8.9,
    date: "2026-06-01",
  },
  {
    id: 2,
    hackathon_id: 2,
    title: "GameDev Jam 2025",
    status: "FINISHED" as const,
    role: "participant",
    team_name: "MegaBoys",
    position: 1,
    score: 9.3,
    date: "2025-07-01",
  },
  {
    id: 3,
    hackathon_id: 3,
    title: "AI Challenge",
    status: "FINISHED" as const,
    role: "participant",
    team_name: "Stars",
    position: 10,
    score: 7.2,
    date: "2025-03-01",
  },
];

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState<CurrentHackathon | null>(null);
  const [selectedHistoryEvent, setSelectedHistoryEvent] = useState<HackathonParticipation | null>(null);
  const [isHackathonModalOpen, setIsHackathonModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const isParticipant = user?.global_role === "user";
  const roleLabel = getRoleLabel(user?.global_role);

  const profile = useMemo<UserProfile | undefined>(() => {
    if (!user) return undefined;

    if (isParticipant) {
      return mockProfile;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      skills: [],
      stats: {
        total_hackathons: 0,
        total_wins: 0,
        average_score: 0,
      },
    };
  }, [user, isParticipant]);

  const currentTeam = isParticipant ? mockCurrentTeam : null;
  const currentHackathon = mockCurrentHackathon;
  const history = isParticipant ? mockHistory : [];
  const profileLoading = false;
  const hackathonLoading = false;
  const historyLoading = false;
  const profileError = null;

  const handleHackathonDetailsClick = (hackathon: CurrentHackathon) => {
    setSelectedHackathon(hackathon);
    setIsHackathonModalOpen(true);
  };

  const handleHistoryDetailsClick = (event: HackathonParticipation) => {
    setSelectedHistoryEvent(event);
    setIsHistoryModalOpen(true);
  };

  return (
    <div className="min-h-[calc(100vh-3.75rem)] w-full bg-background px-6 py-5">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6">
        {profileError && (
          <div className="rounded-lg border border-red bg-red/10 px-4 py-3 text-sm text-red">
            Ошибка при загрузке профиля
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <div className="space-y-4">
            <ProfileHeader
              profile={profile}
              isLoading={profileLoading}
              onEditClick={() => setIsEditDialogOpen(true)}
              showSkills={isParticipant}
              showStats={isParticipant}
              roleLabel={roleLabel}
            />
            {isParticipant && (
              <CurrentTeamSection
                team={currentTeam}
                isLoading={profileLoading}
              />
            )}
          </div>

          <div className="space-y-8">
            <CurrentHackathonSection
              hackathon={currentHackathon}
              isLoading={hackathonLoading}
              onDetailsClick={handleHackathonDetailsClick}
            />
            {isParticipant && (
              <HackathonHistorySection
                history={history}
                isLoading={historyLoading}
                onDetailsClick={handleHistoryDetailsClick}
              />
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card-background border-border text-text">
          <DialogHeader>
            <DialogTitle className="text-text">Редактировать профиль</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-text-accent">Имя</label>
              <Input
                defaultValue={profile?.name}
                placeholder="Ваше имя"
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm text-text-accent">GitHub</label>
              <Input
                defaultValue={profile?.github_url}
                placeholder="https://github.com/..."
                className="mt-2"
              />
            </div>
            {isParticipant && (
              <div>
                <label className="text-sm text-text-accent">Навыки</label>
                <Input
                  defaultValue={profile?.skills?.join(", ")}
                  placeholder="Python, React, Go..."
                  className="mt-2"
                />
              </div>
            )}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="flex-1 border-border text-text hover:bg-text-accent/10"
              >
                Отмена
              </Button>
              <Button
                onClick={() => {
                  setIsEditDialogOpen(false);
                }}
                className="flex-1 bg-red text-text hover:bg-red/90"
              >
                Сохранить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hackathon Details Modal */}
      <Dialog open={isHackathonModalOpen} onOpenChange={setIsHackathonModalOpen}>
        <DialogContent className="max-w-2xl bg-card-background border-border text-text">
          <DialogHeader>
            <DialogTitle className="text-text">{selectedHackathon?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-text-accent mb-2">Описание</h3>
              <p className="text-text">{selectedHackathon?.description}</p>
            </div>
            
            {selectedHackathon?.skills && selectedHackathon.skills.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-text-accent mb-2">Требуемые навыки</h3>
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
                <p className="text-xs text-text-accent mb-1">Дата</p>
                <p className="text-text font-medium">
                  {selectedHackathon?.date}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-accent mb-1">Место</p>
                <p className="text-text font-medium">{selectedHackathon?.location}</p>
              </div>
              <div>
                <p className="text-xs text-text-accent mb-1">Продолжительность</p>
                <p className="text-text font-medium">{selectedHackathon?.duration_hours} часов</p>
              </div>
              <div>
                <p className="text-xs text-text-accent mb-1">Участников</p>
                <p className="text-text font-medium">{selectedHackathon?.team_members}</p>
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

      {/* History Event Details Modal */}
      {isParticipant && (
      <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
        <DialogContent className="max-w-2xl bg-card-background border-border text-text">
          <DialogHeader>
            <DialogTitle className="text-text">{selectedHistoryEvent?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-text-accent mb-2">Информация о участии</h3>
              {selectedHistoryEvent?.team_name && (
                <p className="text-text mb-2">
                  <span className="text-text-accent">Команда:</span> {selectedHistoryEvent.team_name}
                </p>
              )}
              <p className="text-text mb-2">
                <span className="text-text-accent">Дата:</span> {selectedHistoryEvent?.date && new Date(selectedHistoryEvent.date).toLocaleDateString("ru-RU")}
              </p>
            </div>

            {selectedHistoryEvent?.status === "FINISHED" && (
              <div>
                <h3 className="text-sm font-semibold text-text-accent mb-2">Результаты</h3>
                <div className="space-y-2">
                  {selectedHistoryEvent.position && (
                    <p className="text-text">
                      <span className="text-text-accent">Место:</span> <span className="font-bold text-red">{selectedHistoryEvent.position}</span>
                    </p>
                  )}
                  {selectedHistoryEvent.score !== undefined && (
                    <p className="text-text">
                      <span className="text-text-accent">Балл:</span> <span className="font-bold text-yellow">{selectedHistoryEvent.score.toFixed(1)}</span>
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
