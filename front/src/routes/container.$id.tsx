import RemoveContainerDialog from "@/components/container/remove-container-dialog";
import { Button } from "@/components/ui/button";
import { TabsEnum } from "@/constants";
import { cn } from "@/lib/utils";
import { getContainerById } from "@/store";
import {
  getColorByState,
  getContainerName,
  getImageId,
} from "@/components/table/helper";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FaPlay, FaStop } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";
import { GoContainer } from "react-icons/go";
import { MdRestartAlt, MdTerminal } from "react-icons/md";
import ExecTab from "./container/$id/_exec";
import FilesTab from "./container/$id/_files";
import InspectTab from "./container/$id/_inspect";
import LogsTab from "./container/$id/_logs";
import CopyableId from "@/components/copyable-id";
import StatsTab from "./container/$id/_stats";

function TabHead({
  text,
  active,
  onClick,
}: {
  text: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={cn(
        "capitalize border-b-4 border-b-transparent px-3 pb-1 cursor-pointer hover:border-b-slate-700",
        active && "!border-b-blue-500"
      )}
      onClick={onClick}
    >
      {text}
    </div>
  );
}

export const Route = createFileRoute("/container/$id")({
  component: Page,
});

function Page() {
  const id = useParams({ from: Route.id, select: (x) => x.id });
  const searchTab = Route.useSearch({ select: (x) => (x as any).tab });
  const [tab, setTab] = useState<string>(TabsEnum.LOGS);

  useEffect(() => {
    if (
      Object.keys(TabsEnum)
        .map((x) => x.toLowerCase())
        .includes(searchTab)
    ) {
      setTab(searchTab);
    }
  }, [searchTab]);

  const container = getContainerById(id);

  if (!container) {
    return "NOT FOUND";
  }

  const color = getColorByState(container.State);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b mb-3">
        <div className="flex items-center gap-5">
          <Link to="/container">
            <Button
              variant="ghost"
              className="rounded-full p-3 text-night-200 hover:text-blue-500"
            >
              <FaChevronLeft />
            </Button>
          </Link>
          <GoContainer size="1.5rem" color={color} />
          <div className="flex flex-col">
            <span className="font-semibold text-xl">
              {getContainerName(container.Names)}
            </span>
            <Link
              to="/images/$id"
              params={{ id: getImageId(container.ImageID) }}
              className="text-blue-500 underline underline-offset-2 font-bold drag-none text-sm"
            >
              {container.Image}
            </Link>
            <CopyableId id={container.Id} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col font-semibold">
            <span className="text-sm">STATUS</span>
            <span className="text-xs text-slate-400">{container.Status}</span>
          </div>
          <Button
            className="w-[50px] p-3 bg-blue-600 text-white hover:bg-blue-500"
            onClick={() => setTab(TabsEnum.EXEC)}
          >
            <MdTerminal size="1.3rem" />
          </Button>

          <div className="flex">
            <Button className="w-[50px] bg-blue-600 text-white hover:bg-blue-500 rounded-none rounded-l-md">
              <FaStop />
            </Button>
            <Button
              className="w-[50px] bg-blue-600 text-white hover:bg-blue-500 rounded-none border-x-2 border-blue-300"
              disabled={container.State === "running"}
            >
              <FaPlay />
            </Button>
            <Button className="w-[50px] bg-blue-600 text-white hover:bg-blue-500 rounded-none rounded-r-md">
              <MdRestartAlt size="1.3rem" />
            </Button>
          </div>

          <RemoveContainerDialog container={container} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-4 items-center text-sm">
          <TabHead
            text={TabsEnum.LOGS}
            active={tab === TabsEnum.LOGS}
            onClick={() => setTab(TabsEnum.LOGS)}
          />
          <TabHead
            text={TabsEnum.INSPECT}
            active={tab === TabsEnum.INSPECT}
            onClick={() => setTab(TabsEnum.INSPECT)}
          />
          <TabHead
            text={TabsEnum.EXEC}
            active={tab === TabsEnum.EXEC}
            onClick={() => setTab(TabsEnum.EXEC)}
          />
          <TabHead
            text={TabsEnum.FILES}
            active={tab === TabsEnum.FILES}
            onClick={() => setTab(TabsEnum.FILES)}
          />
          <TabHead
            text={TabsEnum.STATS}
            active={tab === TabsEnum.STATS}
            onClick={() => setTab(TabsEnum.STATS)}
          />
        </div>
        <div className="content h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] overflow-auto scrollbar">
          {tab === TabsEnum.LOGS && <LogsTab id={id} />}
          {tab === TabsEnum.INSPECT && <InspectTab id={id} />}
          {tab === TabsEnum.EXEC && <ExecTab id={id} />}
          {tab === TabsEnum.FILES && <FilesTab id={id} />}
          {tab === TabsEnum.STATS && <StatsTab id={id} />}
        </div>
      </div>
    </div>
  );
}
