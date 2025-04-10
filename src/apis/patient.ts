import { request } from '../utils';

// 获取药品处方表
export const getPrescriptionList = (data: any) => {
  return request({
    url: '/admin/patient/prescription/limit',
    method: 'POST',
    data,
  });
};

// 添加药品处方
export const addPrescription = (data: any) => {
  return request({
    url: '/admin/patient/prescription/add',
    method: 'POST',
    data,
  });
};

// 修改药品处方
export const updatePrescription = (data: any) => {
  return request({
    url: '/admin/patient/prescription/update',
    method: 'PUT',
    data,
  });
};

// 删除单个药品处方
export const deletePrescription = (id: any) => {
  return request({
    url: `/admin/patient/prescription/delete/${id}`,
    method: 'DELETE',
  });
}

// 批量删除药品处方
export const deletePrescriptions = (ids: any) => {
  return request({
    url: `/admin/patient/prescription/batchDelete?ids=${ids}`,
    method: 'DELETE',
  });
}

// 获取收费记录列表
export const getChargeList = (data: any) => {
  return request({
    url: '/admin/patient/order/limit',
    method: 'POST',
    data,
  });
}

// 添加收费记录
export const addCharge = (data: any) => {
  return request({
    url: '/admin/patient/order/add',
    method: 'POST',
    data,
  });
}

// 删除单个收费记录
export const deleteCharge = (id: any) => {
  return request({
    url: `/admin/patient/order/delete/${id}`,
    method: 'DELETE',
  });
}
// 批量删除收费记录
export const deleteCharges = (ids: any) => {
  return request({
    url: `/admin/patient/order/batchDelete?ids=${ids}`,
    method: 'DELETE',
  });
}

// 获取就诊记录列表
export const getVisitList = (data: any) => {
  return request({
    url: '/admin/patient/registration/limit',
    method: 'POST',
    data,
  });
}
// 添加就诊记录
export const addVisit = (data: any) => {
  return request({
    url: '/admin/patient/registration/add',
    method: 'POST',
    data,
  });
}
// 删除单个就诊记录
export const deleteVisit = (id: any) => {
  return request({
    url: `/admin/patient/registration/delete/${id}`,
    method: 'DELETE',
  });
}
// 批量删除就诊记录
export const deleteVisits = (ids: any) => {
  return request({
    url: `/admin/patient/registration/batchDelete?ids=${ids}`,
    method: 'DELETE',
  });
}

// 获取健康档案列表
export const getHealthList = (data: any) => {
  return request({
    url: '/admin/patient/medicalRecord/limit',
    method: 'POST',
    data,
  });
}
// 添加健康档案
export const addHealth = (data: any) => {
  return request({
    url: '/admin/patient/medicalRecord/add',
    method: 'POST',
    data,
  });
}
// 删除单个健康档案
export const deleteHealth = (id: any) => {
  return request({
    url: `/admin/patient/medicalRecord/delete/${id}`,
    method: 'DELETE',
  });
}
// 批量删除健康档案
export const deleteHealths = (ids: any) => {
  return request({
    url: `/admin/patient/medicalRecord/batchDelete?ids=${ids}`,
    method: 'DELETE',
  })
}
// 修改健康档案
export const updateHealth = (data: any) => {
  return request({
    url: '/admin/patient/medicalRecord/update',
    method: 'PUT',
    data,
  });
}

// 获取患者列表
export const getPatientList = (data: any) => {
  return request({
    url: '/admin/patient/info/limit',
    method: 'POST',
    data,
  });
}
// 添加患者
export const addPatient = (data: any) => {
  return request({
    url: '/admin/patient/info/add',
    method: 'POST',
    data,
  });
}

// 删除单个患者
export const deletePatient = (id: any) => {
  return request({
    url: `/admin/patient/info/delete/${id}`,
    method: 'DELETE',
  });
}

// 批量删除患者
export const deletePatients = (ids: any) => {
  return request({
    url: `/admin/patient/info/batchDelete?ids=${ids}`,
    method: 'DELETE',
  });
}
// 修改患者
export const updatePatient = (data: any) => {
  return request({
    url: '/admin/patient/info/update',
    method: 'PUT',
    data,
  });
}

// 获取报告列表
export const getReportList = (data: any) => {
  return request({
    url: '/admin/patient/report/limit',
    method: 'POST',
    data,
  });
}
// 删除单个报告
export const deleteReport = (id: any) => {
  return request({
    url: `/admin/patient/report/delete/${id}`,
    method: 'DELETE',
  });
}
// 批量删除报告
export const deleteReports = (ids: any) => {
  return request({
    url: `/admin/patient/report/batchDelete?ids=${ids}`,
    method: 'DELETE',
  });
}
// 新增报告
export const addReport = (data: any) => {
  return request({
    url: '/admin/patient/report/add',
    method: 'POST',
    data,
  });
}