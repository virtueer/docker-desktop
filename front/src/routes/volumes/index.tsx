import { useGetvolumes } from "@/api/get-volume-all";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import VolumeTable from "./_table";

export const Route = createFileRoute("/volumes/")({
  component: Page,
});

function Page() {
  const { data } = useGetvolumes();
  const [rowSelection, setRowSelection] = useState({});

  return (
    <VolumeTable
      data={data?.data || []}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
    />
  );
}
