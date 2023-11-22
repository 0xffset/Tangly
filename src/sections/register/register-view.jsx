import { alpha, useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import LoadingButton from '@mui/lab/LoadingButton';
import Logo from 'src/components/logo';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { bgGradient } from 'src/theme/css';
import { useRouter } from 'src/routes/hooks';
import { useState, useCallback } from 'react';

// ----------------------------------------------------------------------

export default function RegisterView() {
  const theme = useTheme();

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeated, setShowPasswordRepeated] = useState(false);
  const initialValidationState = [true, ''];
  
  const handleClick = () => {
    router.push('/register');
  };
  const [isValidFirstName, setIsValidFirstName] = useState(initialValidationState);
  const [isValidRepeatPassword, setValidRepeatPassword] = useState(initialValidationState);
  const [isValidEmail, setIsValidEmail] = useState(initialValidationState);

  const [message, setMessage] = useState("");

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const checkEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleRepeatPassword = useCallback((passwordValue) => {
    const isValid = passwordValue.trim().length > 0 && passwordValue.trim() === formValues.password.trim();
    setValidRepeatPassword([isValid, isValid ? 'Contraseñas coinciden.' : 'Contraseñas no coinciden.']);
    //  setFormValues((prev) => ({ ...prev, repeatPassword: passwordValue }));
  }, [formValues.password]);


  const updateRepeatStatusPassword = useCallback((passwordValue) => {
    const isValid = passwordValue.trim().length > 0 && formValues.repeatPassword.trim() === passwordValue.trim();
    setValidRepeatPassword([isValid, isValid ? 'Contraseñas coinciden.' : 'Contraseñas no coinciden.']);
  }, [formValues.repeatPassword]);

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
      strength = "La constraseña es fuerte.";
    } else if (verifiedList.length >= 2) {
      strength = "La constraseña es regular."
    }
    else {
      strength = 'La constraseña es débil.';
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


  const submitRegister = () => {
    // Validate FirstName
    if (formValues.firstName.trim() === '') {
      setIsValidFirstName([false, 'El nombre no puede estar vacío.']);
    } else if (formValues.firstName.trim().length < 6) {
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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'repeatPassword') {
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
          name="firstName"
          label="Nombre"
          value={formValues.firstName}
          helperText={isValidFirstName[1]}
          error={!isValidFirstName[0]}
        />
        <TextField name="lastName"
          value={formValues.lastName}
          onChange={handleInputChange}
          label="Apellido" />
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
          label="Contraseña"
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

        <TextField required focused={formValues.repeatPassword.trim().length > 0}
          name="repeatPassword"
          label="Repetir contraseña"
          value={formValues.repeatPassword}
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

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={submitRegister}
      >
        Registrarse
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
