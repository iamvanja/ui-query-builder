import React, { useCallback, useEffect, useRef } from "react";
import { AutoComplete } from "./Autocomplete";
import { Step, QueryPart, Column } from "../types";
import { getPropsPerStep } from "../utils";
import { Chip } from "./Chip";
import { HelperText } from "./HelperText";
import { Button } from "./Button";
import { ChevronLeft } from "lucide-react";
import { cn } from "../utils";

import { GlobalContext } from "../contexts";
import { usePrivateAPI } from "../hooks/usePrivateAPI";

interface QueryBuilderProps {
  columns: Column[];
  isDebug?: boolean;
  rootClassName?: string;
  onFilterChange?: (queryParts: QueryPart[]) => void;
  initialFilter?: QueryPart[];
  localStorageKey?: string;
  shouldPersistData?: boolean;
  shouldFocusOnMount?: boolean;
}
const LS_QUERY_PARTS_KEY = "filter";

const QueryBuilder: React.FC<QueryBuilderProps> = ({
  columns,
  isDebug = false,
  rootClassName,
  onFilterChange,
  initialFilter = [],
  localStorageKey = LS_QUERY_PARTS_KEY,
  shouldPersistData = false,
  shouldFocusOnMount = false,
}) => {
  const privateAPIref = usePrivateAPI({
    initialFilter,
    shouldPersistData,
    localStorageKey,
    onFilterChange,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (shouldFocusOnMount) {
      inputRef?.current?.focus();
    }

    // unfocus chip when focused outside the input
    if (inputRef?.current === document.activeElement) {
      privateAPIref.current.setFocusedChipIndex(-1);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    privateAPIref.current.setInputValue(value);
  };

  const handleSelectionChange = (suggestion: string) => {
    const currentQP = privateAPIref.current.state.currentQueryPart;

    if (privateAPIref.current.state.currentStep === Step.column) {
      privateAPIref.current.setCurrentQueryPart({
        ...currentQP,
        column: suggestion,
      });
      privateAPIref.current.setCurrentColumn(
        columns.find((col) => col.name === suggestion) ?? null
      );
      privateAPIref.current.setCurrentStep(Step.comparator);
    } else if (privateAPIref.current.state.currentStep === Step.comparator) {
      privateAPIref.current.setCurrentQueryPart({
        ...currentQP,
        comparator: suggestion,
      });
      privateAPIref.current.setCurrentStep(Step.value);
    } else if (privateAPIref.current.state.currentStep === Step.value) {
      if (currentQP.column && currentQP.comparator && suggestion) {
        const queryParts = privateAPIref.current.state.queryParts;

        if (privateAPIref.current.state.editedChipIndex !== null) {
          // Update existing query part
          privateAPIref.current.setQueryParts(
            queryParts.map((part, index) =>
              index === privateAPIref.current.state.editedChipIndex
                ? { ...(currentQP as QueryPart), value: suggestion }
                : part
            )
          );
          privateAPIref.current.setEditedChipIndex(null);
        } else {
          // Add new query part
          privateAPIref.current.setQueryParts([
            ...queryParts,
            { ...(currentQP as QueryPart), value: suggestion },
          ]);
        }

        privateAPIref.current.setCurrentQueryPart({});
        privateAPIref.current.setCurrentStep(Step.column);
      }
    }

    privateAPIref.current.setInputValue("");
    inputRef.current?.focus();
  };

  const handleRemoveQueryPart = (index: number) => {
    privateAPIref.current.setQueryParts(
      privateAPIref.current.state.queryParts.filter((_, i) => i !== index)
    );
    inputRef.current?.focus();
  };

  const handleEditQueryPart = (index: number) => {
    const partToEdit = privateAPIref.current.state.queryParts[index];
    privateAPIref.current.setCurrentQueryPart(partToEdit);
    privateAPIref.current.setInputValue(partToEdit.column);
    privateAPIref.current.setCurrentStep(Step.column);
    privateAPIref.current.setEditedChipIndex(index);
    inputRef.current?.focus();
  };

  const handleRemoveAllQueryParts = () => {
    privateAPIref.current.setQueryParts([]);
    inputRef.current?.focus();
  };

  const handleChipFocused = useCallback(
    ({
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

      privateAPIref.current.setFocusedChipIndex(-1);
      inputRef.current?.focus();
    },
    [privateAPIref]
  );

  const handleGoBack = useCallback(() => {
    const { currentStep, currentQueryPart } = privateAPIref.current.state;
    const { setCurrentStep, setCurrentQueryPart, setInputValue } =
      privateAPIref.current;

    if (currentStep === Step.comparator) {
      setCurrentStep(Step.column);
      setCurrentQueryPart({
        ...currentQueryPart,
        column: undefined,
      });
    } else if (currentStep === Step.value) {
      setCurrentStep(Step.comparator);
      setCurrentQueryPart({
        ...currentQueryPart,
        comparator: undefined,
      });
    }
    setInputValue("");
  }, [privateAPIref]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        e.key === "Backspace" &&
        privateAPIref.current.state.inputValue === ""
      ) {
        e.preventDefault();
        handleGoBack();
      }
      if (
        privateAPIref.current.state.currentStep === Step.column &&
        privateAPIref.current.state.inputValue === ""
      ) {
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
    [handleChipFocused, handleGoBack, privateAPIref]
  );

  const handleChipKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number
  ) => {
    const keyActions: { [key: string]: () => void } = {
      Backspace: () => handleRemoveQueryPart(index),
      Delete: () => handleRemoveQueryPart(index),
      Enter: () => handleEditQueryPart(index),
      ArrowLeft: () => handleChipFocused({ index, position: "prev" }),
      ArrowRight: () => handleChipFocused({ index, position: "next" }),
      Tab: () => {
        if (e.shiftKey) {
          handleChipFocused({ index, position: "prev" });
        } else {
          handleChipFocused({ index, position: "next" });
        }
      },
    };

    if (keyActions[e.key]) {
      e.preventDefault();
      keyActions[e.key]();
    }
  };

  return (
    <GlobalContext.Provider value={{ inputRef, privateAPIref }}>
      <div className={cn("w-full relative", rootClassName)}>
        {isDebug && (
          <pre className="text-xs margin-auto overflow-auto max-h-[200px] mb-2">
            {JSON.stringify(
              {
                currentStep: privateAPIref.current.state.currentStep,
                currentQueryPart: privateAPIref.current.state.currentQueryPart,
                focusedChipIndex: privateAPIref.current.state.focusedChipIndex,
                editedChipIndex: privateAPIref.current.state.editedChipIndex,
                queryParts: privateAPIref.current.state.queryParts,
              },
              null,
              2
            )}
          </pre>
        )}

        <div className="mb-1 flex justify-between items-end">
          <HelperText
            step={privateAPIref.current.state.currentStep}
            column={privateAPIref.current.state.currentQueryPart.column}
            comparator={privateAPIref.current.state.currentQueryPart.comparator}
            isChipFocused={privateAPIref.current.state.focusedChipIndex > -1}
          />

          {privateAPIref.current.state.queryParts.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveAllQueryParts}
            >
              Remove All
            </Button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1 p-1 border rounded-md">
          {privateAPIref.current.state.queryParts.map((part, index) => (
            <Chip
              isInProgress={
                index === privateAPIref.current.state.editedChipIndex
              }
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
              onFocus={() => privateAPIref.current.setFocusedChipIndex(index)}
            />
          ))}
          {privateAPIref.current.state.currentQueryPart.column &&
            privateAPIref.current.state.editedChipIndex === null && (
              <Chip
                isInProgress
                column={privateAPIref.current.state.currentQueryPart.column}
                comparator={
                  privateAPIref.current.state.currentQueryPart.comparator
                }
                value={privateAPIref.current.state.currentQueryPart.value}
              />
            )}

          <div className="relative flex-grow flex items-center gap-1">
            {privateAPIref.current.state.currentStep !== Step.column && (
              <Button variant="ghost" size="sm" onClick={handleGoBack}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <AutoComplete
              tabIndex={0}
              value={privateAPIref.current.state.inputValue}
              ref={inputRef}
              onChange={handleInputChange}
              onSelectionChange={handleSelectionChange}
              rootClassName="max-w-[240px]"
              onKeyDown={handleKeyDown}
              {...getPropsPerStep(
                privateAPIref.current.state.currentStep,
                columns,
                privateAPIref.current.state.currentColumn
              )}
            />
            {privateAPIref.current.state.currentStep === "value" && (
              <Button
                className="px-7"
                size="icon"
                onClick={() =>
                  handleSelectionChange(privateAPIref.current.state.inputValue)
                }
              >
                {privateAPIref.current.state.editedChipIndex !== null
                  ? "Update"
                  : "Add"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </GlobalContext.Provider>
  );
};

export { QueryBuilder };
