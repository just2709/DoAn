import axiosClient from "./axiosClient";

const userApi = {
  signup(data) {
    const url = "/users";
    return axiosClient.post(url, data);
  },
  login(data) {
    const url = "/users/login";
    return axiosClient.post(url, data);
  },
  forgotPassword(data) {
    const url = "/users/forgotPassword";
    return axiosClient.post(url, data);
  },
  resetPassword(data, token) {
    const url = `/users/resetPassword/${token}`;
    return axiosClient.post(url, data);
  },
  updatePassword(data) {
    const url = "/users/forgotPassword";
    return axiosClient.post(url, data);
  },
  updateMe(data) {
    const url = "/users/updateMe";
    return axiosClient.patch(url, data);
  },
  deleteMe() {
    const url = "/users/updateMe";
    return axiosClient.delete(url);
  },
};

export default userApi;
