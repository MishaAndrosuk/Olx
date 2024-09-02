import React from "react";
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

const SignUp = () => {
    const validationSchema = Yup.object({
        email: Yup.string()
            .required("Пошта обов'язкова")
            .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Невірний формат пошти"),
        password: Yup.string()
            .required("Вкажіть пароль")
            .min(6, "Мінімальна довжина паролю 6 символів"),
        firstName: Yup.string().required("Вкажіть своє ім'я"),
        lastName: Yup.string().required("Вкажіть своє прізвище"),
    });

    const navigate = useNavigate();
    const { signUp } = useAction();

    const submitHandler = (values) => {
        localStorage.setItem("firstName", values.firstName);
        localStorage.setItem("lastName", values.lastName);
        localStorage.setItem("email", values.email);
        localStorage.setItem("password", values.password);
        localStorage.setItem("isAuthSuccess", "true");

        navigate("/");
    };

    const googleSuccessHandler = (credentials) => {
        const token = credentials.credential;
        signUp(token);
        const user = jwtDecode(token);
        localStorage.setItem("user", token);
        localStorage.setItem("isAuthSuccess", "true");
        localStorage.setItem("firstName", user.given_name);
        navigate("/");
    };

    const googleErrorHandler = () => {
        console.log("Google auth error");
    };

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
        },
        onSubmit: submitHandler,
        validationSchema: validationSchema,
    });

    return (
        <Container component="main" maxWidth="xs" sx={{ mb: 4 }}>
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
                    Реєстрація
                </Typography>
                <Box
                    component="form"
                    noValidate
                    sx={{ mt: 3 }}
                    onSubmit={formik.handleSubmit}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="Ім'я"
                                autoFocus
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.firstName && formik.errors.firstName ? (
                                <div style={{ color: "red" }}>{formik.errors.firstName}</div>
                            ) : null}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Прізвище"
                                name="lastName"
                                autoComplete="family-name"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.lastName && formik.errors.lastName ? (
                                <div style={{ color: "red" }}>{formik.errors.lastName}</div>
                            ) : null}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Адреса електронної пошти"
                                name="email"
                                autoComplete="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div style={{ color: "red" }}>{formik.errors.email}</div>
                            ) : null}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Пароль"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.password && formik.errors.password ? (
                                <div style={{ color: "red" }}>{formik.errors.password}</div>
                            ) : null}
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Зареєструватися
                    </Button>
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
                            <Link to="/signin">Вже є акаунт? Увійти</Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default SignUp;
