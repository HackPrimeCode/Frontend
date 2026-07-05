import { useState, useEffect } from "react";
import { BookOpen, BarChart2, FileText, Settings, UserCheck, X, Tag, Calendar, MapPin, Users, Plus, Award, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import OverviewTab from "@/features/organizer/components/OverviewTab";
import TaskTab from "@/features/organizer/components/TaskTab";
import SettingsTab from "@/features/organizer/components/SettingsTab";
import JuryTab from "@/features/organizer/components/JuryTab";
import { useCreateHackathonMutation, useGetAdminHackathonsListQuery, useGetOrganizerHackathonQuery } from "@/features/organizer/api";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import type { HackathonLocation } from "@/features/organizer/model/organizerTypes";

interface Prize {
  title: string;
  reward: string;
}

type TabKey = "overview" | "task" | "settings" | "jury";

export default function OrganizerPage() {
  const [hasEvent, setHasEvent] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState<HackathonLocation>("Онлайн");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [minTeamSize, setMinTeamSize] = useState("1");
  const [maxTeamSize, setMaxTeamSize] = useState("5");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [topics, setTopics] = useState("");
  const [prizes, setPrizes] = useState<Prize[]>([{ title: "", reward: "" }]);
  const [currentHackathonId, setCurrentHackathonId] = useState<number | null>(null);
  const [currentHackathonTitle, setCurrentHackathonTitle] = useState<string>("");
  const [isHackathonDropdownOpen, setIsHackathonDropdownOpen] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.global_role === "admin";
  const isOrganizer = user?.global_role === "organizator";

  const { data: hackathonsList } = useGetAdminHackathonsListQuery(undefined, {
    skip: !isAdmin,
  });

  const { data: organizerHackathon } = useGetOrganizerHackathonQuery(undefined, {
    skip: !isOrganizer,
  });

  const [createHackathon] = useCreateHackathonMutation();

  // Load saved hackathon selection from localStorage
  useEffect(() => {
    const savedHackathonId = localStorage.getItem('selectedHackathonId');
    const savedHackathonTitle = localStorage.getItem('selectedHackathonTitle');
    
    if (savedHackathonId && savedHackathonTitle) {
      setCurrentHackathonId(parseInt(savedHackathonId));
      setCurrentHackathonTitle(savedHackathonTitle);
      setHasEvent(true);
    }
  }, []);

  // Save hackathon selection to localStorage when it changes
  useEffect(() => {
    if (currentHackathonId && currentHackathonTitle) {
      localStorage.setItem('selectedHackathonId', currentHackathonId.toString());
      localStorage.setItem('selectedHackathonTitle', currentHackathonTitle);
    }
  }, [currentHackathonId, currentHackathonTitle]);

  // Load organizer's hackathon automatically
  useEffect(() => {
    if (isOrganizer && organizerHackathon && !currentHackathonId) {
      setCurrentHackathonId(organizerHackathon.id);
      setCurrentHackathonTitle(organizerHackathon.title);
      setHasEvent(true);
    }
  }, [isOrganizer, organizerHackathon, currentHackathonId]);

  const handleCreateEvent = async () => {
    try {
      const formData = new FormData();
      formData.append("title", eventTitle);
      formData.append("description", eventDescription);
      formData.append("place", eventLocation);
      formData.append("min_team_size", minTeamSize);
      formData.append("max_team_size", maxTeamSize);
      if (maxParticipants) formData.append("max_participants", maxParticipants);
      if (startDate && startTime) {
        formData.append("start_date", `${startDate}T${startTime}`);
      }
      if (endDate && endTime) {
        formData.append("end_date", `${endDate}T${endTime}`);
      }
      if (topics) {
        formData.append("topics", JSON.stringify(topics.split(",").map(t => t.trim())));
      }
      if (prizes.length > 0) {
        const validPrizes = prizes.filter(p => p.title && p.reward);
        if (validPrizes.length > 0) {
          formData.append("prizes", JSON.stringify(validPrizes));
        }
      }

      const result = await createHackathon(formData).unwrap();
      setCurrentHackathonId(result.id);
      setCurrentHackathonTitle(result.title);
      setHasEvent(true);
      setIsCreateEventModalOpen(false);
      
      // Save to localStorage
      localStorage.setItem('selectedHackathonId', result.id.toString());
      localStorage.setItem('selectedHackathonTitle', result.title);
    } catch (error) {
      console.error("Failed to create hackathon:", error);
    }
  };

  const handleSelectHackathon = (hackathonId: number, hackathonTitle: string) => {
    setCurrentHackathonId(hackathonId);
    setCurrentHackathonTitle(hackathonTitle);
    setIsHackathonDropdownOpen(false);
  };

  if (!hasEvent) {
    return (
      <>
        <div className="w-full max-w-232 mx-auto pt-4 md:pt-8 px-4 md:px-0">
          <div className="mb-12 md:mb-20">
            <h1 className="text-xl md:text-2xl text-white mb-1">Создайте свое мероприятие</h1>
          </div>

          <div className="w-full bg-card-background border border-border rounded-lg p-6 md:p-10.5 flex flex-col items-center justify-center">
            <div className="mb-6 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-text-accent" />
            </div>
            <h2 className="text-white mb-2.5 text-center">У вас нет мероприятий</h2>
            <p className="text-sm text-text-accent text-center mb-7 px-4">
              Создайте свое мероприятие, введите общую информацию, а затем добавьте все пункты
            </p>
            <button
              onClick={() => setIsCreateEventModalOpen(true)}
              className="h-10 px-4 md:px-19 bg-red text-white text-sm rounded-lg flex items-center gap-2 hover:bg-red/90 transition-colors cursor-pointer"
            >
              <img src="./create-team-icon.svg" alt="" className="w-3.5 h-3.5" />
              Создать мероприятие
            </button>
          </div>
        </div>

        {isCreateEventModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-xs"
              onClick={() => setIsCreateEventModalOpen(false)}
            />

            <div className="relative w-full max-w-[600px] max-h-[90vh] rounded-lg border-2 border-border bg-card-background overflow-hidden text-white animate-in fade-in zoom-in-95 duration-150 flex flex-col">

              <div className="flex flex-col border-b-2 border-border px-4 md:px-6 py-5 gap-1 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="./create-team-modal-icon.svg"
                      alt=""
                      className="w-3.5 h-3.5"
                    />

                    <span className="text-xs uppercase tracking-wide text-red">
                      Создание мероприятия
                    </span>
                  </div>

                  <button
                    onClick={() => setIsCreateEventModalOpen(false)}
                    className="text-text-accent hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-base md:text-lg">
                  Создайте свое мероприятие
                </h3>
              </div>

              <div className="p-4 md:p-6 flex flex-col gap-4 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-wide text-text-accent">
                      Название мероприятия
                    </label>

                    <div className="relative flex items-center group">
                      <Tag className="absolute left-3 w-4 h-4 text-text-accent group-focus-within:text-red transition-colors" />

                      <Input
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        placeholder="HackPrimeCode Лето 2026"
                        className="h-12 bg-input-background border border-border rounded-sm pl-10 pr-4 text-white placeholder:text-text-accent"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-wide text-text-accent">
                      Место проведения
                    </label>

                    <div className="relative flex items-center group">
                      <MapPin className="absolute left-3 w-4 h-4 text-text-accent group-focus-within:text-red transition-colors" />

                      <select
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value as HackathonLocation)}
                        className="h-12 w-full bg-input-background border border-border rounded-sm pl-10 pr-4 text-white appearance-none cursor-pointer"
                      >
                        <option value="Онлайн">Онлайн</option>
                        <option value="Москва">Москва</option>
                        <option value="Санкт-Петербург">Санкт-Петербург</option>
                        <option value="Казань">Казань</option>
                        <option value="Нижний-Новгород">Нижний-Новгород</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wide text-text-accent">
                    Описание мероприятия
                  </label>

                  <div className="relative flex items-center group">
                    <Input
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      placeholder="Описание мероприятия..."
                      className="h-12 bg-input-background border border-border rounded-sm px-4 text-white placeholder:text-text-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-wide text-text-accent">
                      Навыки
                    </label>

                    <div className="relative flex items-center group">
                      <Tag className="absolute left-3 w-4 h-4 text-text-accent group-focus-within:text-red transition-colors" />

                      <Input
                        value={topics}
                        onChange={(e) => setTopics(e.target.value)}
                        placeholder="Python, React, AI..."
                        className="h-12 bg-input-background border border-border rounded-sm pl-10 pr-4 text-white placeholder:text-text-accent"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-wide text-text-accent">
                      Максимальное количество участников
                    </label>

                    <div className="relative flex items-center group">
                      <Users className="absolute left-3 w-4 h-4 text-text-accent group-focus-within:text-red transition-colors" />

                      <Input
                        type="number"
                        value={maxParticipants}
                        onChange={(e) => setMaxParticipants(e.target.value)}
                        placeholder="Не ограничено"
                        className="h-12 bg-input-background border border-border rounded-sm pl-10 pr-4 text-white placeholder:text-text-accent"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-wide text-text-accent">
                      Дата и время начала
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative flex items-center group">
                        <Calendar className="absolute left-3 w-4 h-4 text-text-accent group-focus-within:text-red transition-colors" />
                        <Input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="h-12 bg-input-background border border-border rounded-sm pl-10 pr-4 text-white placeholder:text-text-accent"
                        />
                      </div>
                      <div className="relative flex items-center group">
                        <Input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="h-12 bg-input-background border border-border rounded-sm px-4 text-white placeholder:text-text-accent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-wide text-text-accent">
                      Дата и время окончания
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative flex items-center group">
                        <Calendar className="absolute left-3 w-4 h-4 text-text-accent group-focus-within:text-red transition-colors" />
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="h-12 bg-input-background border border-border rounded-sm pl-10 pr-4 text-white placeholder:text-text-accent"
                        />
                      </div>
                      <div className="relative flex items-center group">
                        <Input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="h-12 bg-input-background border border-border rounded-sm px-4 text-white placeholder:text-text-accent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-wide text-text-accent">
                      Размер команды (от)
                    </label>

                    <div className="relative flex items-center group">
                      <Users className="absolute left-3 w-4 h-4 text-text-accent group-focus-within:text-red transition-colors" />

                      <Input
                        type="number"
                        value={minTeamSize}
                        onChange={(e) => setMinTeamSize(e.target.value)}
                        placeholder="1"
                        className="h-12 bg-input-background border border-border rounded-sm pl-10 pr-4 text-white placeholder:text-text-accent"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-wide text-text-accent">
                      Размер команды (до)
                    </label>

                    <div className="relative flex items-center group">
                      <Users className="absolute left-3 w-4 h-4 text-text-accent group-focus-within:text-red transition-colors" />

                      <Input
                        type="number"
                        value={maxTeamSize}
                        onChange={(e) => setMaxTeamSize(e.target.value)}
                        placeholder="5"
                        className="h-12 bg-input-background border border-border rounded-sm pl-10 pr-4 text-white placeholder:text-text-accent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wide text-text-accent">
                    Призы
                  </label>

                  <div className="flex flex-col gap-2">
                    {prizes.map((prize, index) => (
                      <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-start">
                        <div className="relative flex items-center group">
                          <Award className="absolute left-3 w-4 h-4 text-text-accent group-focus-within:text-red transition-colors" />
                          <Input
                            value={prize.title}
                            onChange={(e) => {
                              const newPrizes = [...prizes];
                              newPrizes[index].title = e.target.value;
                              setPrizes(newPrizes);
                            }}
                            placeholder="Название места"
                            className="h-12 bg-input-background border border-border rounded-sm pl-10 pr-4 text-white placeholder:text-text-accent"
                          />
                        </div>
                        <div className="relative flex items-center group">
                          <Input
                            value={prize.reward}
                            onChange={(e) => {
                              const newPrizes = [...prizes];
                              newPrizes[index].reward = e.target.value;
                              setPrizes(newPrizes);
                            }}
                            placeholder="Приз за место"
                            className="h-12 bg-input-background border border-border rounded-sm px-4 text-white placeholder:text-text-accent"
                          />
                        </div>
                        {prizes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newPrizes = prizes.filter((_, i) => i !== index);
                              setPrizes(newPrizes);
                            }}
                            className="h-12 w-12 flex items-center justify-center border border-border rounded-sm text-text-accent hover:text-white hover:border-red transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPrizes([...prizes, { title: "", reward: "" }])}
                      className="h-10 px-4 border border-border rounded-sm text-text-accent text-sm hover:text-white hover:border-red transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Добавить приз
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCreateEvent}
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-red text-white text-sm font-medium hover:bg-red/90 transition-colors cursor-pointer shrink-0"
                >
                  <img
                    src="./create-team-icon.svg"
                    alt=""
                    className="w-5 h-5"
                  />

                  Создать мероприятие
                </button>

              </div>
            </div>
          </div>
        )}
      </>
    );
  }


  return (
    <div className="w-full min-h-[calc(100vh-3.75rem)] flex flex-col lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="w-full flex flex-col lg:h-full border-b lg:border-b-0 lg:border-r border-border bg-background z-20">
        <div className="w-full border-b border-border p-4 lg:p-5 flex lg:flex-col justify-between items-center lg:items-start gap-2">
          <div className="min-w-0 relative">
            <span className="text-[10px] sm:text-xs text-red uppercase block mb-0.5 lg:mb-2 tracking-wider">
              Мероприятие
            </span>
            {isAdmin ? (
              <div className="relative">
                <button
                  onClick={() => setIsHackathonDropdownOpen(!isHackathonDropdownOpen)}
                  className="flex items-center gap-2 text-white text-xs sm:text-sm font-medium truncate max-w-50 sm:max-w-xs lg:max-w-full hover:text-red transition-colors"
                >
                  {currentHackathonTitle || "Выберите хакатон"}
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                </button>
                {isHackathonDropdownOpen && hackathonsList && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-card-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {hackathonsList.map((hackathon) => (
                      <button
                        key={hackathon.id}
                        onClick={() => handleSelectHackathon(hackathon.id, hackathon.title)}
                        className="w-full text-left px-3 py-2 text-xs sm:text-sm text-white hover:bg-input-background/50 transition-colors truncate"
                      >
                        {hackathon.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <h2 className="text-white text-xs sm:text-sm font-medium truncate max-w-50 sm:max-w-xs lg:max-w-full">
                {currentHackathonTitle || "Нет мероприятия"}
              </h2>
            )}
          </div>
          <div className="lg:hidden p-1.5 bg-red/10 border border-red/20 rounded-md">
            <BookOpen className="w-3.5 h-3.5 text-red" />
          </div>
        </div>

        <nav className="w-full flex lg:flex-col gap-1 p-2 overflow-x-auto custom-scrollbar whitespace-nowrap">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 lg:flex-none h-9 lg:h-10 px-3 rounded-lg flex items-center justify-center lg:justify-start gap-2 sm:gap-2.5 text-[11px] sm:text-xs font-medium lg:font-normal cursor-pointer transition-all shrink-0 ${
              activeTab === "overview"
                ? "bg-red/6 border border-red text-red shadow-xs"
                : "text-text-accent hover:text-white hover:bg-input-background/50 border border-transparent"
            }`}
          >
            <BarChart2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeTab === "overview" ? "text-red" : ""}`} />
            <span>Обзор</span>
          </button>

          <button
            onClick={() => setActiveTab("task")}
            className={`flex-1 lg:flex-none h-9 lg:h-10 px-3 rounded-lg flex items-center justify-center lg:justify-start gap-2 sm:gap-2.5 text-[11px] sm:text-xs font-medium lg:font-normal cursor-pointer transition-all shrink-0 ${
              activeTab === "task"
                ? "bg-red/6 border border-red text-red shadow-xs"
                : "text-text-accent hover:text-white hover:bg-input-background/50 border border-transparent"
            }`}
          >
            <FileText className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeTab === "task" ? "text-red" : ""}`} />
            <span>Задание</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 lg:flex-none h-9 lg:h-10 px-3 rounded-lg flex items-center justify-center lg:justify-start gap-2 sm:gap-2.5 text-[11px] sm:text-xs font-medium lg:font-normal cursor-pointer transition-all shrink-0 ${
              activeTab === "settings"
                ? "bg-red/6 border border-red text-red shadow-xs"
                : "text-text-accent hover:text-white hover:bg-input-background/50 border border-transparent"
            }`}
          >
            <Settings className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeTab === "settings" ? "text-red" : ""}`} />
            <span>Настройки</span>
          </button>

          <button
            onClick={() => setActiveTab("jury")}
            className={`flex-1 lg:flex-none h-9 lg:h-10 px-3 rounded-lg flex items-center justify-center lg:justify-start gap-2 sm:gap-2.5 text-[11px] sm:text-xs font-medium lg:font-normal cursor-pointer transition-all shrink-0 ${
              activeTab === "jury"
                ? "bg-red/6 border border-red text-red shadow-xs"
                : "text-text-accent hover:text-white hover:bg-input-background/50 border border-transparent"
            }`}
          >
            <UserCheck className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeTab === "jury" ? "text-red" : ""}`} />
            <span>Жюри</span>
          </button>
        </nav>
      </aside>

      <main className="flex flex-col p-4 sm:p-6 min-w-0">
        <div className="mb-4 lg:mb-6">
          <h1 className="text-xl sm:text-2xl text-white mb-1">{activeTab === "overview" ? "Обзор" : activeTab === "task" ? "Задание" : activeTab === "settings" ? "Настройки" : "Жюри"}</h1>
          <p className="text-[10px] sm:text-xs text-text-accent">// Панель организатора · {currentHackathonTitle || "Нет мероприятия"}</p>
        </div>

        {activeTab === "overview" && <OverviewTab hackathonId={currentHackathonId} />}

        {activeTab === "task" && <TaskTab hackathonId={currentHackathonId} />}

        {activeTab === "settings" && <SettingsTab hackathonId={currentHackathonId} />}

        {activeTab === "jury" && <JuryTab hackathonId={currentHackathonId} />}
      </main>
    </div>
  );
}
