import { TabsContent } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/containers/$id/exec")({
  component: Page,
});

function Page() {
  return <TabsContent value="exec">Exec</TabsContent>;
}
