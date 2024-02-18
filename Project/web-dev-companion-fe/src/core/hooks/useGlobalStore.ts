import { useContext } from "react";
import { GlobalStoreContext } from "../stores/globalStore";

export const useStore = () => {
  const context = useContext(GlobalStoreContext);
  if (!context) {
    throw new Error("Global context is missing.");
  }
  return context;
};
