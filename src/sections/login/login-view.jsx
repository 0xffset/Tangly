/* eslint-disable react/prop-types */
import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LoginView({handleLoginSubmit}) {
  const theme = useTheme();

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [formValues, setFormValues] = useState({
    email: "",
    password: ""
  });
  const handleInputChangedLogin = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleClick = async () => {
    await axios.post('http://localhost:8080/auth/login', {
      email: formValues.email,
      password: formValues.password
    })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("auth_token", res.data.result.access_token);
          localStorage.setItem("auth_token_type", res.data.result.token_type);
          handleLoginSubmit();
          router.push('/');
        }
      })
      .catch((res) => {
        setAlertMessage(res.response.data.detail)
        setOpenAlert(true);
      })
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email" required
          onChange={handleInputChangedLogin}
        />
        <TextField
          name="password"
          label="Password"
          required
          onChange={handleInputChangedLogin}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover">
         Forgot your password?
        </Link>
      </Stack>
      <Box sx={{ width: '100%' }}>
        <Collapse in={openAlert}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpenAlert(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {alertMessage}
          </Alert>
        </Collapse>
      </Box>
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
      >
        Log in
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Log in on Tangly</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Do not have account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }} to="/register" >
             Register
            </Link>
          </Typography>
          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
