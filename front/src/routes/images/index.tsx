import { useGetImages } from "@/api/get-images";
import { columns } from "@/table/image/columns";
import ImageTable from "@/table/image/data-table";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/images/")({
  component: Page,
});

function Page() {
  const { data } = useGetImages();
  return <ImageTable data={data?.data || []} columns={columns} />;
}
