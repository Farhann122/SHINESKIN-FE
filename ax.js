import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3888",
});

axiosInstance.interceptors.request.use(
  function (config) {
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

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    console.log(error.response);
    if (error.response.status === 403) {
      if ((error.response.data = "TokenExpiredError")) {
        {
          localStorage.removeItem("token");
          window.location.href = "/";
        }
      }
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;
