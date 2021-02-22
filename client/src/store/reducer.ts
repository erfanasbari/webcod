import { combineReducers } from "@reduxjs/toolkit";

// Reducers
import serversReducer from "./servers";

const reducer = combineReducers({
	servers: serversReducer,
});

export default reducer;
