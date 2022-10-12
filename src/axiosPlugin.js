import axios from 'axios'
import router from "./router";

export const baseServerAddr = 'localhost:8888';
// export const baseServerAddr = '10.108.17.34:9999';
export const baseURL = 'http://' + baseServerAddr + '/';

export const Axios = axios.create({
    baseURL: baseURL,
    timeout: 10000,
});

//请求拦截器
Axios.interceptors.request.use(config => {
    //若存在这样的token，则从本地存储取出
    if (localStorage.token) {
        config.headers.Authorization = localStorage.getItem("token")
    }
    return config
}, error => {
    return Promise.reject(error)
});

//响应拦截器
Axios.interceptors.response.use(res => {
    if (res.headers.Authorization) {
        localStorage.setItem("token", res.headers.Authorization);
    }

    if (res.data.state !== 'SUCCESS') {
        //送入失败流程处理
        return Promise.reject(res)
    }
    return res
}, error => {
    if (error.response.status === 401 || error.response.status === 403) {
        // 401表明用户登录状态已经丢失，需跳转至登录页面重新登录获取 token
        router.push('/login');
    }
    return Promise.reject(error.response.data)
});

export default Axios;