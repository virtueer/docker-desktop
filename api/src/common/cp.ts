import * as cp from 'child_process';
import * as util from 'util';

export const execPromise = util.promisify(cp.exec);

export const exec = (command: string) => {
  console.log('Command ->', command);
  return execPromise(command, { shell: 'bash' }).catch((e) => e);
};
