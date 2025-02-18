import { Input } from "@/components/ui/input";
import { usePrevious } from "@/hooks/usePrevious";
import { cn } from "@/lib/utils";
import React, { forwardRef, useEffect, useRef, useState } from "react";

interface AutoCompleteProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Input>, "className"> {
  fields: string[];
  onSelectionChange?: (selectedItem: string) => void;
  allowNoMatchSelection?: boolean;
  rootClassName?: string;
}

const AutoComplete = forwardRef<HTMLInputElement, AutoCompleteProps>(
  (
    {
      value,
      type = "text",
      fields,
      onSelectionChange,
      allowNoMatchSelection = false,
      rootClassName,
      ...props
    },
    ref
  ) => {
    const prevFields = usePrevious(fields);
    const innerRef = useRef<HTMLInputElement>(null);
    const [isInputFocused, setInputFocused] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>(fields);
    const suggestionDropdownRef = useRef<HTMLUListElement>(null);
    const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);
    const suggestionRefs = useRef<(HTMLLIElement | null)[]>([]);

    // Combine the forwarded ref with our internal ref
    const inputRef = (node: HTMLInputElement) => {
      innerRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    // Solves the problem of calling onBlur and mutating state causing LI's (dropdown item) onClick to not fire. https://github.com/facebook/react/issues/4210
    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (
          suggestionDropdownRef.current &&
          !suggestionDropdownRef.current.contains(e.target as Node) &&
          innerRef.current &&
          !innerRef.current.contains(e.target as Node)
        ) {
          setInputFocused(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    useEffect(() => {
      // this is ugly and should be replaced by _.isEqual or something similar. Not spending time on this now since building an autocomplete component is not the focus of this project.
      if (JSON.stringify(fields) !== JSON.stringify(prevFields)) {
        // Reset suggestions and focusedIndex when fields prop updates
        setSuggestions(fields);
        setFocusedSuggestionIndex(-1);
      }
    }, [prevFields, fields]);

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
      <div className={cn("w-full relative", rootClassName)}>
        <Input
          {...props}
          type={type}
          value={value}
          ref={inputRef}
          className="w-full"
          onFocus={() => setInputFocused(true)}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        {isInputFocused && suggestions.length > 0 && (
          <ul
            className="absolute mt-[2px] left-0 right-0 z-10 bg-popover text-popover-foreground border rounded-md shadow-lg max-h-60 overflow-auto"
            ref={suggestionDropdownRef}
          >
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
