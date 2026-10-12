import Image from "next/image";
import { profile } from "@/content/profile";

/** Profile mark: your photo when profile.portrait is set, otherwise your initials. */
export function Avatar({ size = 44 }: { size?: number }) {
  return (
    <span
      className="relative isolate grid shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-accent-soft"
      style={{ width: size, height: size }}
    >
      {profile.portrait ? (
        // Served as-is: the 512px file is already sized and sharpened, and the optimizer's re-encode softened the face.
        <Image src={profile.portrait} alt="" fill unoptimized loading="eager" className="object-cover" />
      ) : (
        <span className="font-display font-semibold tracking-tight text-accent" style={{ fontSize: Math.round(size * 0.3) }}>
          KM
        </span>
      )}
    </span>
  );
}
