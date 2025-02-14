import { Badge, BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { forwardRef } from "react";

type ChipProps = {
  column: string;
  comparator: string;
  value: string;
  onDelete: () => void;
} & React.HTMLAttributes<HTMLDivElement>;

const Chip = forwardRef<HTMLDivElement, ChipProps>(
  ({ column, comparator, value, onDelete, ...props }, ref) => {
    return (
      <Badge variant="default" ref={ref} {...props}>
        {column}&nbsp;<i>{comparator}</i>&nbsp;
        {`"${value}"`}
        <button onClick={onDelete} className="ml-1 focus:outline-none">
          <X size={14} />
        </button>
      </Badge>
    );
  }
);

export { Chip };
