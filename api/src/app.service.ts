import { Injectable } from '@nestjs/common';
import { execPromise } from './common/cp';
import { parseLabels, text2json } from './common/parse';
import { DockerPs, GetDockerPsResponse } from '~types/ps';

const exec = (command: string) => {
  console.log('Command ->', command);
  return execPromise(command, { shell: 'bash' });
};

@Injectable()
export class AppService {
  async getPs(): Promise<GetDockerPsResponse> {
    const command = `docker ps -a --no-trunc --format '{{ json . }}'`;
    const { stderr, stdout } = await exec(command).catch((e) => e);

    if (stderr) {
      console.log('stderr', stderr);
      return { status: false, error: stderr };
    }

    const ps = text2json(stdout).map(parseLabels) as any as DockerPs[];

    const composes = ps.reduce(
      (data: { name: string; containers: DockerPs[] }[], current) => {
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
      },
      [],
    );

    return {
      status: true,
      data: [
        ...ps.filter((x) => !x.Labels['com.docker.compose.project']),
        ...composes,
      ],
    };
  }

  async stopPs(id: string) {
    const command = `docker stop ${id}`;
    const { stderr } = await exec(command).catch((e) => e);

    if (stderr) {
      console.log('stderr', stderr);
      return { status: false, error: stderr };
    }

    return { status: true };
  }
}
