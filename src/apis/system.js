import axios from "./axiso";
export function getRsaPubAPI() {
  return axios({
    url: "/api/system/getRsaPub",
    method: "get",
  });
}

export function generatorApi() {
  return axios({
    url: "/api/system/generatorRsa",
    method: "get",
  });
}


export function loginApi(data) {
  return axios({
    url: "/api/system/login",
    method: "post",
    data
  });
}
export function getSystemConfigApi() {
  return axios({
    url: "/api/system/getSystemConfig",
    method: "get",
  });
}

export function configLoginPasswdApi(data) {
  return axios({
    url: "/api/system/configLoginPasswd",
    method: "post",
    data
  });
}


