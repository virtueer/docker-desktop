import { FailResponse } from "./base";

export type ExtendedFile = File & {
  childs?: ExtendedFile[];
  isLoading?: boolean;
};

export type GetFilesResponse = GetFilesResponseSuccess | FailResponse;

export interface GetFilesResponseSuccess {
  status: true;
  data: File[];
}

export interface File {
  name: string;
  size: number;
  blocks: number;
  ioBlocks: number;
  type: string;
  device: string;
  inode: number;
  links: number;
  permission: Permission;
  uid: string;
  gid: string;
  access: number;
  modify: number;
  change: number;
  path: string;
  dir: string;
}

export interface Permission {
  fileType: string;
  symbolic: string;
  octal: string;
  owner: Owner;
  group: Group;
  other: Other;
  suid: boolean;
  guid: boolean;
  sticky_bit: boolean;
}

export interface Owner {
  read: boolean;
  write: boolean;
  execute: boolean;
}

export interface Group {
  read: boolean;
  write: boolean;
  execute: boolean;
}

export interface Other {
  read: boolean;
  write: boolean;
  execute: boolean;
}
