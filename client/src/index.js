import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter, createBrowserRouter, RouterProvider} from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import Login from "./pages/Login/Login";
import Dashboard from './components/dashboard/index';
import Signup from './components/signup';
import Home from './components/home';
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
      element:<Dashboard/>
    },
    {
        path:'/',
        element:<Home/>
    }
])

root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
