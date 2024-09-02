// reducers/index.js
import { combineReducers } from "@reduxjs/toolkit";
import { ThemingReducer } from "./themingReducer";
import { AuthReducer } from "./authReducer";
import {CarsMainPageReducer} from "./carsMainPageReducer"

// наші редюсери
export const rootReducer = combineReducers({
  themingReducer: ThemingReducer,
  authReducer: AuthReducer,
  carsMainPageReducer:CarsMainPageReducer
});
