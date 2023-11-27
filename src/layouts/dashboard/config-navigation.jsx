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
    path: '/decrypt',
    icon: icon('ic_cart'),
  },
  {
    title: 'See Tangle',
    path: '/tangle',
    icon: icon('ic_blog'),
  },
  {
    title: 'See Peers',
    path: '/peers',
    icon: icon('ic_lock'),
  },
];

export default navConfig;
