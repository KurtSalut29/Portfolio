import type { Project } from "@/content/projects";
import { Laptop, Phone } from "./Devices";
import { Screen } from "./screens";

const lift = "transition-transform duration-500 ease-[var(--ease-out)]";

/**
 * The project's devices, arranged by platform:
 * mobile shows a phone, web a laptop, both a laptop with a phone in front, desktop a laptop running a terminal.
 * Fills its parent, which should be `relative` with a set aspect ratio. Lifts on hover of a `group` ancestor.
 */
export function DeviceStage({ project }: { project: Project }) {
  switch (project.platform) {
    case "mobile":
      return (
        <div className={`absolute top-[3%] left-1/2 w-[30%] -translate-x-1/2 group-hover:-translate-y-[1.5%] ${lift}`}>
          <Phone>
            <Screen project={project} kind="mobile" />
          </Phone>
        </div>
      );
    case "both":
      return (
        <>
          <div className={`absolute top-[14%] left-[4%] w-[76%] group-hover:-translate-y-[1.5%] ${lift}`}>
            <Laptop>
              <Screen project={project} kind="web" />
            </Laptop>
          </div>
          <div className={`absolute top-[20%] right-[6%] w-[22%] group-hover:-translate-y-[3%] ${lift}`}>
            <Phone>
              <Screen project={project} kind="mobile" />
            </Phone>
          </div>
        </>
      );
    default:
      return (
        <div className={`absolute top-[12%] left-1/2 w-[82%] -translate-x-1/2 group-hover:-translate-y-[1.5%] ${lift}`}>
          <Laptop>
            <Screen project={project} kind="web" />
          </Laptop>
        </div>
      );
  }
}
