import { useGetImage } from "@/api/get-image";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/images/$id/")({
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const [command, setCommand] = useState("");

  const { data, isLoading } = useGetImage(id);

  if (isLoading) return "Loading...";

  if (!data?.status) return data?.error;

  return (
    <div className="flex flex-col">
      <span className="text-xl font-bold mb-3">
        Layers ({data.data.length})
      </span>
      <div className="flex gap-2 bg-night-500">
        <div className="flex-col w-full">
          {data.data.map((layer, index) => (
            <div
              key={index}
              className="border border-b-0 border-x-0 border-slate-500 p-2 hover:bg-slate-700 cursor-pointer focus:bg-night-400"
              tabIndex={0}
              onClick={() => setCommand(layer.CreatedBy)}
            >
              {layer.CreatedBy.slice(0, 66)}
              {layer.CreatedBy.length > 66 && "..."}
            </div>
          ))}
        </div>
        <code className="border border-white w-full p-3 h-fit">{command}</code>
      </div>
    </div>
  );
}
