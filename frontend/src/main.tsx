// filepath: /home/enguerranca/Sae401DockerBase/frontend/src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./routes/root";
import Home from "./routes/home";
import Login from "./routes/login";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      // {
      //   path: "team/:teamName",
      //   element: <TeamPage />,
      //   loader: teamLoader
      // },
      // {
      //   path: "crash",
      //   element: <Crash />
      // }
    ],
  },
]);

const rootElement = document.querySelector("#root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
} else {
  console.error("No root element found");
}