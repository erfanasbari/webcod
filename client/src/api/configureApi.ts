import Axios from "axios";

const axios = Axios.create({
	baseURL: "http://localhost/api/",
	withCredentials: true,
});

export default axios;
