import { ClassName } from '@api-typed/common';

export type Operation = 'list' | 'create' | 'read' | 'update' | 'delete';

export interface OperationMetaData {
  enabled: boolean;
}

export interface ApiResourceOptions {
  path?: string;
  operations?: Operation[];
  perPage?: number;
  sortDefault?: Record<string, 'ASC' | 'DESC'>;
}

export interface ApiResourceMetaData {
  resource: ClassName;
  path: string;
  operations: Record<Operation, OperationMetaData>;
  perPage: number;
  sortDefault?: Record<string, 'ASC' | 'DESC'>;
}
