import axios from './axiso'
export function listProjectApi() {
  return axios({
    url: '/api/project/listProject',
    method: 'get',
  })
}

export function gradleTaskApi(data){
  return axios({
    url: '/api/project/gradleTask',
    method: 'post',
    data
  })
}

export function listTasksApi(params){
  return axios({
    url: '/api/project/listTasks',
    method: 'get',
    params
  })
}
export function saveConfigApi(data){
  return axios({
    url: '/api/project/saveConfig',
    method: 'post',
    data
  })
}

export function buildProjectApi(params){
  return axios({
    url: '/api/project/execProjectCommand',
    method: 'get',
    params
  })
}

export function shellProjectApi(params){
  return axios({
    url: '/api/project/execProjectShell',
    method: 'get',
    params
  })
}