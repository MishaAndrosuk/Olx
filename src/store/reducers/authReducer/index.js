const initalAuthState = {
    user: null,
    isAuth: false,
  };
  
  export const AuthReducer = (state = initalAuthState, action) => {
    switch (action.type) {
      case "SIGN_IN":
        return { ...state, isAuth: true, user: action.payload };
      case "SIGN_UP":
        return { ...state, isAuth: true, user: action.payload };
      case "LOGOUT":
        return { ...state, user: null, isAuth: false };
      default:
        return state;
    }
  };
  