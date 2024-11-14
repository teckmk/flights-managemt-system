"use client";

import { cn } from "@/lib/utils";
import {
  Plane,
  BarChart3,
  Settings,
  Users,
  Bell,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: "Dashboard",
    icon: BarChart3,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Flights",
    icon: Plane,
    href: "/flights",
    color: "text-violet-500",
  },
  {
    label: "Schedule",
    icon: Calendar,
    href: "/schedule",
    color: "text-pink-700",
  },
  {
    label: "Alerts",
    icon: Bell,
    href: "/alerts",
    color: "text-orange-700",
  },
  {
    label: "Users",
    icon: Users,
    href: "/users",
    color: "text-emerald-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <div className="w-60"></div>
      <div className="fixed space-y-4 py-4 flex min-h-screen flex-col w-60 bg-[#111827] text-white">
        <div className="px-3 py-2 flex-1">
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                  pathname === route.href
                    ? "text-white bg-white/10"
                    : "text-zinc-400"
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                  {route.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
