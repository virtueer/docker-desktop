import { useGetFiles } from "@/api/get-files";
import { TabsContent } from "@/components/ui/tabs";
import { columns } from "@/table/file/columns";
import FileTable from "@/table/file/data-table";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { File, ExtendedFile } from "~types/file";

export const Route = createFileRoute("/containers/$id/files")({
  component: Page,
});

function Page() {
  const id = Route.useParams({ select: (x) => x.id });
  const [data, setData] = useState<File[]>();
  const { mutateAsync, isPending } = useGetFiles(id);

  async function getFilesRecursive(path?: string) {
    const folder = data?.find((x) => x.path === path);

    const response = await mutateAsync((folder?.path || "") + "/");

    if (!response.status) return [];

    setData([...(data || []), ...response.data]);
  }

  useEffect(() => {
    getFilesRecursive();
  }, []);

  const grouped = useMemo(() => {
    const tree = data?.reduce((acc: ExtendedFile[], item: ExtendedFile) => {
      const findParent = (
        items: ExtendedFile[],
        parentPath: string
      ): ExtendedFile | null => {
        for (let item of items) {
          if (item.path === parentPath) {
            return item;
          }
          if (item.childs) {
            const result = findParent(item.childs, parentPath);
            if (result) {
              return result;
            }
          }
        }
        return null;
      };

      if (item.dir === "/") {
        acc.push(item);
      } else {
        const parent = findParent(acc, item.dir);
        if (parent) {
          if (!parent.childs) {
            parent.childs = [];
          }
          parent.childs.push(item);
        }
      }

      return acc;
    }, []);

    return tree;
  }, [data]);

  return (
    <TabsContent value="files">
      {isPending && "Loading.."}
      {grouped && (
        <FileTable
          columns={columns}
          data={grouped}
          getFiles={getFilesRecursive}
        />
      )}
    </TabsContent>
  );
}
