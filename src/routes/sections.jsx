import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DecryptFilePage from 'src/pages/decry-file';
import DashboardLayout from 'src/layouts/dashboard';

import PrivateRouter from 'src/sections/privateRouter/privateRouter';
import PrivateRouterLoginRegister from 'src/sections/privateRouter/PrivateRouterLoginRegister';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const HomePage = lazy(() => import('src/pages/home'))
export const RegisterPage = lazy(() => import('src/pages/register'))
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          element:
            <PrivateRouter children={<IndexPage />} />
          , index: true
        },
        { path: 'user', element: <PrivateRouter children={<UserPage />} /> },
        { path: 'products', element: <PrivateRouter children={<ProductsPage />} /> },
        { path: 'blog', element: <PrivateRouter children={<BlogPage />} /> },
        {path: 'decrypt', element: <PrivateRouter children={<DecryptFilePage/>} />},
      ],
    },
    {
      path: 'register',
      element: <PrivateRouterLoginRegister children={<RegisterPage />} />
    },
    {
      path: 'home',
      element: <HomePage />,
    },
    {
      path: 'login',
      element: <PrivateRouterLoginRegister children={<LoginPage />} />

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
