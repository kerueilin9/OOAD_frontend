import axios from "axios";
import router from "@/router";

const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        console.warn("token 失效或無權限");
        router.replace("/OOAD/403");
      } else {
        console.error("API 錯誤:", status, error.response.data);
      }
    } else {
      console.error("網路錯誤或伺服器沒回應", error);
    }
    return Promise.reject(error);
  }
);

export default api;
