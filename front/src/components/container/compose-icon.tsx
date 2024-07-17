import { getComposeColor } from "@/components/table/helper";
import { Link } from "@tanstack/react-router";
import { ImStack } from "react-icons/im";
import { Compose } from "~types/v2/container/list";

export function ComposeIcon({
  compose,
  depth,
}: {
  compose: Compose;
  depth: number;
}) {
  const paddingLeft = `${depth}rem`;

  const color = getComposeColor(compose);

  return (
    <Link
      to={"/compose/$name"}
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
