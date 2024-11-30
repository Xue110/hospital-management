// 统一中转工具模块函数
// import { request } from "@/utils"
import request from "./request"
import { getToken,setToken,clearToken } from "./token"
import { setHospital,getHospital,removeHospital } from "./storge"
export{
    request,
    getToken,
    setToken,
    clearToken,
    setHospital,
    getHospital,
    removeHospital,
}