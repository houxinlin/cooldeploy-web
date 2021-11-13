import axios from "axios";
// import router from "../router/index";
const instance = axios.create({
  baseURL: "http://localhost:5991/",
  withCredentials: true,
});

instance.interceptors.response.use(
  function (response) {
    if (response.data.code == 302) {
      window.location="/login"
    }
    return response;
  },
  function (error) {
    console.log(error);
    return Promise.reject(error);
  }
);
// instance.interceptors.response.use(
//   function(response) {
//     if (response.data.code == -1000) {
//       router.push({
//         path: "/login",
//       });
//       return Promise.reject(new Error("no login"));

//     }
//     return response;
//   },
//   function(error) {
//     return Promise.reject(error);
//   }
// );
export default instance;
