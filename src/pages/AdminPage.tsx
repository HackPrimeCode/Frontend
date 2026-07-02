import { useMemo, useState } from "react";
import {
  ChevronDown,
  Clock,
  Cpu,
  Monitor,
  Search,
  UserMinus,
  UserPlus,
  UserRound,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AdminTab = "panel" | "organizers";

type UserRole = "user" | "judge" | "organizator" | "admin";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  color: string;
}

const roleOptions: { value: UserRole; label: string }[] = [
  { value: "user", label: "User" },
  { value: "judge", label: "Judge" },
  { value: "organizator", label: "Organizer" },
  { value: "admin", label: "Admin" },
];

const avatarPalette = ["#C71C25", "#3D9A6A", "#FFCC00", "#7B5EA7", "#3B82F6"];

const mockUsers: AdminUser[] = [
  {
    id: 1,
    name: "Алексей Иванов",
    email: "killog7@gmail.com",
    role: "user",
    color: avatarPalette[0],
  },
  {
    id: 2,
    name: "Мария Волкова",
    email: "m.volkova@gmail.com",
    role: "judge",
    color: avatarPalette[1],
  },
  {
    id: 3,
    name: "Дмитрий Булдыков",
    email: "d.kim@mail.com",
    role: "organizator",
    color: avatarPalette[2],
  },
  {
    id: 4,
    name: "Елена Соколова",
    email: "e.sokolova@gmail.com",
    role: "user",
    color: avatarPalette[3],
  },
  {
    id: 5,
    name: "Иван Петров",
    email: "i.petrov@mail.ru",
    role: "judge",
    color: avatarPalette[4],
  },
  {
    id: 6,
    name: "Андрей Профатов",
    email: "a.profatov@mail.com",
    role: "admin",
    color: avatarPalette[2],
  },
];

const mockOrganizers: AdminUser[] = [
  mockUsers[0],
  mockUsers[1],
  mockUsers[2],
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

function SidebarTab({
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  label: string;
  icon: typeof Cpu;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-xs transition-all duration-150",
        isActive
          ? "border-red bg-red/6 text-red"
          : "border-transparent bg-transparent text-text-accent hover:border-border hover:text-text",
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
      <span>{label}</span>
    </button>
  );
}

function RoleSelect({
  value,
  onChange,
}: {
  value: UserRole;
  onChange: (role: UserRole) => void;
}) {
  return (
    <div className="relative w-[140px] shrink-0">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as UserRole)}
        className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-border bg-input-background px-3 pr-8 text-sm text-text outline-none"
      >
        {roleOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-text-accent" />
    </div>
  );
}

function AdminPanelTab({
  users,
  onRoleChange,
}: {
  users: AdminUser[];
  onRoleChange: (id: number, role: UserRole) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query),
    );
  }, [users, searchQuery]);

  return (
    <>
      <div>
        <h1 className="text-2xl text-text">Админ панель</h1>
      </div>

      <div className="rounded-lg border border-border bg-card-background">
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
          <span className="text-sm text-text-accent">
            {users.length} человек
          </span>

          <div className="relative w-full max-w-[220px]">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-text-accent" />
            <Input
              type="text"
              placeholder="Поиск ..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-9 w-full rounded-lg border-border bg-input-background pr-4 pl-10 text-sm text-text placeholder:text-text-accent"
            />
          </div>
        </div>

        <div className="divide-y divide-border">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-4 px-5 py-4"
            >
              <UserAvatar name={user.name} color={user.color} />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-text">{user.name}</p>
                <p className="truncate text-xs text-text-accent">{user.email}</p>
              </div>

              <RoleSelect
                value={user.role}
                onChange={(role) => onRoleChange(user.id, role)}
              />
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="flex h-32 items-center justify-center text-sm text-text-accent">
              Пользователи не найдены
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function OrganizersTab({
  organizers,
  onRemove,
}: {
  organizers: AdminUser[];
  onRemove: (id: number) => void;
}) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitedEmails, setInvitedEmails] = useState<string[]>([
    "o.sidorova@example.com",
  ]);

  const handleInvite = (event: React.FormEvent) => {
    event.preventDefault();
    const email = inviteEmail.trim();
    if (!email || invitedEmails.includes(email)) return;

    setInvitedEmails((prev) => [...prev, email]);
    setInviteEmail("");
  };

  return (
    <>
      <div>
        <h1 className="text-2xl text-text">Организаторы мероприятий</h1>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_340px]">
        <div className="rounded-lg border border-border bg-card-background">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <span className="text-base text-text">Организаторы</span>
            <span className="text-sm text-text-accent">
              {organizers.length} человек
            </span>
          </div>

          <div className="divide-y divide-border">
            {organizers.map((organizer) => (
              <div
                key={organizer.id}
                className="flex items-center gap-4 px-5 py-4"
              >
                <UserAvatar name={organizer.name} color={organizer.color} />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-text">{organizer.name}</p>
                  <p className="truncate text-xs text-text-accent">
                    {organizer.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(organizer.id)}
                  className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs text-red hover:text-red/85"
                >
                  <UserMinus className="h-3.5 w-3.5" />
                  Исключить
                </button>
              </div>
            ))}

            {organizers.length === 0 && (
              <div className="flex h-32 items-center justify-center text-sm text-text-accent">
                Организаторы не найдены
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="rounded-lg border border-border bg-card-background p-5">
            <div className="mb-4 flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-red" strokeWidth={2} />
              <h3 className="text-xs uppercase text-text-accent">
                Пригласить организатора
              </h3>
            </div>

            <form onSubmit={handleInvite} className="flex flex-col gap-3">
              <label className="text-xs text-text-accent">
                Email организатора
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

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("panel");
  const [users, setUsers] = useState(mockUsers);
  const [organizers, setOrganizers] = useState(mockOrganizers);

  const handleRoleChange = (id: number, role: UserRole) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, role } : user)),
    );
  };

  const handleRemoveOrganizer = (id: number) => {
    setOrganizers((prev) => prev.filter((organizer) => organizer.id !== id));
  };

  return (
    <div className="grid min-h-[calc(100vh-3.75rem)] w-full grid-cols-[16rem_1px_1fr] bg-background">
      <aside className="flex flex-col gap-4 p-5">

        <nav className="flex flex-col gap-2">
          <SidebarTab
            label="Админ панель"
            icon={Cpu}
            isActive={activeTab === "panel"}
            onClick={() => setActiveTab("panel")}
          />
          <SidebarTab
            label="Организаторы"
            icon={Monitor}
            isActive={activeTab === "organizers"}
            onClick={() => setActiveTab("organizers")}
          />
        </nav>
      </aside>

      <div className="bg-border" />

      <main className="flex flex-col gap-6 px-6 py-5">
        {activeTab === "panel" ? (
          <AdminPanelTab users={users} onRoleChange={handleRoleChange} />
        ) : (
          <OrganizersTab
            organizers={organizers}
            onRemove={handleRemoveOrganizer}
          />
        )}
      </main>
    </div>
  );
}
