import { Compose, DockerPs } from "~types/ps";
import { toPascalCase } from "@/util";
import { EXITED_COLOR, PAUSED_COLOR, RUNNING_COLOR } from "@/constants";

export const getStatus = (row: Compose | DockerPs) => {
  const isCompose = !!(row as any).name;

  if (isCompose) {
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

export const getContainerColor = (constainer: DockerPs) => {
  switch (constainer.State) {
    case "paused":
      return PAUSED_COLOR;
      break;

    case "exited":
      return EXITED_COLOR;
      break;

    case "running":
      return RUNNING_COLOR;
      break;
  }
};
