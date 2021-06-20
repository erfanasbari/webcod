import { createSlice, Thunk } from "@reduxjs/toolkit";
import { createSnackbar } from "./ui";
import authApi from "api/auth";

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

export const register =
	(username: string, password: string, email: string, callback: Function): Thunk =>
	(dispatch, getState) => {
		authApi
			.register(username, email, password)
			.then((result) => {
				dispatch(updateUser());
				dispatch(
					createSnackbar({
						severity: "success",
						title: "Success",
						message: "Your account has been registered.",
					})
				);
			})
			.catch(({ response, handled }) => {
				if (handled) return;
				dispatch(createSnackbar({ severity: "error", title: "Error", message: response.data.errors[0].message }));
			})
			.finally(() => {
				callback();
			});
	};

export const logIn =
	(username: string, password: string, callback: Function): Thunk =>
	(dispatch, getState) => {
		authApi
			.login(username, password)
			.then((result) => {
				dispatch(updateUser());
				dispatch(createSnackbar({ severity: "success", title: "Success", message: "Successfully logged in." }));
			})
			.catch(({ response, handled }) => {
				if (handled) return;
				dispatch(createSnackbar({ severity: "error", title: "Error", message: response.data.errors[0].message }));
			})
			.finally(() => {
				callback();
			});
	};

export const updateUser = (): Thunk => (dispatch, getState) => {
	authApi
		.getUser()
		.then((result) => {
			dispatch(
				setUser({
					logged: true,
					username: result.data.username,
					email: result.data.email,
					role: result.data.role,
				})
			);
		})
		.catch(({ response, handled }) => {
			if (handled) return;
		});
};

export const logOut = (): Thunk => async (dispatch, getState) => {
	authApi
		.logOut()
		.then((result) => {
			dispatch(setUser({ logged: false }));
			dispatch(createSnackbar({ severity: "info", title: "Info", message: "Successfully Logged Out Of Account." }));
		})
		.catch(({ response, handled }) => {
			if (handled) return;
			dispatch(createSnackbar({ severity: "error", title: "Error", message: response.data.errors[0].message }));
		});
};
