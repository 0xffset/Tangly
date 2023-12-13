import { Helmet } from 'react-helmet-async';

import SeeAllTransactionsView from 'src/sections/transactions/see-all-transcations';


// ----------------------------------------------------------------------

export default function SeeAlllTransactionsPage() {
  return (
    <>
      <Helmet>
        <title> Tangly | Transactions </title>
      </Helmet>

      <SeeAllTransactionsView />
    </>
  );
}
