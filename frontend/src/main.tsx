// filepath: /home/enguerranca/Sae401DockerBase/frontend/src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./routes/root";
import Home from "./routes/home";
import Login from "./routes/login";
import Verify from "./routes/verify";
import Admin from "./routes/admin";

import ProtectedRoute from "./components/ProtectedRoute";

import "./index.css";
import SignIn from "./routes/signin";
import ProfileEditor from "./components/Dashboard/ProfileEditor";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      }

    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "signin",
    element: <SignIn />,
  },
  {
    path: "verify",
    element: <Verify />,
  },
  {
    path: "admin",
    element: (
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "edit/:username",
        element: (
          <ProtectedRoute>
            <ProfileEditor />
          </ProtectedRoute>
        ),
      },
    ]
  }
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