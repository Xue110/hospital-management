import { request } from "../utils"
// 获取当前用户权限信息
export const getPermission = () => {
    return request({
        url: "/permission",
        method: "GET",
    })
}
// 获取首页数据可视化信息
export const getHospitalCount = () => {
    return request({
        url: "/home/hospital/count",
        method: "GET",
    })
}