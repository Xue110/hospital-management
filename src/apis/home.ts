import { request } from "../utils"
// 获取首页数据可视化信息
export const getHospitalCount = (roleId: number,id: number) => {
    return request({
        url: roleId == 1 ? `/admin/home/count/1` : roleId == 2 ? `/admin/home/count/2/${id}` : `/admin/home/count/3/${id}`,
        method: "GET",
    })
}