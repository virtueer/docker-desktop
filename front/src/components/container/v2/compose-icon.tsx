import { Link } from "@tanstack/react-router";
import { ImStack } from "react-icons/im";
import { Compose } from "~types/v2/container/list";
import { EXITED_COLOR, PAUSED_COLOR, RUNNING_COLOR } from "@/constants";
import { getComposeStatus } from "@/table/container/helper";

export function ComposeIcon({
  compose,
  depth,
}: {
  compose: Compose;
  depth: number;
}) {
  const paddingLeft = `${depth}rem`;

  let color = "";
  const status = getComposeStatus(compose);
  switch (true) {
    case status.startsWith("Exited"):
      color = EXITED_COLOR;
      break;

    case status.startsWith("Paused"):
      color = PAUSED_COLOR;
      break;

    case !!compose.containers?.find((x) => x.State !== "running"):
      color = PAUSED_COLOR;
      break;

    default:
      color = RUNNING_COLOR;
      break;
  }

  return (
    <Link
      to={"/v2/compose/$name"}
      params={{ name: compose.name }}
      className="text-blue-500"
    >
      <div className="flex items-center gap-3 font-bold">
        <div style={{ paddingLeft }}>
          {<ImStack size="1.5rem" color={color} />}
        </div>
        <div className="flex flex-col gap-1">
          <span className="underline underline-offset-4">{compose.name}</span>
        </div>
      </div>
    </Link>
  );
}
