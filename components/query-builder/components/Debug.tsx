import { useContext } from "react";
import { GlobalContext, GlobalContextValue } from "../contexts";
import { cn } from "../utils";

type DebugRendererProps = {
  state: object;
  className?: string;
};
export type DebugRenderer = (props: DebugRendererProps) => React.JSX.Element;

export const DefaultDebug: DebugRenderer = ({ state, className }) => {
  return (
    <pre
      className={cn(
        "text-xs margin-auto overflow-auto max-h-[200px] mb-2",
        className
      )}
    >
      {JSON.stringify(state, null, 2)}
    </pre>
  );
};

type DebugProps = {
  render?: DebugRenderer;
};
export const Debug = ({ render = DefaultDebug }: DebugProps) => {
  const context = useContext(GlobalContext) || ({} as GlobalContextValue);
  const { privateAPIref, classNames } = context;

  return render({
    state: privateAPIref.current.state,
    className: classNames.debug,
  });
};
