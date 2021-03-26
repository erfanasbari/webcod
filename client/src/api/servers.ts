import axios from "./configureApi";

export const getServers = async (page: number = 1) => {
	return axios.get("/servers", {
		params: { page },
	});
};

const exports = {
	getServers,
};

export default exports;
