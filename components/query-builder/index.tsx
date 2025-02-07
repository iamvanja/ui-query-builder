import React, { useCallback, useEffect, useRef, useState } from "react";
import { AutoComplete } from "@/components/ui/autocomplete";
import { Step, QueryPart, Column } from "./types";
import { getPropsPerStep } from "./utils";
import { Chip } from "./chip";
import { HelperText } from "./helper-text";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface QueryBuilderProps {
  columns: Column[];
  isDebug?: boolean;
  rootClassName?: string;
}

const QueryBuilder: React.FC<QueryBuilderProps> = ({
  columns,
  isDebug = false,
  rootClassName,
}) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentColumn, setCurrentColumn] = useState<Column | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>(Step.column);
  const [currentQueryPart, setCurrentQueryPart] = useState<Partial<QueryPart>>(
    {}
  );
  const [queryParts, setQueryParts] = useState<QueryPart[]>([]);

  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

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
    inputRef.current?.focus();
  };

  const handleRemoveQueryPart = (index: number) => {
    setQueryParts(queryParts.filter((_, i) => i !== index));
    inputRef.current?.focus();
  };

  const handleGoBack = useCallback(() => {
    if (currentStep === Step.comparator) {
      setCurrentStep(Step.column);
      setCurrentQueryPart({ ...currentQueryPart, column: undefined });
    } else if (currentStep === Step.value) {
      setCurrentStep(Step.comparator);
      setCurrentQueryPart({ ...currentQueryPart, comparator: undefined });
    }
    setInputValue("");
  }, [currentStep, currentQueryPart]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && inputValue === "") {
        e.preventDefault();
        handleGoBack();
      }
    },
    [handleGoBack, inputValue]
  );

  return (
    <div className={cn("w-full relative", rootClassName)}>
      {isDebug && (
        <pre className="text-xs margin-auto overflow-auto max-h-[200px] mb-2">
          {JSON.stringify(
            { currentStep, currentQueryPart, queryParts },
            null,
            2
          )}
        </pre>
      )}

      <HelperText
        step={currentStep}
        column={currentQueryPart.column}
        comparator={currentQueryPart.comparator}
      />

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
          {currentStep !== Step.column && (
            <Button variant="ghost" size="sm" onClick={handleGoBack}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <AutoComplete
            value={inputValue}
            ref={inputRef}
            onChange={handleInputChange}
            onSelectionChange={handleSelectionChange}
            rootClassName="max-w-[300px]"
            onKeyDown={handleKeyDown}
            {...getPropsPerStep(currentStep, columns, currentColumn)}
          />
        </div>
      </div>
    </div>
  );
};

export { QueryBuilder };
