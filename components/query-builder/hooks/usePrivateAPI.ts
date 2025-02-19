import { useEffect, useRef, useState } from "react";
import { Column, QueryPart, Step } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";

export type PrivateAPIState = {
  inputValue: string;
  currentColumn: Column | null;
  currentStep: Step;
  currentQueryPart: Partial<QueryPart>;
  queryParts: QueryPart[];
  focusedChipIndex: number;
  editedChipIndex: number | null;
};

export type PrivateAPI = {
  setInputValue: (value: string) => void;
  setCurrentColumn: (column: PrivateAPIState["currentColumn"]) => void;
  setCurrentStep: (step: Step) => void;
  setCurrentQueryPart: (queryPart: Partial<QueryPart>) => void;
  setQueryParts: (queryParts: QueryPart[]) => void;
  setFocusedChipIndex: (chipIndex: number) => void;
  setEditedChipIndex: (chipIndex: number | null) => void;
};

export type UsePrivateAPIState = PrivateAPI & {
  state: PrivateAPIState;
};

export type PrivateAPIProps = {
  initialFilter: QueryPart[];
  shouldPersistData: boolean;
  localStorageKey: string;
  onFilterChange?: (queryParts: QueryPart[]) => void;
};

const usePrivateAPI = ({
  initialFilter,
  shouldPersistData,
  localStorageKey,
  onFilterChange,
}: PrivateAPIProps): React.RefObject<UsePrivateAPIState> => {
  const ref = useRef<UsePrivateAPIState>(null!);
  const [inputValue, setInputValue] = useState("");
  const [currentColumn, setCurrentColumn] =
    useState<PrivateAPIState["currentColumn"]>(null);
  const [currentStep, setCurrentStep] = useState<Step>(Step.column);
  const [currentQueryPart, setCurrentQueryPart] = useState<
    PrivateAPIState["currentQueryPart"]
  >({});
  const [storedValue, setStoredValue] = useLocalStorage(
    localStorageKey,
    initialFilter
  );
  const [queryParts, setQueryParts] = useState<QueryPart[]>(initialFilter);
  const [focusedChipIndex, setFocusedChipIndex] = useState(-1);
  const [editedChipIndex, setEditedChipIndex] =
    useState<PrivateAPIState["editedChipIndex"]>(null);

  // Set initial state if persisting data from localStorage. Using useEffect because to avoid the SSR hydration issues
  useEffect(() => {
    if (shouldPersistData) {
      setQueryParts(storedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const state: PrivateAPIState = {
    inputValue,
    currentColumn,
    currentStep,
    currentQueryPart,
    queryParts,
    focusedChipIndex,
    editedChipIndex,
  };

  const api: PrivateAPI = {
    setInputValue,
    setCurrentColumn,
    setCurrentStep,
    setCurrentQueryPart,
    setQueryParts: (queryParts) => {
      setQueryParts(queryParts);

      if (onFilterChange) {
        onFilterChange(queryParts);
      }

      if (shouldPersistData) {
        setStoredValue(queryParts);
      }
    },
    setFocusedChipIndex,
    setEditedChipIndex,
  };

  ref.current = { ...api, state };

  return ref;
};

export { usePrivateAPI };
