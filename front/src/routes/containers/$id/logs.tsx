import LogsTerminal from "@/components/logs-terminal";
import { TabsContent } from "@/components/ui/tabs";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/containers/$id/logs")({
  component: Page,
});

function Page() {
  const id = useParams({ from: Route.id, select: (x) => x.id });

  return (
    <TabsContent value="logs" className="">
      <div className="border border-red-500 h-[calc(100vh-80px)]">
        <LogsTerminal id={id} />
      </div>
    </TabsContent>
  );
}
