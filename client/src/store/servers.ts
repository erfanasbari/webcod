import { createSlice, Thunk } from "@reduxjs/toolkit";
import { createSnackbar } from "./ui";
import serversApi from "../api/servers";

interface servers {
	list: Array<{
		info: {
			appId: string;
			ip: string;
			name: string;
			port: number;
			slug: string;
		};
		options: {};
		cache: {
			is_online: boolean;
			name: string;
			map: string;
			max_players: number;
			online_players: number;
			last_update: number;
		};
	}>;
}

const slice = createSlice({
	name: "servers",
	initialState: {
		list: [],
	} as servers,
	reducers: {
		setServers: (servers, action) => {
			servers.list = action.payload;
		},
	},
});

const { setServers } = slice.actions;
export default slice.reducer;

export const getServers = (page: number = 1): Thunk => (dispatch, getState) => {
	serversApi
		.getServers(page)
		.then((result) => {
			dispatch(setServers(result.data));
		})
		.catch(({ response }) => {
			if (!response) return;
			dispatch(
				createSnackbar({ severity: "error", title: "Error", message: response.data.errors[0].message })
			);
		});
};
