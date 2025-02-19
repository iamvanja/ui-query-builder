import React from "react";
import { UsePrivateAPIState } from "../hooks";

export type GlobalContextValue = {
  privateAPIref: React.RefObject<UsePrivateAPIState>;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

export const GlobalContext = React.createContext<
  GlobalContextValue | undefined
>(undefined);
