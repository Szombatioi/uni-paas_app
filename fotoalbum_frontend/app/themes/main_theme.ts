import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        error: {
            main: "#f44336", // Traditional Red
        },
        info: {
            main: "#2196f3", // Traditional Blue
        },
        success: {
            main: "#4caf50", // Traditional Green
        }
    },
    // components:{
    //     MuiAppBar: {
    //         styleOverrides: {
    //             root: {
    //                 backgroundColor: "#ECEFF1"
    //             }
    //         }
    //     }
    // }
});
export default theme;