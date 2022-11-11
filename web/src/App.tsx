import { Route, Routes } from '@solidjs/router';
import { Component, lazy } from 'solid-js';

const Home = lazy(() => import("./pages/Home"));
const User = lazy(() => import("./pages/User"));
const Post = lazy(() => import("./pages/Post"));
const Login = lazy(() => import("./pages/Login"));

const App: Component = () => {
  return (
    <>
      <h1>My Site with Lots of Pages</h1>
      <Routes>
        <Route path="/" component={Home} />
        <Route path="/:id" component={User} />
        <Route path="posts/:id" component={Post} />
        <Route path="/login" component={Login} />
      </Routes>
    </>
  );
};

export default App;
