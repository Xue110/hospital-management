import { request } from "../utils";
// 获取订单列表
export const getOrderList = (data: any) => {
  return request({
    url: "/admin/order/limit",
    method: "POST",
    data
  });
}
// 添加订单
export const addOrder = (data: any) => {
  return request({
    url: "/admin/order/add",
    method: "POST",
    data
  });
}
// 修改订单
export const updateOrder = (data: any) => {
  return request({
    url: "/admin/order/update",
    method: "PUT",
    data
  });
}
// 删除订单
export const deleteOrder = (id: number) => {
  return request({
    url: `/admin/order/delete/${id}`,
    method: "DELETE"
  });
}
// 批量删除订单
export const batchDeleteOrder = (ids: number[]) => {
  return request({
    url: `/admin/order/delete/batchDelete?ids=${ids}`,
    method: "DELETE",
  });
}