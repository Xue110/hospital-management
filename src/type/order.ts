export type DataType = {
  id: number; // 订单id
  key: React.Key;
  userId: number; // 用户id
  patientId: number; // 患者id
  doctorId: number; // 医生id
  total: number; // 总价 精度10,保留两位小数
  date: string; // 日期
  paymentStatus: number; // 1: 未支付, 2: 已支付, 3: 已取消, 4: 已超时
  paymentMethod: number; // 1: 支付宝支付, 2: 微信支付,  3: 余额支付
  hospitalId: number; // 医院id
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
  type: number;
};
export type filterType = {
  id: number;
  hospitalId: number;
  paymentStatus: number;
};
export type TableProps = {
  data: DataType[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  onTableChange: any;
  deleteNum: number;
  refresh: () => void;
  userCounts:Doctor[]
  patientCounts:Doctor[]
  hospitalCounts:Hospital[]
  doctorCounts:Doctor[]
  paginationCount:any
};
export type Doctor = {
  id: string;
  name: string;
  hospitalId: string;
};

export type Hospital = {
  id: string;
  name: string;
  children: Doctor[]; // 存储医院下的医生
};
