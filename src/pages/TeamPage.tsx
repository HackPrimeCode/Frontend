import { useEffect, useState } from "react";
import { Users, Mail, Calendar, Edit2, UserPlus, Trash2 } from "lucide-react";
import {
  useGetMyTeamQuery,
  useCreateTeamMutation,
} from "@/features/team/api/teamApi";
import { useInviteToTeamMutation } from "@/features/team/api/teamApi";
import CreateTeamModal from "@/features/team/components/CreateTeamModal";
import type { TeamCreateFormData } from "@/features/team/model/teamTypes";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
// import HackathonDetailsModal from "@/features/hackathons/components/HackathonDetailsModal";

export default function TeamPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: team, isLoading, refetch } = useGetMyTeamQuery();
  const [createTeam] = useCreateTeamMutation();
  const [inviteToTeam] = useInviteToTeamMutation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [_isDetailsModalOpen, _setIsDetailsModalOpen] = useState(false);
  const [initialHackathonId, setInitialHackathonId] = useState<
    number | undefined
  >(undefined);
  const [inviteEmail, setInviteEmail] = useState("");

  useEffect(() => {
    const applyId = location.state?.applyHackathonId as number | undefined;
    if (applyId && !isLoading && !team) {
      setInitialHackathonId(applyId);
      setIsCreateModalOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, isLoading, team, navigate, location.pathname]);

  const handleCreateTeam = async (data: TeamCreateFormData) => {
    try {
      await createTeam({
        hackathon_id: data.hackathon_id,
        data: {
          team_name: data.team_name,
        },
      }).unwrap();
      refetch();
    } catch (error: any) {
      const detail = error?.data?.detail;
      if (detail === "Team creation is not allowed") {
        console.error("Регистрация на хакатон закрыта");
      } else if (detail === "User already participates in this hackathon") {
        console.error("Вы уже участвуете в этом хакатоне");
      } else {
        console.error("Failed to create team:", error);
      }
    }
  };

  const handleInvite = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !team) return;

    try {
      await inviteToTeam({
        teamId: team.id,
        emails: [inviteEmail.trim()],
      }).unwrap();
      setInviteEmail("");
      refetch();
    } catch (error: any) {
      const detail = error?.data?.detail;
      if (detail === "Team size limit exceeded") {
        console.error("Превышен лимит участников в команде");
      } else if (detail === "Only captain can invite participants") {
        console.error("Только капитан может приглашать участников");
      } else {
        console.error("Failed to invite:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.75rem)] w-full">
        <span className="animate-pulse text-sm text-white">Загрузка...</span>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="w-full max-w-232 mx-auto pt-8">
        <div className="mb-20">
          <h1 className="text-2xl text-white mb-1">Команда</h1>
          <p className="text-xs text-text-accent">
            // Управляйте своей командой, приглашайте участников
          </p>
        </div>

        <div className="w-full bg-card-background border border-border rounded-lg p-10.5 flex flex-col items-center justify-center">
          <div className="mb-6 flex items-center justify-center">
            <Users className="w-10 h-10 text-text-accent" />
          </div>
          <h2 className="text-white mb-2.5">У вас нет команды</h2>
          <p className="text-sm text-text-accent text-center mb-7">
            Создайте свою команду или присоединитесь к существующей по
            приглашению
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-10 px-19 bg-red text-white text-sm rounded-lg flex items-center gap-2 hover:bg-red/90 transition-colors cursor-pointer"
          >
            <img src="./create-team-icon.svg" alt="" className="w-3.5 h-3.5" />
            Создать команду
          </button>
        </div>

        <CreateTeamModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTeam}
          initialHackathonId={initialHackathonId}
        />
      </div>
    );
  }

  const currentMember = team.members.find((m) => m.is_captain);
  const otherMembers = team.members.filter((m) => !m.is_captain);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl text-white mb-1">Команда</h1>
        <p className="text-xs text-text-accent">
          // Управляйте своей командой, приглашайте участников
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        <div className="flex flex-col gap-5">
          <div className="bg-card-background border border-border rounded-lg p-5">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-white">{team.hackathon_title}</h3>
              <div className="flex items-center gap-1 text-xs text-text-accent">
                <Calendar className="w-3 h-3 text-red" />
                <span>{team.hackathon_dates}</span>
              </div>
            </div>
            <p className="text-xs text-text-accent mb-4 leading-relaxed">
              {team.hackathon_description}
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {team.hackathon_topics.map((topic, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-input-background border border-border rounded-sm text-[0.6875rem] text-text-accent"
                >
                  {topic}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-accent">
                От {team.hackathon_min_size} до {team.hackathon_max_size} чел.
              </span>
              <Button
                onClick={() => alert("Пока не сделал!")}
                className="h-5 px-1 text-red hover:text-red/85 text-xs cursor-pointer flex items-center justify-center gap-2 hover:animate-pulse"
              >
                <span>Подробнее</span>
                <img
                  src="/dropdown-active-icon.svg"
                  alt=""
                  className="w-2.5 h-1.5"
                />
              </Button>
            </div>
          </div>

          <div className="bg-card-background border border-border rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {team.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-white">{team.name}</h3>
                  <p className="text-xs text-text-accent">
                    {team.members.length} / {team.hackathon_max_size} мест
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-border">
              {currentMember && (
                <div className="px-5 py-4 flex items-center gap-4">
                  <div
                    className={`w-10 h-10 ${currentMember.avatar_color || "bg-red"} rounded-full flex items-center justify-center text-white text-sm font-bold`}
                  >
                    {currentMember.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-white text-sm">
                        {currentMember.full_name}
                      </span>
                      <span className="px-2 py-0.5 bg-red/10 border border-red text-red text-[0.6875rem] rounded">
                        Капитан
                      </span>
                    </div>
                    <p className="text-xs text-text-accent">
                      {currentMember.email}
                    </p>
                    <div className="flex gap-1.5 mt-2">
                      {currentMember.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-input-background border border-border rounded text-[0.6875rem] text-text-accent"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {otherMembers.map((member) => (
                <div
                  key={member.id}
                  className="px-5 py-4 flex items-center gap-4"
                >
                  <div
                    className={`w-10 h-10 ${member.avatar_color || "bg-green-500"} rounded-full flex items-center justify-center text-white text-sm font-bold`}
                  >
                    {member.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-white text-sm">
                        {member.full_name}
                      </span>
                      {member.role !== "Капитан" && (
                        <span className="px-2 py-0.5 bg-input-background border border-border text-text-accent text-[0.6875rem] rounded">
                          {member.role}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-accent">{member.email}</p>
                    <div className="flex gap-1.5 mt-2">
                      {member.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-input-background border border-border rounded text-[0.6875rem] text-text-accent"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  {currentMember?.is_captain && (
                    <button className="text-red hover:text-red/85 text-xs cursor-pointer flex items-center gap-1">
                      <Trash2 className="w-3.5 h-3.5" />
                      Исключить
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="bg-card-background border border-border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-red" />
              <h3 className="text-xs text-text-accent uppercase">
                Информация о команде
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-accent block mb-1">
                  Название
                </label>
                <p className="text-white">{team.name}</p>
              </div>

              <div>
                <label className="text-xs text-text-accent block mb-1">
                  Мероприятие
                </label>
                <p className="text-white">{team.hackathon_title}</p>
              </div>

              <div>
                <label className="text-xs text-text-accent block mb-1">
                  Капитан
                </label>
                <p className="text-white">{currentMember?.full_name}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-xs text-text-accent">О команде</label>
                  {currentMember?.is_captain && (
                    <button className="text-text-accent hover:text-white cursor-pointer">
                      <Edit2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-white leading-relaxed">
                  {team.description || "Описание не заполнено"}
                </p>
              </div>
            </div>
          </div>

          {currentMember?.is_captain && (
            <div className="bg-card-background border border-border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <UserPlus className="w-4 h-4 text-red" />
                <h3 className="text-xs text-text-accent uppercase">
                  Пригласить в команду
                </h3>
              </div>

              <form onSubmit={handleInvite} className="flex flex-col gap-3">
                <div>
                  <label className="text-xs text-text-accent block mb-2">
                    Email участника
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-accent" />
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="user@example.com"
                        className="w-full h-10 pl-10 pr-4 bg-input-background border border-border rounded-sm text-sm text-white placeholder-text-accent outline-none focus:border-red transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      className="h-10 w-10 bg-red hover:bg-red/90 rounded-sm flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {team.pending_invites.length > 0 && (
            <div className="bg-card-background border border-border rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red" />
                  <h3 className="text-xs text-text-accent uppercase">
                    Приглашены
                  </h3>
                </div>
                <span className="text-xs text-red">
                  {team.pending_invites.length}
                </span>
              </div>
              <div className="space-y-2">
                {team.pending_invites.map((email, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 bg-input-background border border-border rounded-sm"
                  >
                    <Users className="w-3.5 h-3.5 text-text-accent" />
                    <span className="text-xs text-white">{email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setInitialHackathonId(undefined);
        }}
        onSubmit={handleCreateTeam}
        initialHackathonId={initialHackathonId}
      />
      {/* <HackathonDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        hackathon={selectedHackathon}
        onApply={handleApply}
      /> */}
    </div>
  );
}
