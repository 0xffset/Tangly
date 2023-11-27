/* eslint-disable react/prop-types */
import { Helmet } from 'react-helmet-async';

import { LoginView } from 'src/sections/login';

// ----------------------------------------------------------------------

export default function LoginPage({handleLoginSubmit}) {
  return (
    <>
      <Helmet>
        <title> Tangly | Iniciar </title>
      </Helmet>

      <LoginView handleLoginSubmit={handleLoginSubmit} />
    </>
  );
}
