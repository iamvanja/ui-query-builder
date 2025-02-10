import { QueryPart, Step } from "./types";

type ChipProps = {
  step: Step;
  column?: QueryPart["column"];
  comparator?: QueryPart["comparator"];
};

const HelperText: React.FC<ChipProps> = ({ step, column, comparator }) => {
  return (
    <div className="mt-2 text-sm text-muted-foreground">
      {step === Step.column && "Select a column to start building your query."}
      {step === Step.comparator &&
        `Select an comparator for "${column}". Use backspace to go back.`}
      {step === Step.value &&
        `Enter a value for "${column} ${comparator}". Use backspace to go back.`}
    </div>
  );
};

export { HelperText };
