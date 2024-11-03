import { createContext } from "react";

export const AppContext = createContext({
  user: {
    uid: null,
    email: null,
    handle: null, // add handle here as part of user structure
  },
  userData: null,
  setAppState: () => {},
});