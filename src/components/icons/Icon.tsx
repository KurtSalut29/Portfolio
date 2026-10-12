// SSR-safe Phosphor build: works in both Server and Client Components.
import {
  BrowserIcon,
  CodeIcon,
  DatabaseIcon,
  DeviceMobileIcon,
  EnvelopeSimpleIcon,
  GithubLogoIcon,
  GlobeHemisphereEastIcon,
  LightningIcon,
  LinkedinLogoIcon,
  PenNibIcon,
  StackIcon,
  UsersThreeIcon,
  WrenchIcon,
  XLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { IconProps } from "@phosphor-icons/react";

const MAP = {
  stack: StackIcon,
  code: CodeIcon,
  globe: GlobeHemisphereEastIcon,
  lightning: LightningIcon,
  users: UsersThreeIcon,
  browser: BrowserIcon,
  phone: DeviceMobileIcon,
  pen: PenNibIcon,
  database: DatabaseIcon,
  wrench: WrenchIcon,
  github: GithubLogoIcon,
  linkedin: LinkedinLogoIcon,
  x: XLogoIcon,
  email: EnvelopeSimpleIcon,
} as const;

export type IconName = keyof typeof MAP;

export function Icon({ name, ...props }: { name: IconName } & IconProps) {
  const C = MAP[name];
  return <C aria-hidden="true" {...props} />;
}
