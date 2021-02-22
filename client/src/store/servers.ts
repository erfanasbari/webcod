import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
	name: "servers",
	initialState: {
		list: [],
	},
	reducers: {},
});

const {} = slice.actions;
export default slice.reducer;
