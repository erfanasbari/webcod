import { DefaultRootState } from "react-redux";
import { ThunkAction, Action } from "@reduxjs/toolkit";
import { RootState } from "store/reducer";

declare module "react-redux" {
	interface DefaultRootState extends RootState {}
}

declare module "@reduxjs/toolkit" {
	type Thunk<ReturnType = void> = ThunkAction<ReturnType, DefaultRootState, unknown, Action<string>>;
}

export as namespace Redux;
