import { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'react-datepicker/dist/react-datepicker.css';
import App from "./components/App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    // <StrictMode>
        <App />
    // </StrictMode>
);