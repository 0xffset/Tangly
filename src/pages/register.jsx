import { Helmet } from 'react-helmet-async';

import RegisterView from 'src/sections/register/register-view';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> Tangly | Register </title>
      </Helmet>

      <RegisterView />
    </>
  );
}
