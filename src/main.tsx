import ReactDOM from "react-dom/client";

import { App } from "./App";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@phosphor-icons/web/regular";
import "@phosphor-icons/web/fill";
import "./scss/style.scss";

// Register service worker for PWA support
import { registerSW } from "virtual:pwa-register";

registerSW({
  onNeedRefresh() {
    // Auto-update without prompting
  },
  onOfflineReady() {
    // App is ready to work offline
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
