import { createContext, ParentComponent, useContext } from "solid-js";
import { User } from "../models/user";
import { ReactiveMap } from "@solid-primitives/map";
import { Post } from "../models/post";

type StoreContextType = {
  users: ReactiveMap<string, User>,
  posts: ReactiveMap<string, Post>,
  getPost: (id: string) => Promise<Post>,
  getUserById: (id: string) => Promise<User>,
  getUserByUsername: (username: string) => Promise<User>,
}

export const StoreContext = createContext<StoreContextType>({} as StoreContextType);

export const StoreProvider: ParentComponent = (props) => {
  let users = new ReactiveMap<string, User>()
  let posts = new ReactiveMap<string, Post>()

  const getUserByUsername = async (username: string) => {
    let user = users.get(username);
    if (user !== undefined) {
      return user;
    }

    let res = await fetch("/api/users/" + username)
    if (res.ok) {
      let user: User = await res.json();
      users.set(user.id, user);
      users.set(user.username, user);
      return user;
    }

    return {} as User;
  }

  const getUserById = async (id: string) => {
    let user = users.get(id);
    if (user !== undefined) {
      return user;
    }
    let res = await fetch("/api/users-id/" + id)
    if (res.ok) {
      let user: User = await res.json();
      users.set(user.id, user);
      users.set(user.username, user);
      return user;
    }
    return {} as User;
  }

  const getPost = async (id: string) => {
    let post = posts.get(id);
    if (post !== undefined) {
      return post;
    }
    let res = await fetch("/api/posts/" + id)
    if (res.ok) {
      let post: Post = await res.json();
      posts.set(post.id, post);
      return post
    }
    return { id: "000000000000000000000000", parent_id: "000000000000000000000000" } as Post;
  }

  const value = {
    users: users,
    posts: posts,
    getPost: getPost,
    getUserById: getUserById,
    getUserByUsername: getUserByUsername
  }

  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext)