import { Key } from "react";
import { request } from "../utils";

// 获取用户列表
export const getUserList = (current: number, pageSize: number,filters:any) => {
  return request({
    url: "/admin/userInfo/limit",
    method: "POST",
    data: {
        page: current,
        pageSize,
        username: filters.username,
        id: filters.userId,
        roleId: filters.roleId,
    }
  });
}

// 新增用户
export const addUser = (data: any) => {
  return request({
    url: "/admin/userInfo/insert",
    method: "POST",
    data
  });
}

// 批量删除用户
export const deleteUser = (ids: Key[]) => {
  return request({
    url: `/admin/userInfo/delete?ids=${ids}`,
    method: "DELETE",
  });
}

// 删除单个用户
export const deleteUserById = (id: number) => {
  return request({
    url: `/admin/userInfo/delete/${id}`,
    method: "DELETE",
  });
}

// 修改用户信息
export const updateUser = (data: any) => {
  return request({
    url: "/admin/profile/update",
    method: "PUT",
    data
  });
}