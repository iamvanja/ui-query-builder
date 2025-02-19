import { useContext } from "react";
import { ClassNames } from "../../types";
import { GlobalContext, GlobalContextValue } from "../../contexts";
import { cn } from "../../utils";
import { DefaultHelperText, DefaultHelperTextProps } from "./DefaultHelperText";
import { DefaultRemoveAllButton } from "./DefaultRemoveAllButton";

type TopBarRendererProps = DefaultHelperTextProps & {
  classNames?: ClassNames;
  showRemoveAllButton?: boolean;
  onRemoveAll?: () => void;
};
export type TopBarRenderer = (props: TopBarRendererProps) => React.JSX.Element;

export const DefaultTopBar: TopBarRenderer = ({
  showRemoveAllButton = false,
  onRemoveAll,
  classNames,
  ...props
}) => {
  return (
    <div
      className={cn("mb-1 flex justify-between items-end", classNames?.topBar)}
    >
      <DefaultHelperText {...props} className={classNames?.helperText} />

      {showRemoveAllButton && onRemoveAll && (
        <DefaultRemoveAllButton
          onRemoveAll={onRemoveAll}
          className={classNames?.removeAllButton}
        />
      )}
    </div>
  );
};

type TopBarProps = {
  render?: TopBarRenderer;
};
export const TopBar = ({ render = DefaultTopBar }: TopBarProps) => {
  const context = useContext(GlobalContext) || ({} as GlobalContextValue);
  const { privateAPIref, inputRef, classNames } = context;

  const handleRemoveAllQueryParts = () => {
    privateAPIref.current.setQueryParts([]);
    inputRef.current?.focus();
  };

  return render({
    step: privateAPIref.current.state.currentStep,
    column: privateAPIref.current.state.currentQueryPart.column,
    comparator: privateAPIref.current.state.currentQueryPart.comparator,
    isChipFocused: privateAPIref.current.state.focusedChipIndex > -1,
    showRemoveAllButton: privateAPIref.current.state.queryParts.length > 0,
    onRemoveAll: handleRemoveAllQueryParts,
    classNames,
  });
};
