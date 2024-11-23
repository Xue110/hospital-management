// 和用户相关的状态管理
import { createSlice } from '@reduxjs/toolkit';
import { clearToken, getToken, setToken } from '../../utils';
import { getProfileAPI, loginAPI } from '../../apis/login';
import {
  AppDispatch,
  LoginAction,
} from '../../type/login';
import { message } from 'antd';

const userStore = createSlice({
  name: 'user',
  // 数据状态
  initialState: {
    token: getToken() || '',
    userInfo: {}
  },
  // 同步修改方法
  reducers: {
    updateToken(state, action) {
      state.token = action.payload;
      setToken(state.token);
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload;
      console.log('Updated userInfo:', state.userInfo);
    },
    clearUserInfo(state) {
      state.token = '';
      state.userInfo = {};
      clearToken()
    },
  },
});

// 结构出actionCreater
const { updateToken, setUserInfo, clearUserInfo} = userStore.actions;

// 导出reducer
const userReducer = userStore.reducer;

// 异步方法 完成登录获取token
const fetchLogin = (loginForm: LoginAction) => {
  return async (dispatch: AppDispatch) => {
    try {
      // 1. 异步请求
      const res = await loginAPI(loginForm);
      // 检查返回的状态是否成功（根据 API 的实际返回结构来判断）
      if (res.code == 200) {
        // 2. 提交同步action进行token的存入
        dispatch(updateToken(res.data.token));
        localStorage.setItem('id', res.data.id)
        localStorage.setItem('username', res.data.username)
        message.success('登录成功');
      } else {
        message.error('登录失败,请检查用户名和密码是否正确');
      }
    } catch (error) {
      // 3. 捕获错误并提示用户
      message.error('登录请求失败，请稍后再试');
    }
  };
};

const fetchUserInfo = () => {
  return async (dispatch: AppDispatch) => {
      const res = await getProfileAPI()
      console.log(res.data)
      dispatch(setUserInfo(res.data))
  }
}

// 导出action
export { fetchLogin,fetchUserInfo, updateToken, setUserInfo, clearUserInfo };
export default userReducer;
