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

// 获取住院管理列表
export const getHospitalManageList = (data: any) => {
  return request({
    url: "/admin/hospital/inpatient/limit",
    method: "POST",
    data
  });
}

// 添加住院信息
export const addHospitalManage = (data: any) => {
  return request({
    url: "/admin/hospital/inpatient/add",
    method: "POST",
    data
  });
}

// 修改住院信息
export const updateHospitalManage = (data: any) => {
  return request({
    url: "/admin/hospital/inpatient/update",
    method: "PUT",
    data
  });
}

// 删除单个住院信息
export const deleteHospitalManage = (id: number) => {
  return request({
    url: `/admin/hospital/inpatient/delete/${id}`,
    method: "DELETE",
  });
}

// 批量删除住院信息
export const deleteHospitalManageBatch = (ids: number[]) => {
  return request({
    url: `/admin/hospital/inpatient/batchDelete?ids=${ids}`,
    method: "DELETE",
  });
}

// 获取挂号记录列表
export const getRegisterList = (data: any) => {
  return request({
    url: "/admin/hospital/registration/limit",
    method: "POST",
    data
  });
}
// 添加挂号记录
export const addRegister = (data: any) => {
  return request({
    url: "/admin/hospital/registration/add",
    method: "POST",
    data
  });
}
// 修改挂号记录
export const updateRegister = (data: any) => {
  return request({
    url: "/admin/hospital/registration/update",
    method: "PUT",
    data
  });
}
// 删除单个挂号记录
export const deleteRegister = (id: number) => {
  return request({
    url: `/admin/hospital/registration/delete/${id}`,
    method: "DELETE",
  });
}
// 批量删除挂号记录
export const deleteRegisterBatch = (ids: number[]) => {
  return request({
    url: `/admin/hospital/registration/batchDelete?ids=${ids}`,
    method: "DELETE",
  });
}

// 获取药品列表
export const getMedicationList = (data: any) => {
  return request({
    url: `/admin/hospital/medication/page?page=${data.page}&pageSize=${data.pageSize}`,
    method: "GET",
  });
}
// 添加药品
export const addMedication = (data: any) => {
  return request({
    url: "/admin/hospital/medication/add",
    method: "POST",
    data
  });
}
// 修改药品
export const updateMedication = (data: any) => {
  return request({
    url: "/admin/hospital/medication/update",
    method: "PUT",
    data
  });
}
// 删除单个药品
export const deleteMedication = (id: number) => {
  return request({
    url: `/admin/hospital/medication/delete/${id}`,
    method: "DELETE",
  });
}
// 批量删除药品
export const deleteMedicationBatch = (ids: number[]) => {
  return request({
    url: `/admin/hospital/medication/batchDelete?ids=${ids}`,
    method: "DELETE",
  });
}

// 获取病房列表
export const getWardList = (data: any) => {
  return request({
    url: `/admin/hospital/rooms/page?page=${data.page}&pageSize=${data.pageSize}`,
    method: "GET",
  });
}
// 添加病房
export const addWard = (data: any) => {
  return request({
    url: "/admin/hospital/rooms/add",
    method: "POST",
    data
  });
}
// 修改病房
export const updateWard = (data: any) => {
  return request({
    url: "/admin/hospital/rooms/update",
    method: "PUT",
    data
  });
}
// 删除单个病房
export const deleteWard = (id: number) => {
  return request({
    url: `/admin/hospital/rooms/delete/${id}`,
    method: "DELETE",
  });
}

// 获取医院排班管理记录
export const getScheduleList = (data: any) => {
  return request({
    url: '/admin/schedule/limit',
    method: "POST",
    data
  });
}

// 新增排班
export const addSchedule = (data: any) => {
  return request({
    url: "/admin/schedule/add",
    method: "POST",
    data
  });
}

// 删除排班
export const deleteSchedule = (id: number) => {
  return request({
    url: `/admin/schedule/delete/${id}`,
    method: "DELETE",
  });
}

// 修改排班
export const updateSchedule = (data: any) => {
  return request({
    url: "/admin/schedule/update",
    method: "PUT",
    data
  });
}

// 删除全部排班
export const deleteScheduleAll = (ids:number[]) => {
  return request({
    url: `/admin/schedule/batchDelete?ids=${ids}`,
    method: "DELETE",
  });
}

// 获取预约记录
export const getAppointmentList = (data: any) => {
  return request({
    url: `/admin/registration/page?page=${data.page}&pageSize=${data.pageSize}`,
    method: "GET"
  });
}
// 添加预约记录
export const addAppointment = (data: any) => {
  return request({
    url: "/admin/registration/add",
    method: "POST",
    data
  });
}
// 修改预约记录
export const updateAppointment = (data: any) => {
  return request({
    url: "/admin/registration/update",
    method: "PUT",
    data
  });
}
// 删除单个预约记录
export const deleteAppointment = (id: number) => {
  return request({
    url: `/admin/registration/delete/${id}`,
    method: "DELETE",
  });
}
// 批量删除预约记录
export const deleteAppointmentBatch = (ids: number[]) => {
  return request({
    url: `/admin/registration/batchDelete?ids=${ids}`,
    method: "DELETE",
  });
}

// 获取医生排班记录
export const getDoctorScheduleList = (data: any) => {
  return request({
    url: '/admin/schedules/page',
    method: "POST",
    data
  });
}
// 添加医生排班记录
export const addDoctorSchedule = (data: any) => {
  return request({
    url: "/admin/schedules/add",
    method: "POST",
    data
  });
}
// 删除单个医生排班记录
export const deleteDoctorSchedule = (id: number) => {
  return request({
    url: `/admin/schedules/delete/${id}`,
    method: "DELETE",
  });
}

// 批量删除医生排班记录
export const deleteDoctorScheduleBatch = (ids: number[]) => {
  return request({
    url: `/admin/schedules/batchDelete?ids=${ids}`,
    method: "DELETE",
  });
}
// 修改医生排班记录
export const updateDoctorSchedule = (data: any) => {
  return request({
    url: "/admin/schedules/update",
    method: "PUT",
    data
  });
}