import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createFileRoute,
  Outlet,
  useRouterState,
  useNavigate,
  useParams,
  redirect,
} from "@tanstack/react-router";

export const Route = createFileRoute("/containers/$id")({
  beforeLoad({ location: { pathname }, params: { id } }) {
    const [tab] = pathname.split("/").slice(-1);

    if (!Object.values(TabsEnum).includes(tab as TabsEnum)) {
      console.log("redirect", tab);
      throw redirect({ to: "/containers/$id/logs", params: { id } });
    }
  },
  component: Page,
});

enum TabsEnum {
  LOGS = "logs",
  INSPECT = "inspect",
  EXEC = "exec",
  FILES = "files",
}

function Page() {
  const routerState = useRouterState();
  const navigate = useNavigate();
  const id = useParams({ from: Route.id, select: (x) => x.id });

  const [tab] = routerState.location.pathname.split("/").slice(-1);

  function handleSwitchTab(current: TabsEnum) {
    navigate({ to: `/containers/$id/${current}`, params: { id } });
  }

  return (
    <Tabs defaultValue={tab}>
      <TabsList>
        <TabsTrigger
          value={TabsEnum.LOGS}
          onClick={() => handleSwitchTab(TabsEnum.LOGS)}
        >
          Logs
        </TabsTrigger>
        <TabsTrigger
          value={TabsEnum.INSPECT}
          onClick={() => handleSwitchTab(TabsEnum.INSPECT)}
        >
          Inspect
        </TabsTrigger>
        <TabsTrigger
          value={TabsEnum.EXEC}
          onClick={() => handleSwitchTab(TabsEnum.EXEC)}
        >
          Exec
        </TabsTrigger>
        <TabsTrigger
          value={TabsEnum.FILES}
          onClick={() => handleSwitchTab(TabsEnum.FILES)}
        >
          Files
        </TabsTrigger>
      </TabsList>
      <div className="border h-[calc(100vh-80px)] overflow-auto">
        <Outlet key={tab} />
      </div>
    </Tabs>
  );
}
