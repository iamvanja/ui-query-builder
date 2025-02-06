import React, { useState } from "react";
import { AutoComplete } from "@/components/ui/autocomplete";

interface QueryBuilderProps {
  columns: string[];
  onQueryUpdate?: (query: string) => void; // todo
}

enum Step {
  column = "column",
  comparator = "comparator",
  value = "value",
}

const QueryBuilder: React.FC<QueryBuilderProps> = ({
  columns,
  onQueryUpdate,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.column);

  return (
    <div className="w-full max-w-2xl relative">
      <AutoComplete
        fields={columns}
        placeholder="Enter a column name..."
        // onSelectionChange={onQueryUpdate}
      />
    </div>
  );
};

export { QueryBuilder };
