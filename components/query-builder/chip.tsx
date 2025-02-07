import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

type ChipProps = {
  column: string;
  comparator: string;
  value: string;
  onDelete: () => void;
};

const Chip: React.FC<ChipProps> = ({ column, comparator, value, onDelete }) => {
  return (
    <Badge variant="default">
      {column}&nbsp;<i>{comparator}</i>&nbsp;
      {`"${value}"`}
      <button onClick={onDelete} className="ml-1 focus:outline-none">
        <X size={14} />
      </button>
    </Badge>
  );
};

export { Chip };
