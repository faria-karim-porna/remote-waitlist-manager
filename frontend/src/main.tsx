import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { AppStore } from "./components/core/redux/store.ts";

createRoot(document.getElementById("root")!).render(
  <Provider store={AppStore}>
    <StrictMode>
      <App />
    </StrictMode>
  </Provider>
);
