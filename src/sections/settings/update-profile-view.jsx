import { TextField, Button, Card, Grid, Typography, Container } from "@mui/material";
import { Box, Stack } from "@mui/system";
import react, { useEffect, useState } from "react";
import Iconify from 'src/components/iconify/iconify';

export default function UpdateProfileView() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [repatPassword, setRepeatPassword] = useState('')
    const [imgProfile, setImgProfile] = useState(null);

    function handleUpdateProfile(event) {
        event.prevenDefault();
    }
    return (
        <><Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4">Update profile</Typography>
            <Button variant="contained" color="inherit" startIcon={<Iconify icon="mdi:decrypted" />}>
                Update
            </Button>
        </Stack>
        
       <Grid spacing={4}>
       <Card sx={{
            p: 5,
            maxWidth: 1000,
        }}>
                <Stack sx={{ height: 1 }}>
                    <form onSubmit={handleUpdateProfile}>
                        <Stack spacing={3} direction="row" sx={{ marginButton: 4 }}>
                            <TextField
                                type="text"
                                label="First name"
                                onChange={e => setFirstName(e.target.value)}
                                fullWidth />
                            <TextField
                                type="text"
                                label="Last name"
                                onChange={e => setLastName(e.target.value)}
                                fullWidth />
                        </Stack>
                        <TextField
                            type="email"
                            label="Email"
                            onChange={e => setEmail(e.target.value)}
                            fullWidth />
                        <Stack spacing={2} direction="row" sx={{ marginButton: 4 }}>
                            <TextField
                                type="password"
                                label="Password"
                                onChange={e => setPassword(e.target.value)}
                                fullWidth />
                            <TextField
                                type="password"
                                label="Repat Password"
                                onChange={e => setRepeatPassword(e.target.value)}
                                fullWidth />
                        </Stack>
                        <input
                            type="file"
                            onChange={(event) => setImgProfile(event.target.files[0])} />
                    </form>
                </Stack>
            </Card>
       </Grid>
            
            </>



    )
}