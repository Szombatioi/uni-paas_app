"use client";
import { useSnackbar } from "@/app/contexts/snackbar-provider";
import { Box, Button, Container, Link, Paper, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function RegisterPage() {
    const { t } = useTranslation("common");

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");

    const { showMessage } = useSnackbar();

    const handleRegister = () => {
        if (firstName.length === 0) {
            showMessage(t("first_name_required"));
            return;
        }
        if (lastName.length === 0) {
            showMessage(t("last_name_required"));
            return;
        }
        if (email.length === 0) {
            showMessage(t("email_required"));
            return;
        }
        if (password.length === 0) {
            showMessage(t("password_required"));
            return;
        }
        if (passwordAgain.length === 0) {
            showMessage(t("password_again_required"));
            return;
        }
        if (password !== passwordAgain) {
            showMessage(t("passwords_do_not_match"));
            return;
        }

        //TODO: call axios register function
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: (theme) => theme.palette.grey[100],
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={4}
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 3
                    }}
                >
                    <Typography component="h1" variant="h5" fontWeight="bold">
                        {/* {t('login')} */}
                        Regisztráció
                    </Typography>

                    <Box component="form" sx={{ mt: 3, width: '100%' }}>

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="firstName"
                            // label={t('password')}
                            label="Vezetéknév"
                            type="text"
                            id="firstName"
                            autoComplete="first-name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="lastName"
                            // label={t('password')}
                            label="Keresztnév"
                            type="text"
                            id="lastName"
                            autoComplete="last-name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            // label={t('email')}
                            label="Email-cím"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            // label={t('password')}
                            label="Jelszó"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            // label={t('password')}
                            label="Jelszó újra"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={passwordAgain}
                            onChange={(e) => setPasswordAgain(e.target.value)}
                        />



                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, mb: 2, py: 1.5, textTransform: 'none', fontSize: '1.1rem' }}
                            onClick={() => handleRegister()}
                        >
                            {/* {t('login')} */}
                            Regisztráció
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 1 }}>
                            <Link href="/auth/login" variant="body2" underline="hover">
                                {/* {t('no_account_q')} {t('sign_up')} */}
                                Már van fiókod? Bejelentkezés
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}