import { Input } from "@/components/ui/input";
import { forwardRef, useState } from "react";

const AutoComplete = forwardRef<
  HTMLInputElement,
  Omit<React.ComponentPropsWithoutRef<typeof Input>, "type" | "className"> & {
    fields: string[];
  }
>(({ value, fields, ...props }, ref) => {
  const [isInputFocused, setInputFocused] = useState(false);

  return (
    <div className="w-full relative">
      <Input
        {...props}
        ref={ref}
        type="text"
        className="w-full"
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
      />

      {isInputFocused && fields.length > 0 && (
        <ul className="absolute left-0 right-0 z-10 bg-popover text-popover-foreground border rounded-md shadow-lg max-h-60 overflow-auto">
          {fields.map((field, index) => (
            <li
              key={`autocomplete-list-item-${index}`}
              className="px-4 py-2 cursor-pointer"
            >
              {field}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export { AutoComplete };
