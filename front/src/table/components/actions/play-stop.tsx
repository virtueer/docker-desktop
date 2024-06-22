import { Button } from "@/components/ui/button";
import { FaPlay, FaStop } from "react-icons/fa";
import { DockerPs, GetDockerAllPsResponseSuccess } from "~types/ps";

import { useStopDockerPs } from "@/api/stop-docker-ps";
import { updateNestedDataByPath } from "@/util";
import { useQueryClient } from "@tanstack/react-query";
import { LOADING_STATE } from "@/constants";

export default function PlayStop({
  isCompose,
  dockerPs,
  running,
}: {
  running: boolean;
  isCompose: boolean;
  dockerPs?: DockerPs;
}) {
  const queryClient = useQueryClient();
  const { mutate: stopContainerMutate } = useStopDockerPs(dockerPs!.ID);

  function makeContainerStateLoading() {
    queryClient.setQueryData(
      ["containers"],
      (oldData: GetDockerAllPsResponseSuccess) => {
        const index = oldData.data.findIndex((x) => x.ID === dockerPs!.ID);

        const container = oldData.data[index];

        const newData = updateNestedDataByPath(oldData, ["data", index + ""], {
          ...container,
          State: container.State + LOADING_STATE,
        });

        return newData;
      }
    );
  }

  function handleStop() {
    if (!isCompose) {
      stopContainerMutate();
    }
  }

  function handlePlay() {
    if (!isCompose) {
      makeContainerStateLoading();
    }
  }

  function handleClick() {
    running ? handleStop() : handlePlay();
  }

  return (
    <Button
      variant="ghost"
      className="p-2 rounded-full h-auto hover:bg-slate-300"
      onClick={handleClick}
    >
      {running && <FaStop />}
      {!running && <FaPlay />}
    </Button>
  );
}
