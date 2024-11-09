import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import Login from './components/login';
import Dashboard from './components/dashboard/index';
import Signup from './components/signup';
import Home from './components/home';
<<<<<<< HEAD
import { ServerUserProvider } from './contextStore/serverUserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/',
    element: <Home />
  }
])

root.render(
  <React.StrictMode>
    <ServerUserProvider>
      <RouterProvider router={router} />
    </ServerUserProvider>
  </React.StrictMode>
=======

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login/>
    },
    {
        path: '/signup',
        element: <Signup/>
    },
    {
        path: '/dashboard',
        element: <Dashboard/>
    },
    {
        path: '/',
        element: <Home/>
    }
])

root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
>>>>>>> 98b07dae4ed558aa996c40d49659db9db3b1a158
);

reportWebVitals();
