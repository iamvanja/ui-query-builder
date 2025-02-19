export enum Step {
  column = "column",
  comparator = "comparator",
  value = "value",
}

export enum InputType {
  string = "string",
  number = "number",
  enum = "enum",
  boolean = "boolean",
  date = "date",
}

export type QueryPart = {
  column: string;
  comparator: string;
  value: string;
};

export type Column = {
  name: string;
  inputType?: InputType;
  options?: string[];
};

export type ClassNames = {
  root?: string;
  debug?: string;
  topBar?: string;
  helperText?: string;
  removeAllButton?: string;
};

export type PublicAPI = {
  input: {
    blur(): void;
    focus(): void;
  };
};
