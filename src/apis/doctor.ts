import { request } from "../utils";

// 获取医生列表
export const getDoctorList = (data: any) => {
  return request({
    url: "/admin/hospital/doctor/limit",
    method: "POST",
    data
  });
}

// 添加医生
export const addDoctor = (data: any) => {
  return request({
    url: "/admin/hospital/doctor/add",
    method: "POST",
    data
  });
}

// 修改医生信息
export const updateDoctor = (data: any) => {
  return request({
    url: "/admin/hospital/doctor/update",
    method: "PUT",
    data
  });
}

// 删除单个医生
export const deleteDoctor = (id: number) => {
  return request({
    url: `/admin/hospital/doctor/delete/${id}`,
    method: "DELETE",
  });
}
//批量删除医生
export const deleteDoctorBatch = (ids: number[]) => {
    return request({
      url: `/admin/hospital/doctor/delete/batchDelete?ids=${ids}`,
      method: "DELETE",
    });
  }