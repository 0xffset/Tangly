import { Helmet } from 'react-helmet-async';

import SeeTangleView from 'src/sections/blog/view/see-tangle-view';
// ----------------------------------------------------------------------

export default function SeeTanglePage() {
  return (
    <>
      <Helmet>
        <title> Tangly | See Tangle </title>
      </Helmet>

      <SeeTangleView />
    </>
  );
}
