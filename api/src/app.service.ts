import { Injectable } from '@nestjs/common';
import { exec } from './common/cp';
import { parseLabels, text2json } from './common/parse';
import { DockerPs, GetDockerPsResponse } from '~types/ps';

@Injectable()
export class AppService {
  async getPs(): Promise<GetDockerPsResponse> {
    const command = `docker ps -a --format '{{ json . }}'`;
    const { stderr, stdout } = await exec(command, { shell: 'bash' });
    console.log('stderr', stderr);

    if (stderr) {
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
}
