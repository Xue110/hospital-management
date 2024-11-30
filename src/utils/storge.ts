// 封装医院相关数据的本地存储

const SET_HOSPITAL = 'HOSPITAL_DATA'

function setHospital(data: any) {
  return localStorage.setItem(SET_HOSPITAL, JSON.stringify(data))
}

function getHospital() {
  return JSON.parse(localStorage.getItem(SET_HOSPITAL) as string)
}

function removeHospital() {
  return localStorage.removeItem(SET_HOSPITAL)
}

export { setHospital, getHospital, removeHospital }