import React, { useEffect } from "react";

import { ThemeProvider } from "@mui/material/styles";
import lightTheme from "./theming/lightTheme";
import darkTheme from "./theming/darkTheme";
import { useSelector } from "react-redux";

import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import { Routes, Route } from "react-router-dom";
import DefaulLayout from "./components/layouts/default/DefaultLayout";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useAction } from "./hooks/useAction";

import MainPage from "./pages/main/MainPage";

import AddCar from "./pages/cars/AddCar";
import AllMyCars from "./pages/cars/AllCars";

import "./App.css";

function App() {
  const clientId =
    "135964319940-eesbq9ooc8gjh983qplaktbqttkiu4p3.apps.googleusercontent.com";

  const { theme } = useSelector((state) => state.themingReducer);
  const currentTheme = theme === "dark" ? darkTheme : lightTheme;

  const { signIn } = useAction();

  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (token != null) {
      signIn(token);
    }
  }, []);

  return (
    <ThemeProvider theme={currentTheme}>
      <GoogleOAuthProvider clientId={clientId}>
        <Routes>
          <Route path="/" element={<DefaulLayout />}>
            <Route index element={<MainPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/addCar" element={<AddCar />} />
            <Route path="/allMyCars" element={<AllMyCars />} />
          </Route>
        </Routes>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;
