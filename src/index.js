import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
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
    element: <Layout />, // Layout 컴포넌트를 루트 경로에 사용
    children: [
      {
        path: "/joke", // /joke 경로에 Joke 컴포넌트 연결
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
  {
    path: "/index", // 루트 경로에 App 컴포넌트 연결
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);

reportWebVitals();
