import { AppView } from 'src/sections/overview/view';
import { Helmet } from 'react-helmet-async';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Tangly </title>
      </Helmet>

      <AppView />
    </>
  );
}
