import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
});

//Interceptors
// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // response có thể .data hoặc ... để truy cập vào phần dữ liệu mong muốn
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const { config, status, data } = error.response;
    if (status === 400) {
      // const errorList = data.data || [];
      // const firstError = errorList.length > 0 ? errorList[0] : {};
      // const messageList = firstError.messages || [];
      // const firstMessage = messageList.length > 0 ? messageList[0] : {};
      throw new Error(data.message);
    }
    return Promise.reject(data.message);
  }
);

export default axiosClient;
