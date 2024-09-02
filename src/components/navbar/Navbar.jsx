import React, { useEffect, useState } from "react";
import {
    AppBar,
    Button,
    Grid,
    Menu,
    MenuItem,
    Typography,
    Avatar,
    IconButton,
} from "@mui/material";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccountBoxIcon from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useSelector } from "react-redux";
import { useAction } from "../../hooks/useAction";
import { toast } from "react-toastify";

const pages = [
    { id: "1", title: "Головна сторінка", url: "/" },
];

const Navbar = () => {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const { isAuth, user } = useSelector((state) => state.authReducer);
    const { theme } = useSelector((state) => state.themingReducer);
    const { logout, setTheme } = useAction();
    const navigate = useNavigate();
    const isAuthSuccess = localStorage.getItem("isAuthSuccess")

    const logoutHandler = () => {
        handleCloseUserMenu();
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthSuccess");
        logout();
        navigate("signin");
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const changeTheme = () => {
        const value = theme === "light" ? "dark" : "light";
        setTheme(value);
        toast.success(`${value} theme`);
    };

    useEffect(() => {
        const themeLocal = localStorage.getItem("theme");
        if (themeLocal != null && themeLocal !== theme) {
            setTheme(themeLocal);
        }
    }, [theme, setTheme]);

    return (
        <AppBar position="static">
            <Grid container alignItems="center" sx={{ height: "100px" }}>
                <Grid item sx={{ display: "flex", alignItems: "center", paddingLeft: 2, flexGrow: 1 }}>
                    <IconButton component={Link} to="/" color="inherit">
                        <DirectionsCarIcon fontSize="large" />
                    </IconButton>
                    {pages.map((page) => (
                        <Link key={page.id} to={page.url}>
                            <Button sx={{ color: theme === "light" ? "black" : "white" }}>
                                {page.title}
                            </Button>
                        </Link>
                    ))}
                </Grid>
                <Grid item sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 2 }}>
                    <IconButton onClick={changeTheme} color="inherit" sx={{ marginRight: 2 }}>
                        {theme === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                    {!isAuthSuccess ? (
                        <>
                            <Link to="/signin">
                                <Button sx={{ color: theme === "light" ? "black" : "white" }}>Увійти</Button>
                            </Link>
                            <Link to="/signup">
                                <Button sx={{ color: theme === "light" ? "black" : "white" }}>Зареєструватися</Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <IconButton
                                sx={{ p: 0, mr: 2 }}
                                onClick={handleOpenUserMenu}
                            >
                                {isAuth ? (
                                    <Avatar alt="Avatar" src={user.picture} />
                                ) : (
                                    <Avatar>
                                        <AccountBoxIcon />
                                    </Avatar>
                                )}
                            </IconButton>
                            <Menu
                                sx={{ mt: "45px" }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem onClick={handleCloseUserMenu}>
                                    <Link to="/addCar">
                                        <Typography textAlign="center">Додати оголошення</Typography>
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={handleCloseUserMenu}>
                                    <Link to="/allMyCars">
                                        <Typography textAlign="center">Мої оголошення</Typography>
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={logoutHandler}>
                                    <Typography textAlign="center">Вийти</Typography>
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </Grid>
            </Grid>
        </AppBar>
    );
};

export default Navbar;
