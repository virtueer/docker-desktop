import { useGetImages } from "@/api/get-images";
import { createFileRoute } from "@tanstack/react-router";
import ImageTable from "./_table";
import { useState } from "react";

export const Route = createFileRoute("/images/")({
  component: Page,
});

function Page() {
  const { data } = useGetImages();
  const [rowSelection, setRowSelection] = useState({});

  return (
    <ImageTable
      data={data?.data || []}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
    />
  );
}
