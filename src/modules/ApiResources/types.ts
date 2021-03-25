import { ClassName } from '../../lib/ClassName';

export type Operation = 'list' | 'create' | 'read' | 'update' | 'delete';

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
