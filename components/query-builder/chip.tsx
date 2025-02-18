import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { forwardRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type ChipProps = {
  column: string;
  comparator?: string;
  value?: string;
  onDelete?: () => void;
  isInProgress?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const Chip = forwardRef<HTMLDivElement, ChipProps>(
  (
    { column, comparator, value, onDelete, isInProgress = false, ...props },
    ref
  ) => {
    const variant = isInProgress ? "outline" : "default";
    return (
      <Badge variant={variant} ref={ref} {...props}>
        {column}&nbsp;
        {comparator ? (
          <i>{comparator}</i>
        ) : (
          <Skeleton className="h-2 w-[50px] bg-slate-300 animate-none" />
        )}
        &nbsp;
        {value ? (
          <code className="max-w-[300px] truncate">{value}</code>
        ) : (
          <Skeleton className="h-2 w-[24px] bg-slate-300 animate-none" />
        )}
        {onDelete && (
          <button onClick={onDelete} className="ml-1 focus:outline-none">
            <X size={14} />
          </button>
        )}
      </Badge>
    );
  }
);

Chip.displayName = "Chip";

export { Chip };
