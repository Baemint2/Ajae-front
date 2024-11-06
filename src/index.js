import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { UserProvider } from './jsx/UserContext';
import './css/index.css';
import './css/joke.css';
import './css/common.css';
import './css/layout.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Layout from './jsx/layout';
import Joke from './jsx/Joke';
import Login from './jsx/Login';
import AddJoke from './jsx/AddJoke';
import UserJoke from './jsx/UserJoke';
import UserJokeDetail from "./jsx/UserJokeDetail";
import MyPage from './jsx/MyPage';

const router = createBrowserRouter([
  {
    path: "",
    element: <Navigate to="/index" replace={true} />, // 루트 경로에서 /index로 리디렉트
  },
  {
    path: "/index",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/joke",
        element: <Joke />,
      },
      {
        path: "/addJoke",
        element: <AddJoke />
      },
      {
        path: "/userJoke",
        element: <UserJoke />
      },
      {
        path: "/userJoke/:id",
        element: <UserJokeDetail />
      },
      {
        path: "/myPage",
        element: <MyPage />
      }
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
);

reportWebVitals();
