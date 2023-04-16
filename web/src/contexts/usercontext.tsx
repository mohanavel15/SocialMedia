import { createContext, ParentComponent, useContext } from "solid-js";
import type { Accessor, Setter } from "solid-js";
import { User } from "../models/user";
import { Post } from "../models/post";
import { ReactiveMap } from "@solid-primitives/map";

export type UserContextType = {
  user: Accessor<User | undefined>
  setUser: Setter<User | undefined>
  posts: ReactiveMap<string, Post>
  likes: ReactiveMap<string, Post>
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

export const useUserContext = () => useContext(UserContext)