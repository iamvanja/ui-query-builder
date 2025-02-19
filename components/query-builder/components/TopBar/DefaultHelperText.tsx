import { QueryPart, Step } from "../../types";
import { cn } from "../../utils";

export type DefaultHelperTextProps = {
  step: Step;
  column?: QueryPart["column"];
  comparator?: QueryPart["comparator"];
  isChipFocused?: boolean;
  className?: string;
};

export const getText = ({
  isChipFocused,
  step,
  column,
  comparator,
}: DefaultHelperTextProps) => {
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

export const DefaultHelperText = ({
  className,
  ...props
}: DefaultHelperTextProps) => {
  return (
    <div className={cn("mt-2 text-sm text-muted-foreground", className)}>
      {getText(props)}
    </div>
  );
};
