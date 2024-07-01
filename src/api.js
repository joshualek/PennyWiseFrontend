import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // allows us to import anything specified inside an environment variable (.env file)
  // makes it easy to load and change what the URL should be
});

// Interceptor to intercept any request to the backend and add the token to the header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN); // get the JWT token from local storage
    if (token) { // if the token exists, add it as an authorisation header to our request, authorisation header is handled by axios
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api; 
// from now on we use this api access (created js above) instead of axios (which is the default)
// to send all of our different requests to the backend -> authorisation is automatically added to the header