import { TabsContent } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/containers/$id/files")({
  component: Page,
});

function Page() {
  return <TabsContent value="files">Files</TabsContent>;
}
