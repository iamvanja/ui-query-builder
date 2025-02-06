import React, { useState } from "react";
import { AutoComplete } from "@/components/ui/autocomplete";

enum Step {
  column = "column",
  comparator = "comparator",
  value = "value",
}

type QueryPart = {
  column: string;
  operator: string;
  value: string;
};

const operators = ["equals", "contains", "begins with", "ends with"];

const getPlaceholder = (currentStep: Step) => {
  if (currentStep === Step.column) {
    return "Select a column name...";
  }
  if (currentStep === Step.comparator) {
    return "Select a comparator...";
  }

  return "Enter a value and press Enter...";
};

interface QueryBuilderProps {
  columns: string[];
  isDebug?: boolean;
  // onQueryUpdate?: (query: string) => void; // todo
}

const QueryBuilder: React.FC<QueryBuilderProps> = ({
  columns,
  isDebug = false,
  // onQueryUpdate,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [currentStep, setCurrentStep] = useState<Step>(Step.column);
  const [currentQueryPart, setCurrentQueryPart] = useState<Partial<QueryPart>>(
    {}
  );
  const [queryParts, setQueryParts] = useState<QueryPart[]>([]);

  const fieldsPerStep = {
    [Step.column]: columns,
    [Step.comparator]: operators,
    [Step.value]: [],
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleSelectionChange = (suggestion: string) => {
    if (currentStep === Step.column) {
      setCurrentQueryPart({ ...currentQueryPart, column: suggestion });
      setCurrentStep(Step.comparator);
    } else if (currentStep === Step.comparator) {
      setCurrentQueryPart({ ...currentQueryPart, operator: suggestion });
      setCurrentStep(Step.value);
    } else if (currentStep === Step.value) {
      if (currentQueryPart.column && currentQueryPart.operator && suggestion) {
        setQueryParts([
          ...queryParts,
          { ...(currentQueryPart as QueryPart), value: suggestion },
        ]);

        setCurrentQueryPart({});
        setCurrentStep(Step.column);
      }
    }

    setInputValue("");
  };

  return (
    <div className="w-full max-w-2xl relative">
      {isDebug && (
        <pre className="text-xs margin-auto overflow-auto max-h-[200px] mb-2">
          {JSON.stringify(
            { currentStep, currentQueryPart, queryParts },
            null,
            2
          )}
        </pre>
      )}

      <AutoComplete
        value={inputValue}
        fields={fieldsPerStep[currentStep]}
        placeholder={getPlaceholder(currentStep)}
        onChange={handleInputChange}
        onSelectionChange={handleSelectionChange}
        allowNoMatchSelection={currentStep === Step.value}
      />
    </div>
  );
};

export { QueryBuilder };
