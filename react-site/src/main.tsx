import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import "react-photo-view/dist/react-photo-view.css";

import { Provider } from "react-redux";
import { setupStore } from "./store/index";
import { createTheme, ThemeProvider } from "@mui/material";
import "./i18n";
import Loader from "./components/Loader/Loader.tsx";

const theme = createTheme({
  typography: {
    fontFamily: ["Montserrat", "sans-serif"].join(","),
  },
});

const store = setupStore();

(function init100vh() {
  function setHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
  setHeight();
  window.addEventListener("resize", setHeight);
})();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <App />
          </Suspense>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
