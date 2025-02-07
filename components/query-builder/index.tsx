import React, { useState } from "react";
import { AutoComplete } from "@/components/ui/autocomplete";
import { Step, QueryPart, Column } from "./types";
import { getPropsPerStep } from "./utils";
import { Chip } from "./chip";

interface QueryBuilderProps {
  columns: Column[];
  isDebug?: boolean;
  // onQueryUpdate?: (query: string) => void; // todo
}

const QueryBuilder: React.FC<QueryBuilderProps> = ({
  columns,
  isDebug = false,
  // onQueryUpdate,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [currentColumn, setCurrentColumn] = useState<Column | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>(Step.column);
  const [currentQueryPart, setCurrentQueryPart] = useState<Partial<QueryPart>>(
    {}
  );
  const [queryParts, setQueryParts] = useState<QueryPart[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleSelectionChange = (suggestion: string) => {
    if (currentStep === Step.column) {
      setCurrentQueryPart({ ...currentQueryPart, column: suggestion });
      setCurrentColumn(columns.find((col) => col.name === suggestion) ?? null);
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

  const handleRemoveQueryPart = (index: number) => {
    setQueryParts(queryParts.filter((_, i) => i !== index));
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
        {queryParts.map((part, index) => (
          <Chip
            key={`query-part-${index}`}
            column={part.column}
            comparator={part.comparator}
            value={part.value}
            onDelete={() => handleRemoveQueryPart(index)}
          />
        ))}

        <div className="relative flex-grow flex items-center gap-1">
          <AutoComplete
            value={inputValue}
            onChange={handleInputChange}
            onSelectionChange={handleSelectionChange}
            rootClassName="max-w-[300px]"
            {...getPropsPerStep(currentStep, columns, currentColumn)}
          />
        </div>
      </div>
    </div>
  );
};

export { QueryBuilder };
