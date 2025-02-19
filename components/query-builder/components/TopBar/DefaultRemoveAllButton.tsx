import { Button } from "../Button";

export type DefaultRemoveAllButtonProps = {
  onRemoveAll: () => void;
  className?: string;
};

export const DefaultRemoveAllButton = ({
  className,
  onRemoveAll,
}: DefaultRemoveAllButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      onClick={onRemoveAll}
    >
      Remove All
    </Button>
  );
};
