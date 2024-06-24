import { useGetDockerAllPs } from "@/api/get-docker-all-ps";
import InfiniteLoading from "@/components/infinite-loading";
import PsWatcher from "@/providers/ps-watcher";
import { columns } from "@/table/columns";
import { DataTable } from "@/table/data-table";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { DockerPs } from "~types/ps";
export const Route = createFileRoute("/ps/")({
  component: Page,
});

function Page() {
  const { data, isLoading, error } = useGetDockerAllPs();

  const grouped = useMemo(() => {
    if (!data?.status) return undefined;

    const composes = data.data.reduce(
      (data: { name: string; containers: DockerPs[] }[], current) => {
        const name = current.Labels["com.docker.compose.project"];

        if (!name) {
          return data;
        }

        const compose = data.find((x) => x.name === name);

        if (!compose) {
          data.push({ name: name, containers: [current] });
        } else {
          compose.containers.push(current);
        }

        return data;
      },
      []
    );

    return [
      ...data.data.filter((x) => !x.Labels["com.docker.compose.project"]),
      ...composes,
    ];
  }, [data?.data]);

  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center h-screen">
          <InfiniteLoading width="500px" />
        </div>
      )}
      {error}
      {grouped && (
        <>
          <DataTable columns={columns} data={grouped} />
          <PsWatcher />
        </>
      )}
    </>
  );
}
