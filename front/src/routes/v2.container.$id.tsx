import { TabsEnum } from "@/constants";
import { cn } from "@/lib/utils";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState } from "react";
import LogsTab from "./v2/container/$id/_logs";
import InspectTab from "./v2/container/$id/_inspect";
import ExecTab from "./v2/container/$id/_exec";
import FilesTab from "./v2/container/$id/_files";

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
        "border-b-4 border-b-transparent px-3 pb-1 cursor-pointer hover:border-b-slate-700",
        active && "!border-b-blue-500"
      )}
      onClick={onClick}
    >
      {text}
    </div>
  );
}

export const Route = createFileRoute("/v2/container/$id")({
  component: Page,
});

function Page() {
  const id = useParams({ from: Route.id, select: (x) => x.id });
  const [tab, setTab] = useState<string>(TabsEnum.LOGS);
  const [logsLines, setLogsLines] = useState<string[]>([]);

  return (
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
        {/* <TabHead
          text={TabsEnum.BIND_MOUNTS}
          active={tab === TabsEnum.BIND_MOUNTS}
          onClick={() => setTab(TabsEnum.BIND_MOUNTS)}
        /> */}
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
      </div>
      <div className="content border h-[calc(100vh-80px)] max-h-[calc(100vh-80px)]">
        {tab === TabsEnum.LOGS && <LogsTab id={id} />}
        {tab === TabsEnum.INSPECT && <InspectTab id={id} />}
        {tab === TabsEnum.EXEC && <ExecTab id={id} />}
        {tab === TabsEnum.FILES && <FilesTab id={id} />}
      </div>
    </div>
  );
}
