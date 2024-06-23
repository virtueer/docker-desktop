import { QueryClient } from "@tanstack/react-query";
import {
  DockerPs,
  GetDockerAllPsResponse,
  GetDockerAllPsResponseSuccess,
} from "~types/ps";

export function toPascalCase(text: string) {
  return `${text}`
    .toLowerCase()
    .replace(new RegExp(/[-_]+/, "g"), " ")
    .replace(new RegExp(/[^\w\s]/, "g"), "")
    .replace(
      new RegExp(/\s+(.)(\w*)/, "g"),
      (_, $2, $3) => `${$2.toUpperCase() + $3}`
    )
    .replace(new RegExp(/\w/), (s) => s.toUpperCase());
}

// Referance -> https://github.com/TanStack/query/blob/main/packages/query-devtools/src/utils.tsx#L175
export const updateNestedDataByPath = (
  oldData: unknown,
  updatePath: Array<string>,
  value: unknown
): any => {
  if (updatePath.length === 0) {
    return value;
  }

  if (oldData instanceof Map) {
    const newData = new Map(oldData);

    if (updatePath.length === 1) {
      newData.set(updatePath[0], value);
      return newData;
    }

    const [head, ...tail] = updatePath;
    newData.set(head, updateNestedDataByPath(newData.get(head), tail, value));
    return newData;
  }

  if (oldData instanceof Set) {
    const setAsArray = updateNestedDataByPath(
      Array.from(oldData),
      updatePath,
      value
    );

    return new Set(setAsArray);
  }

  if (Array.isArray(oldData)) {
    const newData = [...oldData];

    if (updatePath.length === 1) {
      // @ts-expect-error
      newData[updatePath[0]] = value;
      return newData;
    }

    const [head, ...tail] = updatePath;
    // @ts-expect-error
    newData[head] = updateNestedDataByPath(newData[head], tail, value);

    return newData;
  }

  if (oldData instanceof Object) {
    const newData = { ...oldData };

    if (updatePath.length === 1) {
      // @ts-expect-error
      newData[updatePath[0]] = value;
      return newData;
    }

    const [head, ...tail] = updatePath;
    // @ts-expect-error
    newData[head] = updateNestedDataByPath(newData[head], tail, value);

    return newData;
  }

  return oldData;
};

export const updateContainerById = (
  queryClient: QueryClient,
  id: string,
  update: Partial<DockerPs>
) => {
  queryClient.setQueryData(
    ["containers"],
    (oldData: GetDockerAllPsResponseSuccess) => {
      const index = oldData.data.findIndex((x) => x.ID === id);

      const container = oldData.data[index];

      const newData = updateNestedDataByPath(oldData, ["data", index + ""], {
        ...container,
        ...update,
      });

      return newData;
    }
  );
};

export const getContainerById = (queryClient: QueryClient, id: string) => {
  const data = queryClient.getQueryData([
    "containers",
  ]) as GetDockerAllPsResponse;

  if (!data.status) {
    return undefined;
  }

  return data.data.find((x) => x.ID === id);
};
