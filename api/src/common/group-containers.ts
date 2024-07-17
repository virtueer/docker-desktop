import { ContainerInfo, Compose, GrouppedContainer } from '~types/container';

export function groupContainers(containers: ContainerInfo[]) {
  const composes = containers.reduce((data: Compose[], current) => {
    const name = current.Labels['com.docker.compose.project'];

    if (!name) {
      return data;
    }

    const compose = data.find((x) => x.name === name);

    if (!compose) {
      data.push({ name: name, containers: [current] });
    } else {
      compose.containers.push(current);
    }

    return data;
  }, []);

  return [
    ...containers.filter((x) => !x.Labels['com.docker.compose.project']),
    ...composes,
  ] as GrouppedContainer[];
}
