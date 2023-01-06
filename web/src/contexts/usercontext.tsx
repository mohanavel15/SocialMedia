import { createContext, ParentComponent } from "solid-js";
import type { Accessor, Setter } from "solid-js";
import { User } from "../models/user";

export type UserContextType = {
  user: Accessor<User | undefined>
  setUser: Setter<User | undefined>
  isLoggedIn: Accessor<boolean>
  setIsLoggedIn: Setter<boolean>
  updateUser: () => void
}

export const UserContext = createContext<UserContextType>(undefined!);

export const UserProvider: ParentComponent<{ value: UserContextType }> = (props) => {
  return (
    <UserContext.Provider value={props.value}>
      {props.children}
    </UserContext.Provider>
  );
}