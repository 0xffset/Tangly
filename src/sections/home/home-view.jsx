import * as React from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import GraphSimulation from './dag';
import HeaderHome from './header_home';
import Link from '@mui/material/Link';
import NET from 'vanta/src/vanta.net';
import Typography from '@mui/material/Typography';

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary">
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Tangly
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function HomeView() {
    React.useEffect(() => {
        NET({
            el: "#vanta",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x0,
            backgroundColor: 0xd6d6e1,
            maxDistance: 21.00,
            spacing: 13.00
        })
    }, [])
    const ref = React.useRef(null);
    const handleClick = () => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    }
    return (
        <ThemeProvider theme={defaultTheme}>
            <HeaderHome onOpenNav={() => setOpenNav(true)} />
            <Box
                sx={{
                    paddingTop: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                }}
            >
                <GraphSimulation />
                <CssBaseline />

                <Box display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="100vh">

                    <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
                        <Typography
                            component="h1"
                            variant="h2"
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >
                            Tangly
                        </Typography>
                        <Typography variant="h5" align="center" color="text.secondary" component="p">
                            Solución segura y escalable para transacciones descentralizadas. ¡Únete a la revolución tecnológica!
                        </Typography>
                        <Box textAlign='center'>
                            <Button variant='text' style={{ backgroundColor: 'transparent', color: 'black', textTransform: 'none' }} onClick={handleClick}>
                                Continuar
                            </Button>
                        </Box>
                    </Container>
                </Box>

                <Box ref={ref} display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="100vh">
                    <Container disableGutters maxWidth='md' component="main" sx={{ pt: 8, pb: 6 }}>
                        <Typography tyle={{ textAlign: 'center', color: "#333"}} variant="h3">
                           Tangle.
                        </Typography>
                        <Typography style={{ fontSize: '1.25rem', lineHeight: '1.6', color: '#333', margin: '1.5rem 0' }} variant="h5" color="text.secondary" component="p">
                            En el contexto de la red Tangle, que es la tecnología subyacente a IOTA (una criptomoneda diseñada para la Internet de las cosas), los "peers" se refieren a los nodos individuales que participan en la red. Cada nodo en la red Tangle es un "par" (peer) que puede enviar, recibir y validar transacciones.
                            A diferencia de algunas otras criptomonedas basadas en cadenas de bloques, en la red Tangle, no hay bloques ni mineros.
                        </Typography>
                        <Box sx={{ m: 2 }} />
                        <Typography style={{ fontSize: '1.25rem', lineHeight: '1.6', color: '#333', margin: '1.5rem 0' }} variant="h5" color="text.secondary" component="p">
                            En lugar de una cadena de bloques, la red Tangle utiliza una estructura gráfica acíclica dirigida (DAG, por sus siglas en inglés)
                            en la que cada transacción se conecta directamente con dos transacciones anteriores. Cuando un usuario quiere enviar una transacción, primero valida dos transacciones anteriores y agrega la suya al Tangle. Este enfoque descentralizado y sin bloques permite un mayor paralelismo y escalabilidad.
                        </Typography>
                    </Container>
                </Box>
                <Box
                    component="footer"
                    sx={{
                        py: 3,
                        px: 2,
                        mt: 'auto',
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[200]
                                : theme.palette.grey[800],
                    }}
                >
                    <Container maxWidth="sm">
                        <Typography variant="body1">
                            Tangly
                        </Typography>
                        <Copyright />
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}