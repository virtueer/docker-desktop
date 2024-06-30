import { TabsContent } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/containers/$id/inspect")({
  component: Page,
});

function Page() {
  return <TabsContent value="inspect">Inspect</TabsContent>;
}
