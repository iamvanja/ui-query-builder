import { Input } from "@/components/ui/input";
import React, {
  forwardRef,
  startTransition,
  useEffect,
  useRef,
  useState,
} from "react";

interface AutoCompleteProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof Input>,
    "type" | "className"
  > {
  fields: string[];
  onSelectionChange?: (selectedItem: string) => void;
  allowNoMatchSelection?: boolean;
}

const AutoComplete = forwardRef<HTMLInputElement, AutoCompleteProps>(
  (
    {
      value,
      fields,
      onSelectionChange,
      allowNoMatchSelection = false,
      ...props
    },
    ref
  ) => {
    const [isInputFocused, setInputFocused] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>(fields);
    const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);
    const suggestionRefs = useRef<(HTMLLIElement | null)[]>([]);

    useEffect(() => {
      // Reset suggestions and focusedIndex when fields prop updates
      setSuggestions(fields);
      setFocusedSuggestionIndex(-1);
    }, [fields]);

    useEffect(() => {
      // Fixes keyboard dropdown selection not scrolling into view
      if (
        focusedSuggestionIndex >= 0 &&
        focusedSuggestionIndex < suggestionRefs.current.length
      ) {
        suggestionRefs.current[focusedSuggestionIndex]?.scrollIntoView({
          block: "nearest",
        });
      }
    }, [focusedSuggestionIndex]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // todo: debounce this
      updateSuggestions(e.target.value);

      // allow parent component to still implement its onChange event
      props.onChange?.(e);
    };

    const updateSuggestions = (value: string) => {
      let filteredSuggestions: string[] = [];

      filteredSuggestions = fields.filter((col) =>
        col.toLowerCase().includes(value.toLowerCase())
      );

      setSuggestions(filteredSuggestions);
    };

    const handleSelectionChange = (suggestion: string) => {
      if (onSelectionChange) {
        onSelectionChange(suggestion);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // allow parent component to still implement its onKeyDown event
      props.onKeyDown?.(e);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter") {
        e.preventDefault();
        let finalValue = suggestions[focusedSuggestionIndex];

        if (focusedSuggestionIndex === -1 && allowNoMatchSelection) {
          finalValue = value as string;
        }

        if (finalValue) {
          handleSelectionChange(finalValue);
        }
      }
    };

    return (
      <div className="w-full relative">
        <Input
          {...props}
          value={value}
          ref={ref}
          type="text"
          className="w-full"
          onFocus={() => setInputFocused(true)}
          // onBlur interfers with the LIs onClick handler - https://github.com/facebook/react/issues/4210
          onBlur={() => startTransition(() => setInputFocused(false))}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        {isInputFocused && suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 z-10 bg-popover text-popover-foreground border rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={`autocomplete-list-item-${index}`}
                ref={(el) => {
                  suggestionRefs.current[index] = el;
                }}
                className={`px-4 py-2 cursor-pointer ${
                  index === focusedSuggestionIndex
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => handleSelectionChange(suggestion)}
                onMouseEnter={() => setFocusedSuggestionIndex(index)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

AutoComplete.displayName = "AutoComplete";

export { AutoComplete };
