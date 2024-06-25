import { FaPlay, FaStop } from "react-icons/fa";
import { DockerPs } from "~types/ps";
import { Button } from "@/components/ui/button";

export default function PlayStop({ container }: { container: DockerPs }) {
  return (
    <Button
      variant="ghost"
      className="p-2 rounded-full h-auto hover:bg-night-400"
    >
      {container.State === "running" ? <FaStop /> : <FaPlay />}
    </Button>
  );
}
