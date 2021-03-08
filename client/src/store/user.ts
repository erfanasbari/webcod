import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
	name: "user",
	initialState: {
		logged: false,
		username: "",
		email: "",
		role: 0,
	},
	reducers: {
		setUser: (user, action) => {
			return { ...user, ...action.payload };
		},
	},
});

const { setUser } = slice.actions;
export default slice.reducer;

export const updateUser = setUser;
export const logOut = () => setUser({ logged: false });
