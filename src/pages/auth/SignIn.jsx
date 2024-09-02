import React, { useState } from "react";
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Grid,
    Box,
    Typography,
    Container,
    Divider,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { GoogleLogin } from "@react-oauth/google";
import { useAction } from "../../hooks/useAction";
import { jwtDecode } from "jwt-decode";

const SignIn = () => {
    const [error, setError] = useState("");
    const { signIn } = useAction();
    const navigate = useNavigate();

    const handleSubmit = (values) => {
        const storedEmail = localStorage.getItem("email");
        const storedPassword = localStorage.getItem("password");
        
        if (values.email === storedEmail) {
            if (values.password === storedPassword) {
                localStorage.setItem("isAuthSuccess", "true")
                navigate("/");
            } else {
                setError("Невірний пароль");
            }
        } else {
            setError("Користувача не існує");
        }
    };

    const googleSuccessHandler = (credentials) => {
        const token = credentials.credential;
        signIn(token);
        const user = jwtDecode(token);
        localStorage.setItem("user", token);
        localStorage.setItem("isAuthSuccess", "true");
        localStorage.setItem("firstName", user.given_name);
        navigate("/");
    };

    const googleErrorHandler = () => {
        console.log("Google auth error");
    };

    const validationSchema = Yup.object({
        email: Yup.string()
            .required("Пошта обов'язкова")
            .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Невірний формат пошти"),
        password: Yup.string()
            .required("Вкажіть пароль")
            .min(6, "Мінімальна довжина паролю 6 символів"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: handleSubmit,
        validationSchema: validationSchema,
    });

    return (
        <Container component="main" maxWidth="xs" sx={{ mb: 10 }}>
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Вхід
                </Typography>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Адреса електронної пошти"
                        name="email"
                        autoComplete="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Пароль"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Увійти
                    </Button>
                    {error && (
                        <Typography color="error" variant="body2" align="center">
                            {error}
                        </Typography>
                    )}
                    <Divider>
                        <Typography variant="body2">чи</Typography>
                    </Divider>
                    <Box sx={{ mt: 2, mb: 2 }}>
                        <GoogleLogin
                            size="large"
                            width="400px"
                            onSuccess={googleSuccessHandler}
                            onError={googleErrorHandler}
                        />
                    </Box>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link to="/signup">Ще немає акаунта? Зареєструватися</Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default SignIn;
