import { useGetContainerInspect } from "@/api/inspect-container";
import InfiniteLoading from "@/components/infinite-loading";
import { TabsContent } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import { JsonEditor } from "json-edit-react";

export const Route = createFileRoute("/containers/$id/inspect")({
  component: Page,
});

function Page() {
  const id = Route.useParams({ select: (x) => x.id });
  const { data, isLoading } = useGetContainerInspect(id);

  return (
    <TabsContent value="inspect">
      {isLoading && <InfiniteLoading width="50vw" className="my-5" />}
      {data?.status && (
        <JsonEditor
          data={data.data}
          maxWidth=""
          theme={"githubDark"}
          rootName="data"
          restrictEdit
          restrictDelete
          restrictAdd
          restrictDrag
          restrictTypeSelection
          enableClipboard={false}
          rootFontSize={13}
        />
      )}
    </TabsContent>
  );
}
