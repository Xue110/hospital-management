import { ForgetPasswordAction, LoginAction } from "../type/login"
import { request } from "../utils"

//登录接口
export const loginAPI = (formData:LoginAction) =>{
    return request({
        url: "/admin/admin/login",
        method: "POST",
        data:formData
    })
}
//重置密码接口
export const resetPasswordAPI = (formData:ForgetPasswordAction) =>{
    return request({
        url: "/resetPassword",
        method: "POST",
        data:formData
    })
}
// 获取个人信息
export const getProfileAPI = () =>{
    const userId = localStorage.getItem("id")
    return request({
        url: `/profile/${userId}`,
        method: "GET",
    })  
}