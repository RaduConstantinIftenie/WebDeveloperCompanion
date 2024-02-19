import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { GlobalStore } from "../types/globalStore";

export const GlobalStoreContext = createContext({
  state: {} as Partial<GlobalStore>,
  setState: {} as Dispatch<SetStateAction<Partial<GlobalStore>>>,
});

export const GlobalStateProvider = ({
  children,
  value = {} as GlobalStore,
}: {
  children: React.ReactNode;
  value?: Partial<GlobalStore>;
}) => {
  const [state, setState] = useState(value);
  return (
    <GlobalStoreContext.Provider value={{ state, setState }}>
      {children}
    </GlobalStoreContext.Provider>
  );
};
