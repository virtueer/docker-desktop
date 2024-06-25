import { Injectable } from '@nestjs/common';
import * as pty from 'node-pty';
import {
  DockerPs,
  GetDockerAllPsResponse,
  GetDockerPsResponse,
} from '~types/ps';
import { exec } from './common/cp';
import { parseLabels, text2json } from './common/parse';

@Injectable()
export class AppService {
  async getAllPs(): Promise<GetDockerAllPsResponse> {
    const command = `docker ps -a --no-trunc --format '{{ json . }}'`;
    const { stderr, stdout } = await exec(command);

    if (stderr) {
      console.log('stderr', stderr, '---');
      return { status: false, error: stderr };
    }

    const ps = text2json(stdout).map(parseLabels) as any as DockerPs[];

    return {
      status: true,
      data: ps,
    };
  }

  async getPs(id: string): Promise<GetDockerPsResponse> {
    const command = `docker ps -a --no-trunc --format '{{ json . }}' -f "ID=${id}"`;
    const { stderr, stdout } = await exec(command);

    if (stderr) {
      console.log('stderr', stderr);
      return { status: false, error: stderr };
    }
    const ps = text2json(stdout).map(parseLabels) as any as DockerPs[];

    return { status: true, data: ps[0] };
  }

  async stopPs(id: string) {
    const command = `docker stop ${id}`;
    const { stderr } = await exec(command);

    if (stderr) {
      console.log('stderr', stderr);
      return { status: false, error: stderr };
    }

    return { status: true };
  }

  async pausePs(id: string) {
    const command = `docker pause ${id}`;
    const { stderr } = await exec(command);

    if (stderr) {
      console.log('stderr', stderr);
      return { status: false, error: stderr };
    }

    return { status: true };
  }

  async unPausePs(id: string) {
    const command = `docker unpause ${id}`;
    const { stderr } = await exec(command);

    if (stderr) {
      console.log('stderr', stderr);
      return { status: false, error: stderr };
    }

    return { status: true };
  }

  async startPs(id: string) {
    const command = `docker start ${id}`;
    const { stderr } = await exec(command);

    if (stderr) {
      console.log('stderr', stderr);
      return { status: false, error: stderr };
    }

    return { status: true };
  }

  async images() {
    const command = `docker image ls --no-trunc --digests --format json`;
    const { stderr, stdout } = await exec(command);

    if (stderr) {
      console.log('stderr', stderr);
      return { status: false, error: stderr };
    }

    return { status: true, data: text2json(stdout) };
  }

  async image(id: string) {
    const command = `docker image history ${id} --no-trunc --format json`;
    const { stderr, stdout } = await exec(command);

    if (stderr) {
      console.log('stderr', stderr);
      return { status: false, error: stderr };
    }

    return { status: true, data: text2json(stdout).reverse() };
  }

  async getImageByImageName(name: string) {
    const command = `docker images --no-trunc --filter=reference='${name}' --format json`;
    const { stderr, stdout } = await exec(command);

    if (stderr) {
      console.log('stderr', stderr);
      return { status: false, error: stderr };
    }

    if (!stdout) {
      return { status: false, error: 'Not found' };
    }

    return { status: true, data: text2json(stdout)[0] };
  }

  async volumes() {
    const command = `docker volume ls --format json`;
    const { stderr, stdout } = await exec(command);

    if (stderr) {
      console.log('stderr', stderr);
      return { status: false, error: stderr };
    }

    return { status: true, data: text2json(stdout) };
  }

  async deleteContainer(id: string) {
    const command = `docker container rm ${id} -f`;
    const { stderr, stdout } = await exec(command);

    if (stderr) {
      console.log('stderr', stderr);
      return { status: false, error: stderr };
    }

    return { status: true, data: stdout };
  }

  async compose(name: string) {
    const command = `docker ps -a --no-trunc --format '{{ json . }}'`;
    const { stderr, stdout } = await exec(command);

    if (stderr) {
      console.log('stderr', stderr, '---');
      return { status: false, error: stderr };
    }

    const ps = text2json(stdout).map(parseLabels) as any as DockerPs[];

    const composes = ps.filter(
      (x) => x.Labels['com.docker.compose.project'] === name,
    );

    return {
      status: true,
      data: composes,
    };
  }

  async getContainerLogs(id: string) {
    const command = `docker logs ${id}`;
    const { stderr, stdout } = await exec(command);

    if (stderr) {
      console.log('stderr', stderr, '---');
      return { status: false, error: stderr };
    }

    return {
      status: true,
      data: stdout,
    };
  }

  async getComposeLogs(name: string, cols?: number, rows?: number) {
    const composes = await this.compose(name);

    if (composes.data.length === 0) {
      return { status: false, error: 'Not found' };
    }

    console.log(cols, rows);
    const terminal = pty.spawn('docker', ['compose', 'logs', '-t'], {
      name: 'logs',
      cwd: composes.data[0].Labels['com.docker.compose.project.working_dir'],
      cols,
      rows,
    });

    console.log('Command ->', 'docker compose logs');
    const data = await new Promise((resolve) => {
      let total = '';
      terminal.onExit(() => resolve(total));
      terminal.onData((data) => (total += data));
    });

    return {
      status: true,
      data,
    };
  }
}
