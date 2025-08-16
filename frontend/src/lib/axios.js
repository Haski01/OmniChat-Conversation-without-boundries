// axios is used to fetch data
// here we setup axios to send request to backend
// and also we set cors to backend in server.js file allow to connect frontend with backend

import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true, // allow to send cookies with request
});
