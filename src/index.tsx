import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { UserProvider } from './tsx/UserContext';
import './css/index.css';
import './css/joke.css';
import './css/common.css';
import './css/layout.css';
import 'flowbite'
import App from './App';
import reportWebVitals from './reportWebVitals';
import Layout from './tsx/layout';
import Joke from './tsx/IJoke';
import Login from './tsx/Login';
import AddJoke from './tsx/AddJoke';
import UserJoke from './tsx/UserJoke';
import UserJokeDetail from "./tsx/UserJokeDetail";
import MyPage from './tsx/MyPage';
import Chat from "./tsx/Chat";

const router = createBrowserRouter([
  {
    path: "",
    element: <Navigate to="/index" replace={true} />,
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
      },
    ],
  },
  {
    path: "/chat",
    element: <Chat />
  }
]);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(rootElement);
root.render(
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
);

reportWebVitals();
