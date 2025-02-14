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
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [focusedChipIndex, setFocusedChipIndex] = useState(-1);

  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  useEffect(() => {
    if (inputRef?.current === document.activeElement) {
      setFocusedChipIndex(-1);
    }
  });

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

  const handleChipFocused = ({
    index,
    position,
  }: {
    index?: number;
    position: "first" | "last" | "prev" | "next";
  }) => {
    const chipCount = chipRefs?.current?.length ?? 0;
    let nextIndex: number | undefined;

    if (position === "first") {
      nextIndex = 0;
    } else if (position === "last") {
      nextIndex = chipCount - 1;
    } else if (position === "prev" && index !== undefined) {
      nextIndex = index - 1;
    } else if (position === "next" && index !== undefined) {
      nextIndex = index + 1;
    }

    if (
      nextIndex !== undefined &&
      nextIndex > -1 &&
      nextIndex <= chipCount - 1
    ) {
      chipRefs.current[nextIndex]?.focus();
      return;
    }

    setFocusedChipIndex(-1);
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
      if (currentStep === Step.column && inputValue === "") {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          handleChipFocused({ position: "last" });
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          handleChipFocused({ position: "first" });
        }
      }
    },
    [handleGoBack, inputValue]
  );

  const handleChipKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number
  ) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      handleRemoveQueryPart(index);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handleChipFocused({ index, position: "prev" });
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleChipFocused({ index, position: "next" });
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) {
        handleChipFocused({ index, position: "prev" });
      } else {
        handleChipFocused({ index, position: "next" });
      }
    }
  };

  return (
    <div className={cn("w-full relative", rootClassName)}>
      {isDebug && (
        <pre className="text-xs margin-auto overflow-auto max-h-[200px] mb-2">
          {JSON.stringify(
            { currentStep, currentQueryPart, focusedChipIndex, queryParts },
            null,
            2
          )}
        </pre>
      )}

      <HelperText
        step={currentStep}
        column={currentQueryPart.column}
        comparator={currentQueryPart.comparator}
        isChipFocused={focusedChipIndex > -1}
      />

      <div className="flex flex-wrap items-center gap-1 p-1 border rounded-md">
        {queryParts.map((part, index) => (
          <Chip
            key={`query-part-${index}`}
            column={part.column}
            comparator={part.comparator}
            value={part.value}
            onDelete={() => handleRemoveQueryPart(index)}
            ref={(el) => {
              if (el) {
                chipRefs.current[index] = el;
              }
            }}
            tabIndex={0}
            onKeyDown={(e) => handleChipKeyDown(e, index)}
            onFocus={() => setFocusedChipIndex(index)}
          />
        ))}

        <div className="relative flex-grow flex items-center gap-1">
          {currentStep !== Step.column && (
            <Button variant="ghost" size="sm" onClick={handleGoBack}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <AutoComplete
            tabIndex={0}
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
