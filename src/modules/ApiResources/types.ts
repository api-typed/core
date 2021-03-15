import { ClassName } from '../../lib/ClassName';

export enum Operation {
  List = 'list',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export interface OperationMetaData {
  enabled: boolean;
}

export interface ApiResourceOptions {
  path?: string;
  operations?: Operation[];
}

export interface ApiResourceMetaData {
  resource: ClassName;
  path: string;
  operations: Record<Operation, OperationMetaData>;
}
