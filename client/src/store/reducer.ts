import { combineReducers } from "@reduxjs/toolkit";

// Reducers
import serversReducer from "./servers";
import userReducer from "./user";
import uiReducer from "./ui";

const reducer = combineReducers({
	servers: serversReducer,
	user: userReducer,
	ui: uiReducer,
});

export default reducer;
export type RootState = ReturnType<typeof reducer>;
