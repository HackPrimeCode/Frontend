import { useState } from "react";
import { UserPlus, UserMinus, UserRound, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";

interface JuryMember {
  id: number;
  name: string;
  email: string;
  color: string;
}

const avatarPalette = ["#C71C25", "#3D9A6A", "#FFCC00", "#7B5EA7", "#3B82F6"];

const mockJury: JuryMember[] = [
  {
    id: 1,
    name: "Мария Волкова",
    email: "m.volkova@gmail.com",
    color: avatarPalette[1],
  },
  {
    id: 2,
    name: "Иван Петров",
    email: "i.petrov@mail.ru",
    color: avatarPalette[4],
  },
  {
    id: 3,
    name: "Елена Соколова",
    email: "e.sokolova@gmail.com",
    color: avatarPalette[3],
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function UserAvatar({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-text"
      style={{ backgroundColor: color }}
    >
      {getInitials(name)}
    </span>
  );
}

export default function JuryTab() {
  const [jury, setJury] = useState(mockJury);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitedEmails, setInvitedEmails] = useState<string[]>([
    "j.kim@example.com",
  ]);

  const handleInvite = (event: React.FormEvent) => {
    event.preventDefault();
    const email = inviteEmail.trim();
    if (!email || invitedEmails.includes(email)) return;

    setInvitedEmails((prev) => [...prev, email]);
    setInviteEmail("");
  };

  const handleRemove = (id: number) => {
    setJury((prev) => prev.filter((member) => member.id !== id));
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_340px]">
        <div className="rounded-lg border border-border bg-card-background">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <span className="text-base text-text">Жюри</span>
            <span className="text-sm text-text-accent">
              {jury.length} человек
            </span>
          </div>

          <div className="divide-y divide-border">
            {jury.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 px-5 py-4"
              >
                <UserAvatar name={member.name} color={member.color} />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-text">{member.name}</p>
                  <p className="truncate text-xs text-text-accent">
                    {member.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(member.id)}
                  className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs text-red hover:text-red/85"
                >
                  <UserMinus className="h-3.5 w-3.5" />
                  Исключить
                </button>
              </div>
            ))}

            {jury.length === 0 && (
              <div className="flex h-32 items-center justify-center text-sm text-text-accent">
                Жюри не найдены
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="rounded-lg border border-border bg-card-background p-5">
            <div className="mb-4 flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-red" strokeWidth={2} />
              <h3 className="text-xs uppercase text-text-accent">
                Пригласить жюри
              </h3>
            </div>

            <form onSubmit={handleInvite} className="flex flex-col gap-3">
              <label className="text-xs text-text-accent">
                Email жюри
              </label>

              <div className="relative">
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  placeholder="user@example.com"
                  className="h-10 w-full rounded-lg border-border bg-input-background pr-12 text-sm text-text placeholder:text-text-accent"
                />
                <button
                  type="submit"
                  className="absolute top-1/2 right-1 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md bg-red hover:bg-red/90"
                >
                  <img src="./send-invite-icon.svg" className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-lg border border-border bg-card-background p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red" strokeWidth={2} />
                <h3 className="text-xs uppercase text-text-accent">
                  Приглашены
                </h3>
              </div>
              <span className="text-xs text-red">{invitedEmails.length}</span>
            </div>

            <div className="space-y-2">
              {invitedEmails.map((email) => (
                <div
                  key={email}
                  className="flex items-center gap-2.5 rounded-lg border border-border bg-input-background px-3 py-2.5"
                >
                  <UserRound className="h-4 w-4 text-text-accent" />
                  <span className="truncate text-xs text-text">{email}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
