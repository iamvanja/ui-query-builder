import { Input } from "@/components/ui/input";
import React, { forwardRef, useState } from "react";

const AutoComplete = forwardRef<
  HTMLInputElement,
  Omit<React.ComponentPropsWithoutRef<typeof Input>, "type" | "className"> & {
    fields: string[];
    onSelectionChange?: (selectedItem: string) => void;
  }
>(({ value, fields, onSelectionChange, ...props }, ref) => {
  const [isInputFocused, setInputFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(fields);
  const [inputValue, setInputValue] = useState("");
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // todo: debounce this
    updateSuggestions(e.target.value);

    // allow parent component to still implement its onChange event
    props.onChange?.(e);
  };

  const updateSuggestions = (value: string) => {
    setInputValue(value);
    let filteredSuggestions: string[] = [];

    filteredSuggestions = fields.filter((col) =>
      col.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filteredSuggestions);
  };

  const handleSelectionChange = (suggestion: string) => {
    setInputValue(suggestion);
    onSelectionChange && onSelectionChange(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    props.onKeyDown?.(e);

    // todo: handle keyboard navigation going outside the viewport
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

      if (finalValue) {
        handleSelectionChange(finalValue);
      }
    }
  };

  return (
    <div className="w-full relative">
      <Input
        {...props}
        value={inputValue}
        ref={ref}
        type="text"
        className="w-full"
        onFocus={() => setInputFocused(true)}
        // todo: is onBlur cancelling list item click?
        onBlur={() => setInputFocused(false)}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      {isInputFocused && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 z-10 bg-popover text-popover-foreground border rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={`autocomplete-list-item-${index}`}
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
});

export { AutoComplete };
