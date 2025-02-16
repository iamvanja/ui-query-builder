enum Step {
  column = "column",
  comparator = "comparator",
  value = "value",
}

enum InputType {
  string = "string",
  number = "number",
  enum = "enum",
  boolean = "boolean",
  date = "date",
}

type QueryPart = {
  column: string;
  comparator: string;
  value: string;
};

type Column = {
  name: string;
  inputType?: InputType;
  options?: string[];
};

export { Step, InputType };
export type { QueryPart, Column };
