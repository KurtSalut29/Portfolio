import { Laptop, MonitorSmartphone, Smartphone, SquareTerminal, type LucideIcon } from "lucide-react";
import type { Platform } from "@/content/projects";

/** How each platform is labelled next to a project. */
export const PLATFORM: Record<Platform, { icon: LucideIcon; label: string }> = {
  mobile: { icon: Smartphone, label: "Mobile app" },
  web: { icon: Laptop, label: "Web app" },
  both: { icon: MonitorSmartphone, label: "Web and mobile" },
  desktop: { icon: SquareTerminal, label: "Desktop program" },
};
