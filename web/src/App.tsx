import { Route, Routes } from '@solidjs/router';
import { Component, createEffect, createSignal, lazy, onMount } from 'solid-js';
import { PopUpProvider } from './contexts/popupcontext';
import { StoreProvider } from './contexts/store';
import { UserProvider } from './contexts/usercontext';
import { Post as PostType } from './models/post';
import { User as UserType } from './models/user';
import Feed from './pages/Feed';
import Global from './pages/Global';
import PopUp from './pages/PopUp';

const Home = lazy(() => import("./pages/Home"));
const User = lazy(() => import("./pages/User"));
const PostPage = lazy(() => import("./pages/PostPage"));

const App: Component = () => {
  const [user, setUser] = createSignal<UserType>();
  let posts = new Map<string, PostType>();
  let likes = new Map<string, PostType>();
  let following = new Map<string, UserType>();
  const [isLoggedIn, setIsLoggedIn] = createSignal(false);

  const getCurrentUser = () => {
    fetch("/api/me").then(res => {
      if (res.ok) {
        res.json().then((user: UserType) => { setUser(user); setIsLoggedIn(true) });
      } else {
        setUser(undefined);
        posts.clear();
        likes.clear();
        setIsLoggedIn(false);
      }
    })
  }

  createEffect(() => {
    let user_obj = user();
    if (user_obj === undefined) {
      return;
    }

    fetch(`/api/users/${user_obj.username}/posts`).then((res) => {
      if (res.ok) {
        res.json().then((res_posts: PostType[]) => {
          res_posts.forEach((p) => posts.set(p.id, p));
        })
      }
    })

    fetch(`/api/users/${user_obj.username}/likes`).then((res) => {
      if (res.ok) {
        res.json().then((res_posts: PostType[]) => {
          res_posts.forEach((p) => likes.set(p.id, p));
        })
      }
    })

    fetch(`/api/users/${user_obj.username}/following`).then(res => {
      if (res.ok) {
        res.json().then((res_users: UserType[]) => res_users.forEach(u => { following.set(u.id, u) }))
      }
    })
  })

  onMount(() => {
    getCurrentUser();
  })

  let value = {
    user: user,
    setUser: setUser,
    posts: posts,
    likes: likes,
    following: following,
    isLoggedIn: isLoggedIn,
    setIsLoggedIn: setIsLoggedIn,
    updateUser: getCurrentUser,
  };

  return (
    <div class="h-screen w-full bg-black text-white">
      <StoreProvider>
        <PopUpProvider>
          <UserProvider value={value}>
            <Routes>
              <Route path="/" component={Home}>
                <Route path="/" component={isLoggedIn() ? Feed : Global} />
                <Route path="/users/:username" component={User} />
                <Route path="/feed" component={Feed} />
                <Route path="/global" component={Global} />
                <Route path="/posts/:id" component={PostPage} />
              </Route>
            </Routes>
            <PopUp />
          </UserProvider>
        </PopUpProvider>
      </StoreProvider>
    </div>
  );
};

export default App;
