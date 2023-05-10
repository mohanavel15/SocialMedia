import { createContext, ParentComponent, useContext } from "solid-js";
import type { Accessor, Setter } from "solid-js";
import { User } from "../models/user";
import { Post } from "../models/post";

export type UserContextType = {
  user: Accessor<User | undefined>
  setUser: Setter<User | undefined>
  posts: Map<string, Post>
  likes: Map<string, Post>
  following: Map<string, User>
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