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
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function RegisterView() {
  const theme = useTheme();

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeated, setShowPasswordRepeated] = useState(false);

  const handleClick = () => {
    router.push('/register');
  };

  const [isValidFirstName, setIsValidFirstName] = useState([true, '']);
  const [isValidPassword, setIsValidPassword] = useState([true, '']);
  const [isValidRepeatPassword, setValidRepeatPassword] = useState([true, '']);
  const [isValidEmail, setIsValidEmail] = useState([true, '']);

  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState("");

  const [firstName, setFirstName] = useState('')
  const [LastName, setLastName] = useState('')
  const [Email, setEmail] = useState('')
  const [Password, setPassword] = useState('')
  const [RepeatPassword, setRepeatPassword] = useState('')

  const checkEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  }


  const handleRepeatPassword = (passwordValue) => {
    if (passwordValue.trim().length > 0 && passwordValue.trim() == Password.trim()) {
      setValidRepeatPassword([true, 'Constrasenas coincieden.'])

    }
    else {
      setValidRepeatPassword([false, 'Constrasenas no coincieden.'])
    }
    setRepeatPassword(passwordValue)
  }

  const updateRepeatStatusPassword = (passwordValue) => {
    if (passwordValue.trim().length > 0 && RepeatPassword.trim() === passwordValue.trim()) {
      setValidRepeatPassword([true, 'Constrasenas coincieden.'])
    }
    else {
      setValidRepeatPassword([false, 'Constrasenas no coincieden.'])
    }
  }

  const handlePassword = (passwordValue) => {
    const strengthChecks = {
      length: 0,
      hasUpperCase: false,
      hasLowerCase: false,
      hasDigit: false,
      hasSpecialChar: false,
    };

    strengthChecks.length = passwordValue.length >= 8 ? true : false;
    strengthChecks.hasUpperCase = /[A-Z]+/.test(passwordValue);
    strengthChecks.hasLowerCase = /[a-z]+/.test(passwordValue);
    strengthChecks.hasDigit = /[0-9]+/.test(passwordValue);
    strengthChecks.hasSpecialChar = /[^A-Za-z0-9]+/.test(passwordValue);

    let verifiedList = Object.values(strengthChecks).filter((value) => value);

    let strength =
      verifiedList.length == 5
        ? "Strong"
        : verifiedList.length >= 2
          ? "Medium"
          : "Weak";

    setPassword(passwordValue);
    setProgress(`${(verifiedList.length / 5) * 100}%`);
    setMessage(strength);

    // Actualizar estado de la repetida
    updateRepeatStatusPassword(passwordValue)

  }



  const getActiveColor = (type) => {
    if (type === "Strong") return "success";
    if (type === "Medium") return "warning";
    return "error";
  };


  const submitRegister = () => {
    // Validate FirstName
    if (firstName.trim() == '') {
      setIsValidFirstName([false, 'El nombre no puede estar vacio.'])
      console.log(isValidFirstName)
    } else if (firstName.trim().length < 6) {
      setIsValidFirstName([false, 'El nombre debe ser mayor a 6.'])
    }
    else {
      setIsValidFirstName([true, ''])
    }
    // Validate Email
    if (Email.trim() == '') {
      setIsValidEmail([false, 'El correo no puede estar vacio'])
    }
    else if (!checkEmail(Email.trim())) {
      setIsValidEmail([false, 'El correo no es valido'])
    }
    else {
      setIsValidEmail([true, ''])
    }

  }




  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField
          onChange={(e) => setFirstName(e.target.value)}
          required
          name="first_name"
          label="Nombre"
          value={firstName}
          helperText={isValidFirstName[1]}
          error={!isValidFirstName[0]}
        />
        <TextField name="last_name" label="Apellido" />
        <TextField required
          onChange={(e) => setEmail(e.target.value)}
          error={!isValidEmail[0]}
          helperText={isValidEmail[1]}
          value={Email}
          name="email" label="Email" />
        <TextField required focused={Password.trim().length > 0}
          name="password"
          value={Password}
          onChange={({ target }) => {
            handlePassword(target.value)
          }}
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

        <TextField required
          name="repeat_password"
          label="Repetir contraseña"
          value={RepeatPassword}
          onChange={({ target }) => {
            handleRepeatPassword(target.value)
          }}
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

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>

      </Stack>

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
