import { createSlice } from '@reduxjs/toolkit';
import { getHospital, removeHospital, setHospital } from '../../utils';
import { AppDispatch } from '../../type/login';
import { getLayoutAPI } from '../../apis/layout';

// 和医院数据相关的状态管理
const hospitalStore = createSlice({
  name: 'hospital',
  //数据状态
  initialState: {
    hospitalList: getHospital() || {
      hospitalCounts:[], //医院数据
      doctorCounts:[], //医生数据
      patientCounts: [], //患者数据
      userCounts: [], //用户数据
      departmentCounts: [], //科室数据
      roomsCounts: [], //病床数据
      bedCounts: [], //床位数据
    },
  },
  //修改数据的方法
  reducers: {
    setHospitalList(state, action) {
      state.hospitalList = action.payload;
      setHospital(state.hospitalList);
    },
    removeHospitalList(state, action) {
      state.hospitalList = action.payload;
      removeHospital();
    },
  },
});

const { setHospitalList, removeHospitalList } = hospitalStore.actions;

const hospitalReducer = hospitalStore.reducer;

// 异步方法 获取医院数据
const getHospitalData = () => {
  return async (dispatch: AppDispatch) => {
    const res = await getLayoutAPI();
    dispatch(setHospitalList(res.data));
  };
};
export {
  setHospitalList,
  removeHospitalList,
  hospitalReducer,
  getHospitalData,
};
export default hospitalReducer;
