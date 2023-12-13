import axios from "axios";
import { useState, useEffect } from "react";

import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import { Stack, Container } from "@mui/system";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Card, Grid, Button, TextField, Typography } from "@mui/material";

export default function UpdateProfileView() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        type: ''
    })

    const handleUpdateProfile = () => {
        const auth_token = localStorage.getItem("auth_token");
        const auth_token_type = localStorage.getItem("auth_token_type");
        const token = `${auth_token_type} ${auth_token}`;
        const updateUser = {
            "first_name": firstName,
            "last_name": lastName,
            "email": email,
            "password": password,
            "repeat_password": repeatPassword
        }
        axios.put("http://localhost:8080/users/update", updateUser, {
            headers: { Authorization: token }
        })
            .then((res) => {
                setAlert({ open: true, message: "Profile updated successfully.", type: "success" })
                console.log(res)
            })
            .catch((err) => {
                setAlert({ open: true, message: err.response.data.detail, type: "error" })
                console.error(err)
            })

    }
    useEffect(() => {
        const auth_token = localStorage.getItem("auth_token");
        const auth_token_type = localStorage.getItem("auth_token_type");
        const token = `${auth_token_type} ${auth_token}`;
        axios.get("http://localhost:8080/users", {
            headers: { Authorization: token },
        })
            .then((res) => {
                setFirstName(res.data.result.first_name);
                setLastName(res.data.result.last_name);
                setEmail(res.data.result.email);
            })
    }, [])

    return (
        <Container maxWidth="xl">
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Update profile</Typography>
                <Button variant="contained" color="inherit" onClick={handleUpdateProfile}>
                    Update
                </Button>
            </Stack>

            <Grid>
                <Collapse in={alert.open}>
                    <Alert
                        severity={alert.type}
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setAlert({ open: false, message: "", type: "" });
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                    >
                        {alert.message}
                    </Alert>
                </Collapse>
                <Card sx={{
                    p: 5,
                    maxWidth: 1000,
                }}>
                    <Stack sx={{ height: 1 }} spacing={3}>
                        <Stack spacing={4} direction="row" sx={{ marginButton: 4 }}>
                            <TextField
                                type="text"
                                label="First name"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                fullWidth />
                            <TextField
                                type="text"
                                label="Last name"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                fullWidth />
                        </Stack>
                        <TextField
                            type="email"
                            label="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            fullWidth />
                        <Stack spacing={3} direction="row" sx={{ marginButton: 4 }}>
                            <TextField
                                type="password"
                                label="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                fullWidth />
                            <TextField
                                type="password"
                                label="Repat Password"
                                value={repeatPassword}
                                onChange={e => setRepeatPassword(e.target.value)}
                                fullWidth />
                        </Stack>
                        <Typography variant="p" >Password field empty does not change the password. </Typography>
                    </Stack>
                </Card>
            </Grid>

        </Container>



    )
}