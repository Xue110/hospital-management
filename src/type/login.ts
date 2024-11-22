import { AnyAction } from "@reduxjs/toolkit";
import { ThunkDispatch } from "redux-thunk";

export type LoginAction = {
   username:string
   password:string 
   remember:boolean
}
export type ForgetPasswordAction = {
   phone:string
   newPassword:string
   code:string
}
export type RootState = {
    user: {
      name: string;
      isLoggedIn: boolean;
    };
  };
  
export type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;