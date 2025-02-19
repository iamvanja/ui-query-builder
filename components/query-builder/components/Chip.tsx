import { X } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "../utils";

type ChipProps = {
  column: string;
  comparator?: string;
  value?: string;
  onDelete?: () => void;
  isInProgress?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("h-2 rounded-md bg-muted bg-slate-300", className)}
      {...props}
    />
  );
};

const Chip = forwardRef<HTMLDivElement, ChipProps>(
  (
    { column, comparator, value, onDelete, isInProgress = false, ...props },
    ref
  ) => {
    return (
      <div
        className={cn(
          "query-builder-chip inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1",
          {
            "border-transparent bg-primary text-primary-foreground hover:bg-primary/80":
              !isInProgress,
            "text-foreground": isInProgress,
          }
        )}
        ref={ref}
        {...props}
      >
        {column}&nbsp;
        {comparator ? <i>{comparator}</i> : <Skeleton className="w-[50px]" />}
        &nbsp;
        {value ? (
          <code className="max-w-[300px] truncate">{value}</code>
        ) : (
          <Skeleton className="w-[24px]" />
        )}
        {onDelete && (
          <button onClick={onDelete} className="ml-1 focus:outline-none">
            <X size={14} />
          </button>
        )}
      </div>
    );
  }
);

Chip.displayName = "Chip";

export { Chip };
