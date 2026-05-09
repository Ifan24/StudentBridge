"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Bookmark,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  Home,
  MessageCircle,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { appNav } from "@/lib/constants";

const iconMap = {
  Home,
  Events: CalendarDays,
  Forum: MessageCircle,
  Jobs: BriefcaseBusiness,
  Support: CircleHelp,
  "AI Guide": Bot,
  Premium: Rocket
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white text-ink">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 flex-col border-r border-line bg-white px-5 py-6 lg:flex">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-bridge text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold leading-none tracking-normal">StudentBridge</div>
            <div className="mt-1 text-sm font-semibold text-bridge">Connect. Share. Belong.</div>
          </div>
        </Link>

        <nav className="mt-10 grid gap-1">
          {appNav.map((item) => {
            const Icon = iconMap[item.label as keyof typeof iconMap] ?? Home;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`focus-ring flex items-center gap-3 rounded-md px-4 py-3 text-sm font-bold transition ${
                  active ? "bg-mist text-bridge" : "text-ink hover:bg-mist"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-lg border border-line bg-mist p-4">
          <p className="muted-label">Current city</p>
          <div className="mt-2 text-lg font-extrabold">Sydney</div>
          <p className="mt-2 text-sm leading-6 text-muted">Events and support links prioritise Australian student pathways.</p>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5 lg:justify-end lg:px-8">
            <Link href="/dashboard" className="flex items-center gap-3 lg:hidden">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-bridge text-white">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold leading-none tracking-normal">StudentBridge</div>
                <div className="mt-1 text-sm font-semibold text-bridge">Connect. Share. Belong.</div>
              </div>
            </Link>

            <div className="hidden items-center gap-3 md:flex">
              <button className="focus-ring hidden h-11 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-bold lg:flex">
                Sydney <ChevronDown className="h-4 w-4" />
              </button>
              <div className="flex h-11 min-w-52 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm text-muted">
                <Search className="h-4 w-4" />
                Search StudentBridge
              </div>
              <button className="focus-ring grid h-11 w-11 place-items-center rounded-md border border-line bg-white text-ink">
                <Bell className="h-5 w-5" />
              </button>
              <button className="focus-ring grid h-11 w-11 place-items-center rounded-md border border-line bg-white text-ink">
                <Bookmark className="h-5 w-5" />
              </button>
              <button className="focus-ring flex h-11 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-bold">
                RL <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] px-5 py-8 pb-24 lg:px-8 lg:pb-10">{children}</main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 border-t border-line bg-white lg:hidden">
        {appNav.slice(0, 4).map((item) => {
          const Icon = iconMap[item.label as keyof typeof iconMap] ?? Home;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 py-3 text-xs font-bold ${active ? "text-bridge" : "text-muted"}`}>
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-mist px-3 py-2 text-sm font-bold text-bridge">
          <Sparkles className="h-4 w-4" />
          StudentBridge workspace
        </div>
        <h1 className="text-4xl font-extrabold tracking-normal text-ink lg:text-5xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}
