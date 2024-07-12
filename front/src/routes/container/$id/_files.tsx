import { useGetFiles } from "@/api/get-files";
import InfiniteLoading from "@/components/infinite-loading";
import { useStore } from "@/store";
import { columns } from "@/table/file/columns";
import FileTable from "@/table/file/data-table";
import { useEffect, useMemo, useState } from "react";
import { FaFolder } from "react-icons/fa";
import { ExtendedFile, File } from "~types/file";
import { ContainerInfo } from "~types/v2/container/list";
import NotRunning from "./_components/not-running";
import { updateNestedDataByPath } from "@/util";

export default function FilesTab({ id }: { id: string }) {
  const container = useStore().containers.find(
    (x) => (x as ContainerInfo).Id === id
  ) as ContainerInfo;

  if (container.State !== "running") {
    return (
      <NotRunning Icon={FaFolder} text="To get files, run the container." />
    );
  }

  const [data, setData] = useState<File[]>();
  const { mutateAsync, isPending } = useGetFiles(id);

  async function getFilesRecursive(path?: string) {
    const folderIndex = data?.findIndex((x) => x.path === path);
    const folder = folderIndex ? data?.[folderIndex] : undefined;

    if (folder) {
      setData((oldData) => {
        return updateNestedDataByPath(
          oldData,
          [folderIndex + "", "isLoading"],
          true
        );
      });
    }

    const response = await mutateAsync((folder?.path || "") + "/");

    if (folder) {
      setData((oldData) => {
        return updateNestedDataByPath(
          oldData,
          [folderIndex + "", "isLoading"],
          false
        );
      });
    }

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
    <>
      {!data && isPending && <InfiniteLoading width="50vw" className="my-5" />}
      {grouped && (
        <FileTable
          columns={columns}
          data={grouped}
          getFiles={getFilesRecursive}
        />
      )}
    </>
  );
}