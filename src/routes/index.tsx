import { createBrowserRouter } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Profile } from '../pages/Profile';
import { Explore } from '../pages/Explore';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { MainLayout } from '../layouts/MainLayout';
import { TweetDetail } from '../pages/TweetDetail';
import { AuthLayout } from '../layouts/AuthLayout';

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'explore',
        element: <Explore />
      },
      {
        path: 'profile/:id',
        element: <Profile />
      },
      {
        path: 'tweet/:id',
        element: <TweetDetail />
      }
    ]
  }
]);
