import { useGetContainerInspect } from "@/api/inspect-container";
import InfiniteLoading from "@/components/infinite-loading/infinite-loading";
import { JsonEditor } from "json-edit-react";

export default function InspectTab({ id }: { id: string }) {
  const { data, isLoading } = useGetContainerInspect(id);

  if (isLoading) return <InfiniteLoading width="50vw" className="my-5" />;

  if (!data?.status) return "error";

  return (
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
  );
}
