import { useInspectContainer } from "@/api/container/inspect";
import InfiniteLoading from "@/components/infinite-loading/infinite-loading";
import { JsonEditor } from "json-edit-react";

export default function InspectTab({ id }: { id: string }) {
  const { data, isLoading } = useInspectContainer(id);

  if (isLoading) return <InfiniteLoading width="50vw" className="my-5" />;

  if (!data) {
    return "ERROR";
  }

  return (
    <JsonEditor
      data={data}
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
