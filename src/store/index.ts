// 组合redux子模块 + 导出实例

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./module/user";
import hospitalReducer from "./module/storge";

export default configureStore({
    reducer:{
        user:userReducer,
        hospital:hospitalReducer
    }
})