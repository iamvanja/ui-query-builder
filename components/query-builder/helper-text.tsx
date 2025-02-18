import { QueryPart, Step } from "./types";

type ChipProps = {
  step: Step;
  column?: QueryPart["column"];
  comparator?: QueryPart["comparator"];
  isChipFocused?: boolean;
};

const getText = ({ isChipFocused, step, column, comparator }: ChipProps) => {
  if (isChipFocused) {
    return "Use backspace to delete. Enter to edit. Left/Right Arrows or Tab/Shift+Tab to navigate between chips and the new filter input.";
  }

  switch (step) {
    case Step.column:
      return "Select a column to start building your query.";
    case Step.comparator:
      return `Select an comparator for "${column}". Use backspace to go back.`;
    case Step.value:
      return `Enter a value for "${column} ${comparator}". Use backspace to go back.`;
    default:
      return "";
  }
};

const HelperText: React.FC<ChipProps> = (props) => {
  return (
    <div className="mt-2 text-sm text-muted-foreground">{getText(props)}</div>
  );
};

export { HelperText };
