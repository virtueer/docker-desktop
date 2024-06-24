import { useGetvolumes } from "@/api/get-volume-all";
import { columns } from "@/table/volume/columns";
import VolumeTable from "@/table/volume/data-table";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/volumes/")({
  component: Page,
});

function Page() {
  const { data } = useGetvolumes();
  return <VolumeTable data={data?.data || []} columns={columns} />;
}
