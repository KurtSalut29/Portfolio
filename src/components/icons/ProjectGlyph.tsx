import {
  CalendarCheckIcon,
  ClipboardTextIcon,
  CoffeeIcon,
  DiamondIcon,
  FirstAidKitIcon,
  FunnelIcon,
  GameControllerIcon,
  HammerIcon,
  PlusIcon,
  RecycleIcon,
  SirenIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { ProjectIcon } from "@/content/projects";

const MAP: Record<ProjectIcon, typeof SirenIcon> = {
  siren: SirenIcon,
  recycle: RecycleIcon,
  funnel: FunnelIcon,
  plus: PlusIcon,
  hospital: FirstAidKitIcon,
  gem: DiamondIcon,
  hammer: HammerIcon,
  coffee: CoffeeIcon,
  calendar: CalendarCheckIcon,
  clipboard: ClipboardTextIcon,
  game: GameControllerIcon,
};

export function ProjectGlyph({
  icon,
  size = 24,
  color,
}: {
  icon: ProjectIcon;
  size?: number | string;
  color?: string;
}) {
  const C = MAP[icon];
  return <C size={size} color={color} weight="duotone" aria-hidden="true" />;
}
