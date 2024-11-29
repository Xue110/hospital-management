import { request } from "../utils";

// 获取科室列表
export const getDepartmentList = (data: any) => {
  return request({
    url: "/admin/hospital/department/limit",
    method: "POST",
    data
  });
}

// 添加科室
export const addDepartment = (data: any) => {
  return request({
    url: "/admin/hospital/department/add",
    method: "POST",
    data
  });
}

// 修改科室信息
export const updateDepartment = (data: any) => {
  return request({
    url: "/admin/hospital/department/update",
    method: "PUT",
    data
  });
}

// 删除单个科室
export const deleteDepartment = (id: number) => {
  return request({
    url: `/admin/hospital/department/delete/${id}`,
    method: "DELETE",
  });
}