import { request } from "../utils";

// 获取医院列表
export const getHospitalList = (data: any) => {
  return request({
    url: "/admin/hospital/info/limit",
    method: "POST",
    data
  });
}

// 添加医院
export const addHospital = (data: any) => {
  return request({
    url: "/admin/hospital/info/add",
    method: "POST",
    data
  });
}

// 修改医院信息
export const updateHospital = (data: any) => {
  return request({
    url: "/admin/hospital/info/update",
    method: "PUT",
    data
  });
}

// 删除单个医院
export const deleteHospital = (id: number) => {
  return request({
    url: `/admin/hospital/info/delete/${id}`,
    method: "DELETE",
  });
}

// 批量删除医院
export const deleteHospitalBatch = (ids: number[]) => {
  return request({
    url: `/admin/hospital/info/delete/batchDelete?ids=${ids}`,
    method: "DELETE",
  });
}