import React, { useRef } from "react";
// import type { UsePrivateAPIState } from "./usePrivateAPI";
import { PublicAPI } from "../types";

export type UsePublicAPIArgs = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  // privateAPIref: React.RefObject<UsePrivateAPIState>;
};

export function usePublicAPI({
  inputRef,
}: // privateAPIref,
UsePublicAPIArgs): PublicAPI {
  const api = useRef<PublicAPI>({
    input: {
      blur() {
        inputRef.current?.blur();
      },
      focus() {
        inputRef.current?.focus();
      },
    },
  });

  return api.current;
}
