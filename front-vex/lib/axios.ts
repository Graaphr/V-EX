import axios from "axios";

const url = axios.create({
  baseURL: "https://vex.terpalb25.web.id",
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
