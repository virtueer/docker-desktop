import { createFileRoute } from "@tanstack/react-router";
import { ContainerTable } from "./_table";
import { useStore } from "@/store";

export const Route = createFileRoute("/v2/container/")({
  component: Page,
});

function Page() {
  const containers = useStore((state) => state.containers);

  return <ContainerTable data={containers} />;
}
