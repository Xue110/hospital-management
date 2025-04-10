import { request } from "../utils"
// 获取菜单项
export const getPathAPI = (roleId: number) => {
    return request({
        url: `/admin/permission/${roleId}`,
        method: "GET",
    })
}
// 获取数据列表
export const getLayoutAPI = () => {
    const id = localStorage.getItem("id")
    return request({
        url: `/admin/counts/${id}`,
        method: "GET",
    })
}