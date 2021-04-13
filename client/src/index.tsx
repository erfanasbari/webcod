import React from "react";
import ReactDOM from "react-dom";
import { Provider as ReactReduxProvider } from "react-redux";
import store from "./store/configureStore";
import { BrowserRouter } from "react-router-dom";
import generalConfig from "./config/general";
import App from "./App";

// css
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "assets/sass/style.scss";

ReactDOM.render(
  <React.StrictMode>
    <ReactReduxProvider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ReactReduxProvider>
  </React.StrictMode>,
  document.getElementById(generalConfig.app.rootElement.id)
);
