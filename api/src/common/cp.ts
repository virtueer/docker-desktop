import * as cp from 'child_process';
import * as util from 'util';

export const SHELL = 'bash';

export const execPromise = util.promisify(cp.exec);

export const exec = (command: string, cwd?: string) => {
  console.log('Command ->', command);
  return execPromise(command, { shell: SHELL, cwd }).catch((e) => e);
};
