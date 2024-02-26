import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import { NewPrompt } from './routes/NewPrompt.tsx';
import { NotFound } from './routes/NotFound.tsx';
import { PromptPage } from './routes/PromptPage.tsx';
import { BrowsePrompts } from './routes/BrowsePrompts.tsx';
import { Home } from './routes/Home.tsx';
import { DeletePage } from './routes/DeletePage.tsx';
import { Login } from './routes/Login.tsx';
import { AdminDashboard } from './routes/AdminDashboard.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <div><Home></Home></div>,
  },
  {
    path: '/prompts',
    element: <div><BrowsePrompts></BrowsePrompts></div>,
  },
  {
    path: '/prompts/new',
    element: <div><NewPrompt></NewPrompt></div>,
  },
  {
    path: '/prompts/:id',
    element: <div><PromptPage></PromptPage></div>,
  },
  {
    path: '/prompts/:id/delete',
    element: <div><DeletePage></DeletePage></div>,
  },
  {
    path: '/login',
    element: <div><Login></Login></div>,
  },
  {
    path: '/admin',
    element: <div><AdminDashboard></AdminDashboard></div>,
  },
  {
    path: '/*',
    element: <div><NotFound></NotFound></div>,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
