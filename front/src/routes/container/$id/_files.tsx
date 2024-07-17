import { useGetFiles } from "@/api/get-files";
import { DataTable } from "@/components/data-table";
import InfiniteLoading from "@/components/infinite-loading";
import { getContainerById } from "@/store";
import { updateNestedDataByPath } from "@/util";
import { getCoreRowModel, getExpandedRowModel } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { FaFolder } from "react-icons/fa";
import { ExtendedFile, File } from "~types/file";
import NotRunning from "./_components/not-running";

import { TimeAgo } from "@/components/timeago";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import bytes from "bytes";
import { FaRegFile, FaRegFolder, FaSpinner } from "react-icons/fa";
import { LuFileSymlink } from "react-icons/lu";

type FileTableMetadata = {
  getFiles: (path: string) => void;
};

function getIcon(file: ExtendedFile) {
  let icon;

  switch (file.permission.fileType) {
    case "Directory":
      icon = <FaRegFolder />;
      break;

    case "Symbolic Link":
      icon = <LuFileSymlink />;
      break;

    default:
      icon = <FaRegFile />;
      break;
  }

  return icon;
}

export const columns: ColumnDef<ExtendedFile>[] = [
  {
    id: "Name",
    header: "Name",
    meta: {
      headerClass: "w-full",
      cellClass: "p-2",
    },
    cell({ row, table }) {
      const visibility =
        row.original.permission.fileType === "Directory" ? "visible" : "hidden";

      const isExpanded = row?.getIsExpanded();
      const isLoading = row.original.isLoading;

      const { getFiles } = table.options.meta as FileTableMetadata;

      function handleExpand() {
        if (!row.original.childs) {
          getFiles(row.original.path);
        }
        row.toggleExpanded();
      }

      const Icon = getIcon(row.original);

      return (
        <div
          className="flex items-center"
          style={{ paddingLeft: `${row.depth / 2}rem` }}
        >
          <Button
            variant="ghost"
            className="p-0 mr-1 w-fit h-fit rounded-full hover:bg-transparent"
            onClick={handleExpand}
            style={{ cursor: "pointer", textAlign: "center", visibility }}
          >
            {isLoading && <FaSpinner className="animate-spin" />}
            {!isLoading && isExpanded && <ChevronDownIcon />}
            {!isLoading && !isExpanded && <ChevronRightIcon />}
          </Button>

          {Icon}
          <span className="ml-2"> {row.original.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell({ row }) {
      const value = row.original.size;
      return bytes(value, { unitSeparator: " " });
    },
    meta: {
      cellClass: "whitespace-nowrap p-2",
    },
  },
  {
    accessorKey: "modify",
    header: "Modify",
    cell({ row }) {
      return <TimeAgo date={row.original.modify} />;
    },
    meta: {
      cellClass: "whitespace-nowrap p-2",
    },
  },
  {
    accessorFn: (data) => data.permission.symbolic,
    header: "Mode",
    meta: {
      cellClass: "whitespace-nowrap p-2",
    },
  },
];

export default function FilesTab({ id }: { id: string }) {
  const container = getContainerById(id)!;

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
        <DataTable
          columns={columns}
          data={grouped}
          getSubRows={(data) => data.childs}
          getCoreRowModel={getCoreRowModel()}
          getExpandedRowModel={getExpandedRowModel()}
          meta={{
            getFiles: getFilesRecursive,
          }}
        />
      )}
    </>
  );
}
