/* eslint-disable @typescript-eslint/no-explicit-any */
// https://marmelab.com/react-admin/AuthProviderWriting.html

import axios from "axios";
import Router from "./Router";

export default {
  login: async (params: any) => {
    const { username, password } = params;
    const response = await axios.post(Router.loginPath(), {
      username,
      password,
    });
    localStorage.setItem("token", response.data);
  },
  logout: async () => {
    localStorage.removeItem("token");
  },
  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }
  },
  checkError: async (error: any) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      const e = new Error("Access is not authorized (401)");
      // e.redirectTo = "/";
      throw e;
    }
  },
  getIdentity: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }

    const data = {
      id: "user",
      fullName: "John Doe",
    };
    return data;
  },
  getPermissions: async () => {
    return "";
  },
};
