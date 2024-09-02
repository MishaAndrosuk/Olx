import { createTheme } from "@mui/material";
import { yellow } from "@mui/material/colors";

const lightTheme = createTheme({
    palette: {
        primary: {
            light: "#b3ffcc",
            main: "#80ffaa",
            dark: "#4dff88",
        },
        secondary: {
            light: yellow[200],
            main: yellow[500],
            dark: yellow[800],
        }
    },
});

export default lightTheme;
