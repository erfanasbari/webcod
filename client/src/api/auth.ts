import axios from "./configureApi";

export const register = async (username: string, email: string, password: string) => {
	return axios.post("auth/register", {
		username,
		password,
		email,
	});
};

export const login = async (username: string, password: string) => {
	return axios.post("auth/login", {
		username,
		password,
	});
};

export const getUser = async () => {
	return axios.get("auth/user");
};

export const logOut = async () => {
	return axios.delete("auth/logout");
};

const exports = {
	register,
	login,
	getUser,
	logOut,
};

export default exports;
