import { useEffect, useState } from "react";
import { Users, Calendar, UserPlus } from "lucide-react";
import {
  useCancelInviteMutation,
  useCreateTeamMutation,
  useGetTeamByIdQuery,
  useRemoveMemberMutation,
} from "@/features/team/api/teamApi";
import { useInviteToTeamMutation } from "@/features/team/api/teamApi";
import CreateTeamModal from "@/features/team/components/CreateTeamModal";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import {
  selectCurrentContext,
  selectCurrentTeamId,
} from "@/features/auth/model/authSlice";
import type { TeamCreateFormData } from "@/features/team/model/teamTypes";
import { formatDate } from "@/lib/utils";
import { useGetHackathonDetailsWithTaskQuery } from "@/features/hackathons/api/hackathonApi";
import HackathonDetailsModal from "@/features/hackathons/components/HackathonDetailsModal";

export default function TeamPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const teamId = useSelector(selectCurrentTeamId);
  const authContext = useSelector(selectCurrentContext);
  const currentUserRole = authContext?.roleInTeam;

  const { data: team, isLoading } = useGetTeamByIdQuery(teamId!, {
    skip: !teamId,
  });

  const handleApply = () => {};

  const hackathonId = team?.hackathon?.id;

  const { data: hackathonDetails, isLoading: isHackathonLoading } =
    useGetHackathonDetailsWithTaskQuery(hackathonId!, {
      skip: !teamId || !hackathonId,
    });

  const [createTeam] = useCreateTeamMutation();
  const [inviteToTeam] = useInviteToTeamMutation();
  const [removeMember] = useRemoveMemberMutation();
  const [cancelInvite] = useCancelInviteMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
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
        teamPayload: {
          team_name: data.teamPayload.team_name,
          description: data.teamPayload.description,
        },
      }).unwrap();
      setIsCreateModalOpen(false);
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
    if (!inviteEmail.trim() || !teamId) return;

    try {
      await inviteToTeam({
        teamId: teamId,
        emails: [inviteEmail.trim()],
      }).unwrap();
      setInviteEmail("");
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

  if (isLoading || isHackathonLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.75rem)] w-full">
        <span className="animate-pulse text-sm text-white">Загрузка...</span>
      </div>
    );
  }

  if (!teamId || !team) {
    return (
      <div className="w-full max-w-232 mx-auto px-4 py-6 sm:py-8">
        <div className="mb-10 sm:mb-20">
          <h1 className="text-xl sm:text-2xl text-white mb-1">Команда</h1>
          <p className="text-[10px] sm:text-xs text-text-accent">
            // Управляйте своей командой, приглашайте участников
          </p>
        </div>

        <div className="w-full bg-card-background border border-border rounded-lg p-6 sm:p-10.5 flex flex-col items-center justify-center">
          <div className="mb-4 sm:mb-6 flex items-center justify-center">
            <Users className="w-8 h-8 sm:w-10 sm:h-10 text-text-accent" />
          </div>
          <h2 className="text-white text-base sm:text-lg mb-2.5">
            У вас нет команды
          </h2>
          <p className="text-xs sm:text-sm text-text-accent text-center mb-5 sm:mb-7 max-w-md">
            Создайте свою команду или присоединитесь к существующей по
            приглашению
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto h-10 px-8 sm:px-19 bg-red text-white text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 hover:bg-red/90 transition-colors cursor-pointer"
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

  const currentMember = team.members.find((m) => m.role === "captain");
  const otherMembers = team.members.filter((m) => m.role !== "captain");

  const isCaptain = currentUserRole === "captain";

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:px-6 sm:py-8">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl text-white mb-1 sm:mb-2">Команда</h1>
        <p className="text-xs text-text-accent">
          // Управляйте своей командой, приглашайте участников
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4 sm:gap-6">
        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="bg-card-background border border-border rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
              <h3 className="text-sm sm:text-base text-white">
                {team.hackathon.title}
              </h3>
              <div className="flex items-center gap-1 text-[10px] sm:text-xs text-text-accent shrink-0">
                <Calendar className="w-3 h-3 text-red" />
                <div>
                  <p className="text-[10px] sm:text-[0.6875rem]">
                    {formatDate(team.hackathon.start_date)} —{" "}
                    {formatDate(team.hackathon.end_date)}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-[11px] sm:text-xs text-text-accent mb-4 leading-relaxed">
              {hackathonDetails?.description}
            </p>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div className="flex flex-wrap gap-1.5">
                {hackathonDetails?.topics?.map((topic, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-input-background border border-border rounded-sm text-[10px] sm:text-[0.6875rem] text-text-accent"
                  >
                    {topic}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 text-[10px] sm:text-xs">
                <span className="text-text-accent uppercase whitespace-nowrap">
                  От {hackathonDetails?.min_team_size} до{" "}
                  {hackathonDetails?.max_team_size} чел.
                </span>
                <Button
                  onClick={() => setIsDetailsModalOpen(true)}
                  className="h-5 px-1 text-red hover:text-red/85 text-[11px] sm:text-xs cursor-pointer flex items-center justify-center gap-1.5 hover:animate-pulse"
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
          </div>

          <div className="bg-card-background border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm shrink-0">
                  {team.name.substring(0, 2).toUpperCase()}
                </div>
                <h3 className="text-sm sm:text-base text-white truncate">
                  {team.name}
                </h3>
              </div>
              <p className="text-[11px] sm:text-xs text-text-accent shrink-0">
                {team.members.length} / {team.hackathon.max_team_size} мест
              </p>
            </div>

            <div className="divide-y divide-border">
              {currentMember && (
                <div className="px-4 py-3 sm:px-5 sm:py-4 flex flex-col gap-3">
                  <div className="flex gap-3 items-center">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 bg-red rounded-full flex items-center justify-center text-white text-xs sm:text-sm shrink-0`}
                    >
                      {currentMember.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                        <span className="text-white text-xs sm:text-sm truncate">
                          {currentMember.name}
                        </span>
                        <div className="px-1.5 py-0.5 bg-red/10 border border-red text-red text-[9px] sm:text-[0.6875rem] rounded flex gap-1 items-center justify-center shrink-0">
                          <img
                            src="./captain-icon.svg"
                            alt=""
                            className="w-2.5 h-2.5"
                          />
                          <span className="translate-y-px">Капитан</span>
                        </div>
                      </div>
                      <p className="text-[11px] sm:text-xs text-text-accent truncate">
                        {currentMember.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {currentMember.tech_stack.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-input-background border border-border rounded text-[10px] sm:text-[0.6875rem] text-text-accent"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {otherMembers.map((member) => (
                <div
                  key={member.id}
                  className="px-4 py-3 sm:px-5 sm:py-4 flex flex-col gap-3"
                >
                  <div className="flex gap-3 items-center">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm shrink-0`}
                    >
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white text-xs sm:text-sm truncate">
                          {member.name}
                        </span>
                        <div className="px-1.5 py-0.5 bg-card-background border border-border text-text-accent text-[9px] sm:text-[0.6875rem] rounded flex gap-1 items-center justify-center shrink-0">
                          <span className="translate-y-px">Участник</span>
                        </div>
                      </div>
                      <p className="text-[11px] sm:text-xs text-text-accent truncate">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {member.tech_stack.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-input-background border border-border rounded text-[10px] sm:text-[0.6875rem] text-text-accent"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    {isCaptain && (
                      <Button
                        onClick={() =>
                          removeMember({ teamId: team.id, userId: member.id })
                        }
                        className="cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent flex items-center gap-1 shrink-0"
                      >
                        <img
                          src="./delete-member-icon.svg"
                          alt=""
                          className="w-3.5 h-3.5"
                        />
                        <span className="text-[11px] sm:text-xs text-red">
                          Исключить
                        </span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="bg-card-background border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <img src="./info-icon.svg" alt="" className="w-3.5 h-3.5" />
              <h3 className="text-[11px] sm:text-xs text-text-accent uppercase tracking-wider">
                Информация о команде
              </h3>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center justify-between py-2.5 border-b border-border text-[11px] sm:text-xs">
                <label className="text-text-accent uppercase">Название</label>
                <p className="text-white truncate max-w-[60%]">{team.name}</p>
              </div>

              <div className="flex items-center justify-between py-2.5 border-b border-border text-[11px] sm:text-xs">
                <label className="text-text-accent uppercase">
                  Мероприятие
                </label>
                <p className="text-white truncate max-w-[60%]">
                  {team.hackathon.title}
                </p>
              </div>

              <div className="flex items-center justify-between py-2.5 border-b border-border text-[11px] sm:text-xs">
                <label className="text-text-accent uppercase">Капитан</label>
                <p className="text-white truncate max-w-[60%]">
                  {currentMember?.name}
                </p>
              </div>

              <div className="flex flex-col pt-2.5 text-[11px] sm:text-xs gap-1.5">
                <div className="flex items-center gap-2">
                  <label className="text-text-accent uppercase">
                    О команде
                  </label>
                  {/* {isCaptain && (
                    <button className="text-text-accent hover:text-white cursor-pointer">
                      <img
                        src="./edit-description-icon.svg"
                        className="w-3 h-3"
                      />
                    </button>
                  )} */}
                </div>
                <p className="text-white leading-relaxed rounded-sm">
                  {team.description || "Описание не заполнено"}
                </p>
              </div>
            </div>
          </div>

          {isCaptain && (
            <div className="bg-card-background border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <UserPlus className="w-3.5 h-3.5 text-red" />
                <h3 className="text-[11px] sm:text-xs text-text-accent uppercase tracking-wider">
                  Пригласить в команду
                </h3>
              </div>

              <form onSubmit={handleInvite} className="flex flex-col gap-2">
                <div>
                  <label className="text-[11px] sm:text-xs text-text-accent block mb-1.5">
                    Email участника
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full h-9 pl-3 pr-4 bg-input-background border border-border rounded-sm text-xs sm:text-sm text-white placeholder-text-accent outline-none focus:border-red transition-colors"
                    />
                    <button
                      type="submit"
                      className="h-9 min-w-9 bg-red hover:bg-red/90 rounded-sm flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <img
                        src="./send-invite-icon.svg"
                        className="w-3.5 h-3.5"
                      />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {isCaptain && team.pending_invites.length > 0 && (
            <div className="bg-card-background border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <img src="./info-icon.svg" alt="" className="w-3.5 h-3.5" />
                  <h3 className="text-[11px] sm:text-xs text-text-accent uppercase tracking-wider">
                    Приглашены
                  </h3>
                </div>
                <span className="text-[11px] sm:text-xs text-red">
                  {team.pending_invites.length}
                </span>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                {team.pending_invites.map((invite) => (
                  <div
                    key={invite.token}
                    className="flex items-center gap-2 justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="border border-border rounded-full p-1 shrink-0">
                        <Users className="w-3 h-3 text-text-accent" />
                      </div>
                      <span className="text-[11px] sm:text-xs text-white truncate">
                        {invite.email}
                      </span>
                    </div>
                    {isCaptain && (
                      <button
                        onClick={() =>
                          cancelInvite({ teamId: team.id, token: invite.token })
                        }
                        className="text-[10px] text-red hover:underline cursor-pointer bg-transparent border-none"
                      >
                        Отмена
                      </button>
                    )}
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
      <HackathonDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        hackathon={hackathonDetails!}
        onApply={handleApply}
      />
    </div>
  );
}
