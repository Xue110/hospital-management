// 组合redux子模块 + 导出实例

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./module/user";

export default configureStore({
    reducer:{
        user:userReducer
    }
})