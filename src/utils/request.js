import axios from "axios";

// create an axios instance
const service = axios.create({
  baseURL: "/api",
  timeout: 10000, // request timeout
});

function removeProperty(object) {
  for (let prop in object) {
    if (
      object[prop] === "" ||
      object[prop] == "null" ||
      object[prop] == "undefined" ||
      object[prop] === null ||
      object[prop] === undefined
    ) {
      delete object[prop];
    }
  }
}
const getToken = () => {
  return localStorage.getItem("token");
};
service.interceptors.request.use(
  (config) => {
    if (getToken()) {
      config.headers["Authorization"] = getToken();
    }
    if (config.hasOwnProperty("params")) {
      removeProperty(config.params);
    } else if (config.data) {
      removeProperty(config.data);
    }
    return config;
  },
  (error) => {
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    // 判断一下响应中是否有 token，如果有就直接使用此 token 替换掉本地的 token。你可以根据你的业务需求自己编写更新 token 的逻辑
    const token =
      response.headers.authorization || response.config.headers.Authorization;
    if (token) {
      // 如果 header 中存在 token，那么触发 refreshToken 方法，替换本地的 token
      localStorage.setItem("token", token);
    }
    return response.data;
  },
  (error) => {
    console.log("🚀 ~ file: request.js:55 ~ error:", error);
    // token过期或者被篡改
    return Promise.reject(error);
  }
);

export default service;
