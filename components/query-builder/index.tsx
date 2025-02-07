import React, { useState } from "react";
import { AutoComplete } from "@/components/ui/autocomplete";
import { Badge } from "../ui/badge";

enum Step {
  column = "column",
  comparator = "comparator",
  value = "value",
}

type QueryPart = {
  column: string;
  comparator: string;
  value: string;
};

const comparators = ["equals", "contains", "begins with", "ends with"];

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
    [Step.comparator]: comparators,
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
      setCurrentQueryPart({ ...currentQueryPart, comparator: suggestion });
      setCurrentStep(Step.value);
    } else if (currentStep === Step.value) {
      if (
        currentQueryPart.column &&
        currentQueryPart.comparator &&
        suggestion
      ) {
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
    <div className="w-full relative">
      {isDebug && (
        <pre className="text-xs margin-auto overflow-auto max-h-[200px] mb-2">
          {JSON.stringify(
            { currentStep, currentQueryPart, queryParts },
            null,
            2
          )}
        </pre>
      )}

      <div className="flex flex-wrap items-center gap-1 p-1 border rounded-md">
        {queryParts.map((part, i) => (
          <Badge variant="default" key={`query-part-${i}`}>
            {part.column}&nbsp;<i>{part.comparator}</i>&nbsp;
            {`"${part.value}"`}
          </Badge>
        ))}

        <div className="relative flex-grow flex items-center gap-1">
          <AutoComplete
            value={inputValue}
            fields={fieldsPerStep[currentStep]}
            placeholder={getPlaceholder(currentStep)}
            onChange={handleInputChange}
            onSelectionChange={handleSelectionChange}
            allowNoMatchSelection={currentStep === Step.value}
            rootClassName="max-w-[300px]"
          />
        </div>
      </div>
    </div>
  );
};

export { QueryBuilder };
