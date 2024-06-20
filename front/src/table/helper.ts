import { Compose, DockerPs } from "~types/ps";
import { toPascalCase } from "@/util";

export const getStatus = (row: Compose | DockerPs) => {
  const is_compose = !!(row as any).name;

  if (is_compose) {
    const data = row as Compose;

    const running = data.containers.filter((x) => x.State === "running").length;

    if (running < 1) {
      const state = toPascalCase(
        data.containers.find((x) => x.State !== "exited")?.State || "Exited"
      );

      if (state !== "Exited") {
        const not_exited_length = data.containers.filter(
          (x) => x.State !== "exited"
        ).length;

        return `${state} (${not_exited_length}/${data.containers.length})`;
      }

      return state;
    }

    return `Running (${running}/${data.containers.length})`;
  }

  return (row as DockerPs).Status;
};
