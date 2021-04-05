import axios from "./configureApi";

export const getServers = async (page: number = 1) => {
	return axios.get("/servers", {
		params: { page },
	});
};

export const getServer = async (slug: string) => {
	return axios.get(`/servers/${slug}`);
};

export const addServer = async (values: AddServerFormValues) => {
	return axios.post("/servers/add", {
		appId: values.appId,
		name: values.name,
		host: values.host,
		port: values.port,
		rconPassword: values.rconPassword,
		dbHost: values.dbHost,
		dbPort: values.dbPort,
		dbUser: values.dbUser,
		dbPassword: values.dbPassword,
		dbName: values.dbName,
	});
};

const exports = {
	getServers,
	getServer,
	addServer,
};

export default exports;
