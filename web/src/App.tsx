import { Route, Routes } from '@solidjs/router';
import { Component, lazy } from 'solid-js';
import Feed from './pages/Feed';

const Home = lazy(() => import("./pages/Home"));
const User = lazy(() => import("./pages/User"));
const Post = lazy(() => import("./pages/Post"));
const Login = lazy(() => import("./pages/Login"));

const App: Component = () => {
  return (
    <div class="h-screen w-full bg-black">
      <Routes>
        <Route path="/" component={Home}>
          <Route path="/" component={Feed} />
          <Route path="/:username" component={User} />
        </Route>
        <Route path="/posts/:id" component={Post} />
        <Route path="/login" component={Login} />
      </Routes>
    </div>
  );
};

export default App;
