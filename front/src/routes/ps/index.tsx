import { useGetDockerPs } from "@/api/get-docker-ps";
import { columns } from "@/table/columns";
import { DataTable } from "@/table/data-table";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ps/")({
  component: Page,
});

function Page() {
  const { data, isFetching } = useGetDockerPs();

  return (
    <>
      {isFetching && "Loading..."}
      {data?.status && <DataTable columns={columns} data={data.data} />}
    </>
  );
}
