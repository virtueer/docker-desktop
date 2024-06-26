import { useGetCompose } from "@/api/get-compose";
import ComposeTerminal from "@/components/compose-terminal";
import { Delete } from "@/components/container/delete";
import PlayStop from "@/components/container/play-stop";
import ThreeDot from "@/components/container/three-dot";
import { Separator } from "@/components/ui/separator";
import { getContainerColor } from "@/table/container/helper";
import { Link, createFileRoute } from "@tanstack/react-router";
import { GoContainer } from "react-icons/go";
import { DockerPs } from "~types/ps";

export const Route = createFileRoute("/compose/$name")({
  component: Page,
});

function Container({ container }: { container: DockerPs }) {
  const color = getContainerColor(container);
  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-center">
        <GoContainer size="1.5rem" color={color} />
        <div className="flex flex-col mx-5">
          <span className="whitespace-nowrap font-bold">{container.Names}</span>
          <Link
            to="/images/$id"
            params={{ id: container.Image }}
            className="underline underline-offset-2 text-blue-500"
          >
            {container.Image}
          </Link>
          <span className="capitalize">{container.State}</span>
        </div>
        <PlayStop container={container} />
        <ThreeDot />
        <Separator
          orientation="vertical"
          className="h-[50%] bg-night-300 mx-2"
        />
        <Delete container={container} />
      </div>
      <Separator className="my-2 bg-night-300" />
    </div>
  );
}

function Page() {
  const { name } = Route.useParams();
  const { data, isLoading } = useGetCompose(name);

  if (isLoading) return "loading";

  if (!data?.status) return data?.error;

  return (
    <div className="flex gap-3 w-full h-full overflow-hidden">
      <div className="flex flex-col w-[30%] overflow-auto scrollbar">
        {data.data.map((container) => (
          <Container container={container} key={container.ID} />
        ))}
      </div>
      <div className="w-full border">
        <ComposeTerminal name={name} />
      </div>
    </div>
  );
}
