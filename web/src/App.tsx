import { Route, Routes } from '@solidjs/router';
import { Component, createSignal, lazy, onMount } from 'solid-js';
import { PopUpProvider } from './contexts/popupcontext';
import { UserProvider } from './contexts/usercontext';
import { User as UserType } from './models/user';
import Feed from './pages/Feed';
import Global from './pages/Global';
import PopUp from './pages/PopUp';

const Home = lazy(() => import("./pages/Home"));
const User = lazy(() => import("./pages/User"));
const PostPage = lazy(() => import("./pages/PostPage"));

const App: Component = () => {
  const [user, setUser] = createSignal<UserType>()
  const [isLoggedIn, setIsLoggedIn] = createSignal(false)

  const getUser = (username: string) => {
    fetch("/api/users/" + username).then(res => {
      if (res.ok) {
        res.json().then((user: UserType) => { setUser(user); setIsLoggedIn(true) })
      }
    })
  }

  onMount(() => {
    getUser("@me")
  })

  let value = {
    user: user,
    setUser: setUser,
    isLoggedIn: isLoggedIn,
    setIsLoggedIn: setIsLoggedIn
  };

  return (
    <div class="h-screen w-full bg-black text-white">
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
        </UserProvider>
        <PopUp />
      </PopUpProvider>
    </div>
  );
};

export default App;
