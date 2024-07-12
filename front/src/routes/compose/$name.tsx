import { useStore } from "@/store";
import { createFileRoute } from "@tanstack/react-router";
import { Compose } from "~types/v2/container/list";
import Container from "./_container";
import ComposeLogsTerminal from "./_terminal";

export const Route = createFileRoute("/compose/$name")({
  component: Page,
});

function Page() {
  const { name } = Route.useParams();

  const compose = useStore((x) =>
    x.containers.find((x) => (x as Compose).name === name)
  ) as Compose;

  if (!compose) return "no compose";

  return (
    <div className="flex gap-3 w-full h-full overflow-hidden">
      <div className="flex flex-col w-[30%] overflow-auto scrollbar">
        {compose.containers.map((container) => (
          <Container container={container} key={container.Id} />
        ))}
      </div>
      <div className="w-full border">
        <ComposeLogsTerminal name={name} />
      </div>
    </div>
  );
}
