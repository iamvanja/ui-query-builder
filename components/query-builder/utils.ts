import { Step, InputType, Column } from "./types";

const defaultComparators = ["equals", "contains", "begins with", "ends with"];
const stringComparators = ["equals", "contains", "begins with", "ends with"];
const numberComparators = ["equals", "greater than", "less than", "between"];
const enumComparators = ["is", "is not"];
const boolComparators = enumComparators;
const dateComparators = ["on", "before", "after"];
const getComparatorsPerInputType = (
  inputType: InputType = InputType.string
) => {
  switch (inputType) {
    case InputType.string:
      return stringComparators;
    case InputType.number:
      return numberComparators;
    case InputType.enum:
      return enumComparators;
    case InputType.boolean:
      return boolComparators;
    case InputType.date:
      return dateComparators;
    default:
      return defaultComparators;
  }
};

const getValueInputType = (inputType: InputType = InputType.string): string => {
  switch (inputType) {
    case InputType.number:
      return "number";
    case InputType.date:
      return "date";
    default:
      return "text";
  }
};

const boolFields = ["true", "false"];
const getValueFields = (column: Column | null) => {
  let customFields: string[] = [];

  if (column?.inputType === InputType.boolean) {
    customFields = boolFields;
  }

  return column?.options ?? customFields ?? [];
};

const getPropsPerStep = (
  step: Step,
  columns: Column[],
  currentColumn: Column | null
) => {
  switch (step) {
    case Step.column:
      return {
        placeholder: "Select a column name...",
        fields: columns.map((column) => column.name),
      };
    case Step.comparator:
      return {
        placeholder: "Select a comparator...",
        fields: getComparatorsPerInputType(currentColumn?.inputType),
      };
    case Step.value:
    // intentional fallthrough
    default:
      const fields = getValueFields(currentColumn);
      return {
        placeholder: "Enter a value and press Enter...",
        fields,
        allowNoMatchSelection: !fields.length,
        type: getValueInputType(currentColumn?.inputType),
      };
  }
};

export { getPropsPerStep };
