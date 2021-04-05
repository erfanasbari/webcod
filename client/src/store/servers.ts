import { createSlice, PayloadAction, Thunk } from "@reduxjs/toolkit";
import { createSnackbar } from "./ui";
import serversApi from "api/servers";

interface Server {
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
		rules: string;
		map: string;
		max_players: number;
		online_players: number;
		last_update: number;
	};
}

interface CurrentServer extends Server {
	options: Server["options"] & {
		nehoscreenshotsender_enabled: boolean;
	};
	cache: Server["cache"] & {
		players_info: string;
	};
}

interface Servers {
	list: Server[];
	currentServer: CurrentServer | null;
}

const slice = createSlice({
	name: "servers",
	initialState: {
		list: [],
		currentServer: null,
	} as Servers,
	reducers: {
		setServersList: (servers, action: PayloadAction<Server[]>) => {
			servers.list = action.payload;
		},
		setCurrentServer: (servers, action: PayloadAction<CurrentServer | null>) => {
			servers.currentServer = action.payload;
		},
	},
});

const { setServersList } = slice.actions;
export const { setCurrentServer } = slice.actions;
export default slice.reducer;

export const getServers = (page: number = 1): Thunk => (dispatch, getState) => {
	serversApi
		.getServers(page)
		.then((result) => {
			dispatch(setServersList(result.data));
		})
		.catch(({ response }) => {
			if (!response) return;
			dispatch(
				createSnackbar({ severity: "error", title: "Error", message: response.data.errors[0].message })
			);
		});
};

export const getCurrentServer = (slug: string): Thunk => (dispatch, getState) => {
	serversApi
		.getServer(slug)
		.then((result) => {
			dispatch(setCurrentServer(result.data));
		})
		.catch(({ response }) => {
			if (!response) return;
			dispatch(
				createSnackbar({ severity: "error", title: "Error", message: response.data.errors[0].message })
			);
		});
};
