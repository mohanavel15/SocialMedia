import { createContext, ParentComponent, useContext } from "solid-js";
import { User } from "../models/user";
import { ReactiveMap } from "@solid-primitives/map";
import { Post } from "../models/post";

type StoreContextType = {
  users: ReactiveMap<string, User>;
  posts: ReactiveMap<string, Post>;
}

export const StoreContext = createContext<StoreContextType>({} as StoreContextType);

export const StoreProvider: ParentComponent = (props) => {
  let users = new ReactiveMap<string, User>()
  let posts = new ReactiveMap<string, Post>()

  const value = {
    users: users,
    posts: posts
  }

  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext)