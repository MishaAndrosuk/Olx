export const setTheme = (theme) => (dispatch) => {
    localStorage.setItem("theme", theme);
    dispatch({ type: "SET_THEME", payload: theme });
};
