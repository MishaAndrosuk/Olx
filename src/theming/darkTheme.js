import { createTheme } from "@mui/material";
import { grey, blue} from "@mui/material/colors";

const darkTheme = createTheme({
    palette: {
        primary: {
            light: grey[500],
            main: grey[700],
            dark: grey[900],
        },
        secondary: {
            light: blue[200],
            main: blue[500],
            dark: blue[800],
        }
    },
});

export default darkTheme;