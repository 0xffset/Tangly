import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DecryptFilePage from 'src/pages/decry-file';
import DashboardLayout from 'src/layouts/dashboard';

import PrivateRouter from 'src/sections/privateRouter/privateRouter';
import PrivateRouterLoginRegister from 'src/sections/privateRouter/PrivateRouterLoginRegister';
import UpdateProfilePage from 'src/pages/update-profile';

export const IndexPage = lazy(() => import('src/pages/app'));
export const SeeTanglePage = lazy(() => import('src/pages/seeTangle'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const HomePage = lazy(() => import('src/pages/home'))
export const RegisterPage = lazy(() => import('src/pages/register'))
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router({ isAuthenticated, user, handleLoginSubmit }) {

  const routes = useRoutes([
    {
      element: (
        <DashboardLayout user={user}>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          element:
            <PrivateRouter component={<IndexPage />} isAuthenticated={isAuthenticated} />
          , index: true
        },
        { path: 'user', element: <PrivateRouter component={<UserPage />} isAuthenticated={isAuthenticated} /> },
        { path: 'peers', element: <PrivateRouter component={<ProductsPage />} isAuthenticated={isAuthenticated} /> },
        { path: 'tangle', element: <PrivateRouter component={<SeeTanglePage />} isAuthenticated={isAuthenticated} /> },
        { path: 'decrypt', element: <PrivateRouter component={<DecryptFilePage />} isAuthenticated={isAuthenticated} /> },
        { path: 'profile', element: <UpdateProfilePage/> }
      ],
    },
    {
      path: 'register',
      element: <PrivateRouterLoginRegister component={<RegisterPage />} isAuthenticated={isAuthenticated} />
    },
    {
      path: 'home',
      element: <HomePage />,
    },
    {
      path: 'login',
      element: <PrivateRouterLoginRegister component={<LoginPage handleLoginSubmit={handleLoginSubmit} />} isAuthenticated={isAuthenticated} />

    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
