import { createContext } from "react";

export const AppContext = createContext({
  user: {
    uid: null,
    email: null,
    handle: null,
  },
  userData: null,
  setAppState: () => {},
  updateUser: () => {},
});
