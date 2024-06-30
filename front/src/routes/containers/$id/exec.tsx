import ExecTerminal from "@/components/exec-terminal";
import { TabsContent } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/containers/$id/exec")({
  component: Page,
});

function Page() {
  const id = Route.useParams({ select: (x) => x.id });

  return (
    <TabsContent value="exec" className="h-full">
      <ExecTerminal id={id} />
    </TabsContent>
  );
}
