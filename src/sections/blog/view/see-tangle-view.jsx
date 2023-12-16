/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import JsonView from 'react18-json-view'
import 'react18-json-view/src/style.css'
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';




// ----------------------------------------------------------------------


export default function SeeTangleView() {
  const [tangle, setTangle] = useState([]);
  const API_URL = import.meta.env.VITE_ENVIRONMENT === "development" ? import.meta.env.VITE_SERVER_DEVELOPMENT : import.meta.env.VITE_SERVER_PRODUCTION

  useEffect(() => {
    const auth_token = localStorage.getItem("auth_token");
    const auth_token_type = localStorage.getItem("auth_token_type");
    const token = `${auth_token_type} ${auth_token}`;
    axios.get(`${API_URL}tangle/`, {
      headers: { Authorization: token },
    }).then((res) => {
      setTangle(res.data.result)
    })

  }, [API_URL])
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Tangle</Typography>

        {/* <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          New Post
        </Button> */}
      </Stack>

      <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
        <JsonView src={JSON.parse(JSON.stringify(tangle))} collapsed={100}
          collapseStringMode="word"
          collapseStringsAfterLength={10} theme="default" />

      </Stack>


    </Container>
  );
}
