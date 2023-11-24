import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'New Transaction',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Decrypt Files',
    path: '/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'See Tangle',
    path: '/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'See Peers',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
