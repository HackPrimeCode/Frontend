import { useState, useEffect } from "react";
import { Tag, MapPin, Users, Plus, Award, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGetOrganizerHackathonDetailsQuery, useUpdateHackathonMutation } from "@/features/organizer/api";
import type { HackathonLocation } from "@/features/organizer/model/organizerTypes";

interface Prize {
  title: string;
  reward: string;
}

interface SettingsTabProps {
  hackathonId: number | null;
}

export default function SettingsTab({ hackathonId }: SettingsTabProps) {
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

  const { data: hackathonData, isLoading } = useGetOrganizerHackathonDetailsQuery(hackathonId ?? 0, {
    skip: !hackathonId,
  });

  const [updateHackathon] = useUpdateHackathonMutation();

  useEffect(() => {
    if (hackathonData) {
      setEventTitle(hackathonData.title || "");
      setEventDescription(hackathonData.description || "");
      setEventLocation(hackathonData.place || "Онлайн");
      setMinTeamSize(hackathonData.min_team_size?.toString() || "1");
      setMaxTeamSize(hackathonData.max_team_size?.toString() || "5");
      setMaxParticipants(hackathonData.max_participants?.toString() || "");
      setTopics(hackathonData.topics?.join(", ") || "");
      
      if (hackathonData.start_date) {
        const startDateObj = new Date(hackathonData.start_date);
        setStartDate(startDateObj.toISOString().split('T')[0]);
        setStartTime(startDateObj.toTimeString().slice(0, 5));
      }
      
      if (hackathonData.end_date) {
        const endDateObj = new Date(hackathonData.end_date);
        setEndDate(endDateObj.toISOString().split('T')[0]);
        setEndTime(endDateObj.toTimeString().slice(0, 5));
      }

      if (hackathonData.prizes && hackathonData.prizes.length > 0) {
        setPrizes(hackathonData.prizes.map(p => ({ title: p.title, reward: p.reward })));
      }
    }
  }, [hackathonData]);

  const handleSaveSettings = async () => {
    if (!hackathonId) return;

    try {
      const updateData: any = {
        title: eventTitle,
        description: eventDescription,
        place: eventLocation,
        min_team_size: parseInt(minTeamSize),
        max_team_size: parseInt(maxTeamSize),
      };

      if (maxParticipants) {
        updateData.max_participants = parseInt(maxParticipants);
      }

      if (startDate && startTime) {
        updateData.start_date = `${startDate}T${startTime}`;
      }

      if (endDate && endTime) {
        updateData.end_date = `${endDate}T${endTime}`;
      }

      if (topics) {
        updateData.topics = topics.split(",").map(t => t.trim());
      }

      const validPrizes = prizes.filter(p => p.title && p.reward);
      if (validPrizes.length > 0) {
        updateData.prizes = validPrizes;
      }

      await updateHackathon({
        hackathonId,
        data: updateData,
      }).unwrap();
    } catch (error) {
      console.error("Failed to update hackathon:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-accent">Загрузка...</div>
      </div>
    );
  }

  if (!hackathonId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-accent">Выберите хакатон</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6 ml-0 md:ml-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wide text-text-accent">
            Дата и время начала
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative flex items-center group">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-12 bg-input-background border border-border rounded-sm text-white placeholder:text-text-accent [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
            <div className="relative flex items-center group">
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="h-12 bg-input-background border border-border rounded-sm px-4 text-white placeholder:text-text-accent [&::-webkit-calendar-picker-indicator]:invert"
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
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-12 bg-input-background border border-border rounded-sm text-white placeholder:text-text-accent [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
            <div className="relative flex items-center group">
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="h-12 bg-input-background border border-border rounded-sm px-4 text-white placeholder:text-text-accent [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
            <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4 md:gap-6 items-start w-full max-w-[700px]">
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
                  className="h-12 w-full sm:w-12 flex items-center justify-center border border-border rounded-sm text-text-accent hover:text-white hover:border-red transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setPrizes([...prizes, { title: "", reward: "" }])}
            className="h-10 w-full sm:w-fit px-6 border border-border rounded-sm text-text-accent text-sm hover:text-white hover:border-red transition-colors cursor-pointer flex items-center justify-center sm:justify-start gap-2"
          >
            <Plus className="w-4 h-4" />
            Добавить приз
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-start gap-2">
        <button
          type="button"
          onClick={handleSaveSettings}
          className="flex h-10 w-full sm:w-fit items-center justify-center gap-2 px-6 rounded-sm bg-red text-white text-sm font-medium hover:bg-red/90 transition-colors cursor-pointer"
        >
          Сохранить изменения
        </button>
      </div>
    </div>
  );
}
