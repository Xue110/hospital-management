import { request } from "../utils"
// 获取菜单项
export const getPathAPI = (roleId: number) => {
    return request({
        url: `/admin/permission/${roleId}`,
        method: "GET",
    })
}