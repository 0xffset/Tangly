import * as React from 'react';
import NET from 'vanta/src/vanta.net';

import Link from '@mui/material/Link';
import { Box, Button } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import GraphSimulation from './dag';
import HeaderHome from './header_home';

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary">
            {'Copyright © '}
            <Link color="inherit" href="/">
                Tangly
            </Link>{' '}
            {new Date().getFullYear()}
            .
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
            <HeaderHome  />
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
                        Secure and scalable solution for decentralized transactions. Join to the tech revolution!
                        </Typography>
                        <Box textAlign='center'>
                            <Button variant='text' style={{ backgroundColor: 'transparent', color: 'black', textTransform: 'none' }} onClick={handleClick}>
                                Continue
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
                        In the context of the Tangle network, which is the technology underlying IOTA (a cryptocurrency designed for the Internet of Things), peers refer to the individual nodes participating in the network. Each node in the Tangle network is a peer that can send, receive and validate transactions.
                            Unlike some other blockchain-based cryptocurrencies, on the Tangle network, there are no blocks or miners.
                        </Typography>
                        <Box sx={{ m: 2 }} />
                        <Typography style={{ fontSize: '1.25rem', lineHeight: '1.6', color: '#333', margin: '1.5rem 0' }} variant="h5" color="text.secondary" component="p">
                        Instead of a blockchain, the Tangle network uses a directed acyclic graph (DAG) structure.
                            in which each transaction is directly connected to two previous transactions. When a user wants to submit a transaction, they first validate two previous transactions and add their own to the Tangle. This decentralized, blockless approach allows for greater parallelism and scalability.
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