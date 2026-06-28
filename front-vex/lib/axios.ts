import axios from "axios";

const url = axios.create({
  baseURL: "http://72.61.210.158:8000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

url.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default url;
