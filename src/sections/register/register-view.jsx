import axios from 'axios';
import { useState, useCallback } from 'react';

import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function RegisterView() {
  const theme = useTheme();


  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeated, setShowPasswordRepeated] = useState(false);
  const initialValidationState = [true, ''];

  const handleClick = async () => {


    await axios.post('http://localhost:8080/auth/register', {
      email: formValues.email,
      first_name: formValues.first_name,
      last_name: formValues.last_name,
      password: formValues.password
    })
      .then((res) => {
        if (res.status === 200) {
          window.location = "/login";
        }
      })
      .catch((res) => {
        setAlertMessage(res.response.data.detail)
        setOpenAlert(true);
      })

  };
  const [isValidFirstName, setIsValidFirstName] = useState(initialValidationState);
  const [isValidRepeatPassword, setValidRepeatPassword] = useState(initialValidationState);
  const [isValidEmail, setIsValidEmail] = useState(initialValidationState);

  const [message, setMessage] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [formValues, setFormValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    repeat_password: "",
  });

  const checkEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleRepeatPassword = useCallback((passwordValue) => {
    const isValid = passwordValue.trim().length > 0 && passwordValue.trim() === formValues.password.trim();
    setValidRepeatPassword([isValid, isValid ? 'Contraseñas coinciden.' : 'Contraseñas no coinciden.']);
    //  setFormValues((prev) => ({ ...prev, repeatPassword: passwordValue }));
  }, [formValues.password]);


  const updateRepeatStatusPassword = useCallback((passwordValue) => {
    const isValid = passwordValue.trim().length > 0 && formValues.repeat_password.trim() === passwordValue.trim();
    setValidRepeatPassword([isValid, isValid ? 'Contraseñas coinciden.' : 'Contraseñas no coinciden.']);
  }, [formValues.repeat_password]);

  const handlePassword = useCallback((passwordValue) => {
    const strengthChecks = {
      length: 0,
      hasUpperCase: false,
      hasLowerCase: false,
      hasDigit: false,
      hasSpecialChar: false,
    };

    strengthChecks.length = passwordValue.length >= 8;
    strengthChecks.hasUpperCase = /[A-Z]+/.test(passwordValue);
    strengthChecks.hasLowerCase = /[a-z]+/.test(passwordValue);
    strengthChecks.hasDigit = /[0-9]+/.test(passwordValue);
    strengthChecks.hasSpecialChar = /[^A-Za-z0-9]+/.test(passwordValue);

    const verifiedList = Object.values(strengthChecks).filter((value) => value);


    let strength = "";
    if (verifiedList.length === 5) {
      strength = "Strong";
    } else if (verifiedList.length >= 2) {
      strength = "Medium"
    }
    else {
      strength = 'Weak';
    }

    setMessage(strength);

    // Actualizar estado de la repetida
    updateRepeatStatusPassword(passwordValue);

  }, [updateRepeatStatusPassword]);



  const getActiveColor = (type) => {
    if (type === "Strong") return "success";
    if (type === "Medium") return "warning";
    return "error";
  };


  const submitRegister = async () => {
    // Validate FirstName
    if (formValues.first_name.trim() === '') {
      setIsValidFirstName([false, 'El nombre no puede estar vacío.']);
    } else if (formValues.first_name.trim().length < 6) {
      setIsValidFirstName([false, 'El nombre debe tener al menos 6 caracteres.']);
    } else {
      setIsValidFirstName(initialValidationState);
    }

    // Validate Email
    if (formValues.email.trim() === '') {
      setIsValidEmail([false, 'El correo no puede estar vacío']);
    } else if (!checkEmail(formValues.email.trim())) {
      setIsValidEmail([false, 'El correo no es válido']);
    } else {
      setIsValidEmail(initialValidationState);
    }
    if (isValidEmail[0] && isValidFirstName[0] && isValidRepeatPassword[0]) {
      await handleClick();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'repeat_password') {
      handleRepeatPassword(value);
    }
    if (name === 'password') {
      handlePassword(value);
    }
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: value,
    }));
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField
          onChange={handleInputChange}
          required
          name="first_name"
          label="First Name"
          value={formValues.first_name}
          helperText={isValidFirstName[1]}
          error={!isValidFirstName[0]}
        />
        <TextField name="last_name"
          value={formValues.last_name}
          onChange={handleInputChange}
          label="Last Name" />
        <TextField required
          onChange={handleInputChange}
          error={!isValidEmail[0]}
          helperText={isValidEmail[1]}
          value={formValues.email}
          name="email" label="Email" />
        <TextField required focused={formValues.password.trim().length > 0}
          name="password"
          value={formValues.password}
          onChange={handleInputChange}
          label="Password"
          type={showPassword ? 'text' : 'password'}
          helperText={message}
          color={getActiveColor(message)}
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

        <TextField required focused={formValues.repeat_password.trim().length > 0}
          name="repeat_password"
          label="Repeat Password"
          value={formValues.repeat_password}
          onChange={handleInputChange}
          helperText={isValidRepeatPassword[1]}
          color={isValidRepeatPassword[0] ? 'success' : 'error'}
          type={showPasswordRepeated ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPasswordRepeated(!showPasswordRepeated)} edge="end">
                  <Iconify icon={showPasswordRepeated ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }} />
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
        onClick={submitRegister}
      >
        Register
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
          <Typography variant="h4">Registrarse en Tangly</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Ya tienes cuenta?
            <Link variant="subtitle2" sx={{ ml: 0.5 }}>
              <a href='/login'>Inicial</a>
            </Link>
          </Typography>
          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
