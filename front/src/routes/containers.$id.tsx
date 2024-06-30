import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createFileRoute,
  Outlet,
  useRouterState,
  useNavigate,
  useParams,
} from "@tanstack/react-router";

export const Route = createFileRoute("/containers/$id")({
  component: Page,
});

function Page() {
  const router = useRouterState();
  const navigate = useNavigate();
  const id = useParams({ from: Route.id, select: (x) => x.id });

  const [tab] = router.location.pathname.split("/").slice(-1);

  function handleSwitchTab(current: string) {
    navigate({ to: `/containers/$id/${current}`, params: { id } });
  }

  return (
    <Tabs defaultValue={tab}>
      <TabsList>
        <TabsTrigger value="logs" onClick={() => handleSwitchTab("logs")}>
          Logs
        </TabsTrigger>
        <TabsTrigger value="inspect" onClick={() => handleSwitchTab("inspect")}>
          Inspect
        </TabsTrigger>
        <TabsTrigger value="exec" onClick={() => handleSwitchTab("exec")}>
          Exec
        </TabsTrigger>
        <TabsTrigger value="files" onClick={() => handleSwitchTab("files")}>
          Files
        </TabsTrigger>
      </TabsList>
      <Outlet />
    </Tabs>
  );
}
