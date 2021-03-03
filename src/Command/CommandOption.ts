export interface CommandOption {
  short?: string;
  description?: string;
  value?: 'required' | 'optional';
  default?: any;
  defaultDescription?: string;
  choices?: string[];
  variadic?: boolean;
}
