// axios is used to fetch data
// here we setup axios to send request to backend
// and also we set cors to backend in server.js file allow to connect frontend with backend

import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // allow to send cookies with request
});
