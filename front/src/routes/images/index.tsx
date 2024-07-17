import { useGetImages } from "@/api/get-images";
import { createFileRoute } from "@tanstack/react-router";
import ImageTable from "./_table";
import { useState } from "react";
import InfiniteLoading from "@/components/infinite-loading/infinite-loading";

export const Route = createFileRoute("/images/")({
  component: Page,
});

function Page() {
  const { data, isLoading } = useGetImages();
  const [rowSelection, setRowSelection] = useState({});

  if (isLoading) return <InfiniteLoading width="100px" />;

  return (
    <ImageTable
      data={data || []}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
    />
  );
}
