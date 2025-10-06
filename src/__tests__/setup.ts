import { enableFetchMocks } from "jest-fetch-mock";
import { future } from "@remix-run/router";

// Enable fetch mocks
enableFetchMocks();

// Set React Router future flags
Object.defineProperty(future, "v7_startTransition", { value: true });
Object.defineProperty(future, "v7_relativeSplatPath", { value: true });
