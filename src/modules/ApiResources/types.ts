import { ClassName } from '../../lib/ClassName';

export interface ApiResourceOptions {
  path?: string;
}

export interface ApiResourceMetaData {
  resource: ClassName;
  path: string;
}
