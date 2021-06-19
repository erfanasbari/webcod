import Axios, { AxiosResponse } from "axios";
import store from "store/configureStore";
import { createSnackbar } from "store/ui";

const axios = Axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? `${process.env.REACT_APP_SERVER_URL}/api/`
      : `${window.location.origin}/api/`,
  withCredentials: true,
});

axios.interceptors.response.use(
  (result: AxiosResponse) => {
    return result;
  },
  (error) => {
    // Handle network errors
    error.handled = true;
    if (!error.response) {
      store.dispatch(
        createSnackbar({
          severity: "error",
          title: "Network Error",
          message: "Can not connect to the server.",
        })
      );
    } else if (!error.response.data.errors) {
      store.dispatch(
        createSnackbar({
          severity: "error",
          title: "Server Error",
          message: "Can not communicate with the server.",
        })
      );
    } else {
      error.handled = false;
    }
    return Promise.reject(error);
  }
);

export default axios;
