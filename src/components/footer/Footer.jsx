import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Copyright from "../copyright/Copyright";

const Footer = () => {
    const theme = useTheme();

    return (
        <Box
            bgcolor={theme.palette.primary.light}
            sx={{
                position: "relative",
                bottom: 0,
                textAlign: "center",
                width: "100%",
            }}
            maxWidth="fluid"
        >
            <Typography variant="body1">
                Cars footer
            </Typography>
            <Copyright />
        </Box>
    );
};

export default Footer;