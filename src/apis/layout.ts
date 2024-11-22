import { request } from "../utils"
// 获取菜单项
export const getPathAPI = (roleId: number) => {
    return request({
        url: `/path?roleId=${roleId}`,
        method: "GET",
    })
}