import { createBrowserRouter } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Profile } from '../pages/Profile';
import { Explore } from '../pages/Explore';
import { Login } from '../pages/Login';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/explore',
    element: <Explore />
  },
  {
    path: '/profile/:id',
    element: <Profile />
  }
]);
