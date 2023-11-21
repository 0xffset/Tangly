import { HEADER, NAV } from '../../layouts/dashboard/config-layout';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import { bgBlur } from 'src/theme/css';
import { useResponsive } from 'src/hooks/use-responsive';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function HeaderHome({ onOpenNav }) {
    const theme = useTheme();

    const lgUp = useResponsive('up', 'lg');

    const renderContent = (
        <>
           
            <Box sx={{ flexGrow: 1 }} />

            <Stack direction="row" alignItems="center" spacing={1}>
                <Button href='/login' style={{ textTransform: 'none', color: 'black', variant: 'raised', backgroundColor: 'transparent' }}>Iniciar</Button>
                <Button style={{ textTransform: 'none', color: 'black', variant: 'raised', backgroundColor: 'transparent' }}>Registrar</Button>
            </Stack>
        </>
    );

    return (
        <AppBar
            sx={{
                boxShadow: 'none',
                height: HEADER.H_MOBILE,
                zIndex: theme.zIndex.appBar + 1,
                ...bgBlur({
                    color: theme.palette.background.default,
                }),
                transition: theme.transitions.create(['height'], {
                    duration: theme.transitions.duration.shorter,
                }),
                ...(lgUp && {
                    width: `calc(100% - ${NAV.WIDTH + 1}px)`,
                    height: HEADER.H_DESKTOP,
                }),
            }}
        >
            <Toolbar
                sx={{
                    height: 1,
                    px: { lg: 5 },
                }}
            >
                {renderContent}
            </Toolbar>
        </AppBar>
    );
}

HeaderHome.propTypes = {
    onOpenNav: PropTypes.func,
};
