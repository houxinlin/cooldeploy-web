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
