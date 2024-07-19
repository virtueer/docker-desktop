export interface DockerInfo {
  ID: string;
  Containers: number;
  ContainersRunning: number;
  ContainersPaused: number;
  ContainersStopped: number;
  Images: number;
  Driver: string;
  DriverStatus: string[][];
  Plugins: Plugins;
  MemoryLimit: boolean;
  SwapLimit: boolean;
  KernelMemoryTCP: boolean;
  CpuCfsPeriod: boolean;
  CpuCfsQuota: boolean;
  CPUShares: boolean;
  CPUSet: boolean;
  PidsLimit: boolean;
  IPv4Forwarding: boolean;
  BridgeNfIptables: boolean;
  BridgeNfIp6tables: boolean;
  Debug: boolean;
  NFd: number;
  OomKillDisable: boolean;
  NGoroutines: number;
  SystemTime: string;
  LoggingDriver: string;
  CgroupDriver: string;
  CgroupVersion: string;
  NEventsListener: number;
  KernelVersion: string;
  OperatingSystem: string;
  OSVersion: string;
  OSType: string;
  Architecture: string;
  IndexServerAddress: string;
  RegistryConfig: RegistryConfig;
  NCPU: number;
  MemTotal: number;
  GenericResources: any;
  DockerRootDir: string;
  HttpProxy: string;
  HttpsProxy: string;
  NoProxy: string;
  Name: string;
  Labels: string[];
  ExperimentalBuild: boolean;
  ServerVersion: string;
  Runtimes: Runtimes;
  DefaultRuntime: string;
  Swarm: Swarm;
  LiveRestoreEnabled: boolean;
  Isolation: string;
  InitBinary: string;
  ContainerdCommit: ContainerdCommit;
  RuncCommit: RuncCommit;
  InitCommit: InitCommit;
  SecurityOptions: string[];
  CDISpecDirs: any[];
  Containerd: Containerd;
  Warnings: string[];
}

export interface Plugins {
  Volume: string[];
  Network: string[];
  Authorization: any;
  Log: string[];
}

export interface RegistryConfig {
  AllowNondistributableArtifactsCIDRs: any;
  AllowNondistributableArtifactsHostnames: any;
  InsecureRegistryCIDRs: string[];
  IndexConfigs: IndexConfigs;
  Mirrors: any;
}

export interface IndexConfigs {
  "docker.io": DockerIo;
  "hubproxy.docker.internal:5555": HubproxyDockerInternal5555;
}

export interface DockerIo {
  Name: string;
  Mirrors: any[];
  Secure: boolean;
  Official: boolean;
}

export interface HubproxyDockerInternal5555 {
  Name: string;
  Mirrors: any[];
  Secure: boolean;
  Official: boolean;
}

export interface Runtimes {
  "io.containerd.runc.v2": IoContainerdRuncV2;
  runc: Runc;
}

export interface IoContainerdRuncV2 {
  path: string;
  status: Status;
}

export interface Status {
  "org.opencontainers.runtime-spec.features": string;
}

export interface Runc {
  path: string;
  status: Status2;
}

export interface Status2 {
  "org.opencontainers.runtime-spec.features": string;
}

export interface Swarm {
  NodeID: string;
  NodeAddr: string;
  LocalNodeState: string;
  ControlAvailable: boolean;
  Error: string;
  RemoteManagers: RemoteManager[];
  Nodes: number;
  Managers: number;
  Cluster: Cluster;
}

export interface RemoteManager {
  NodeID: string;
  Addr: string;
}

export interface Cluster {
  ID: string;
  Version: Version;
  CreatedAt: string;
  UpdatedAt: string;
  Spec: Spec;
  TLSInfo: Tlsinfo;
  RootRotationInProgress: boolean;
  DefaultAddrPool: string[];
  SubnetSize: number;
  DataPathPort: number;
}

export interface Version {
  Index: number;
}

export interface Spec {
  Name: string;
  Labels: Labels;
  Orchestration: Orchestration;
  Raft: Raft;
  Dispatcher: Dispatcher;
  CAConfig: Caconfig;
  TaskDefaults: TaskDefaults;
  EncryptionConfig: EncryptionConfig;
}

export interface Labels {}

export interface Orchestration {
  TaskHistoryRetentionLimit: number;
}

export interface Raft {
  SnapshotInterval: number;
  KeepOldSnapshots: number;
  LogEntriesForSlowFollowers: number;
  ElectionTick: number;
  HeartbeatTick: number;
}

export interface Dispatcher {
  HeartbeatPeriod: number;
}

export interface Caconfig {
  NodeCertExpiry: number;
}

export interface TaskDefaults {}

export interface EncryptionConfig {
  AutoLockManagers: boolean;
}

export interface Tlsinfo {
  TrustRoot: string;
  CertIssuerSubject: string;
  CertIssuerPublicKey: string;
}

export interface ContainerdCommit {
  ID: string;
  Expected: string;
}

export interface RuncCommit {
  ID: string;
  Expected: string;
}

export interface InitCommit {
  ID: string;
  Expected: string;
}

export interface Containerd {
  Address: string;
  Namespaces: Namespaces;
}

export interface Namespaces {
  Containers: string;
  Plugins: string;
}
