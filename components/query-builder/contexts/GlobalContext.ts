import React from "react";
import { UsePrivateAPIState } from "../hooks";
import { ClassNames } from "../types";

export type GlobalContextValue = {
  privateAPIref: React.RefObject<UsePrivateAPIState>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  classNames: ClassNames;
};

export const GlobalContext = React.createContext<
  GlobalContextValue | undefined
>(undefined);
