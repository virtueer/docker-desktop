import { EXITED_COLOR, PAUSED_COLOR, RUNNING_COLOR } from "@/constants";
import { toPascalCase } from "@/util";
import { Compose, DockerPs } from "~types/ps";
import { Compose as Composev2 } from "~types/v2/container/list";

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

export const getColorByState = (State: string) => {
  switch (State) {
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

export const getComposeStatus = (compose: Composev2) => {
  const running = compose.containers.filter(
    (x) => x.State === "running"
  ).length;

  if (running < 1) {
    const state = toPascalCase(
      compose.containers.find((x) => x.State !== "exited")?.State || "Exited"
    );

    if (state !== "Exited") {
      const not_exited_length = compose.containers.filter(
        (x) => x.State !== "exited"
      ).length;

      return `${state} (${not_exited_length}/${compose.containers.length})`;
    }

    return state;
  }

  return `Running (${running}/${compose.containers.length})`;
};
