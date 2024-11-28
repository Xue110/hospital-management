import { Button, Card, message, Space } from 'antd';
import './index.scss';
import Search from './c-cpns/search';
import Table from './c-cpns/table';
import { useCallback, useEffect, useState } from 'react';
import { DataType, Doctor, filterType, Hospital } from '../../type/order';
import { getOrderList } from '../../apis/order';
import AdOrder from './c-cpns/AdOrder';
import { getLayoutAPI } from '../../apis/layout';
const Order = () => {
  const [data, setData] = useState<DataType[]>([
    {
      id: 1,
      key: '1',
      userId: 1,
      patientId: 1,
      doctorId: 1,
      total: 100,
      type: 1,
      date: '2023-01-01',
      paymentStatus: 1,
      paymentMethod: 1,
      hospitalId: 1,
      createTime: '2023-01-01 10:00:00',
      updateTime: '2023-01-01 10:00:00',
    },
  ]);
  const [open, setOpen] = useState<number>(0);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: data.length,
  });
  const [filterData, setFilterData] = useState<filterType>();
  //删除次数
  const [deleteNum, setDeleteNum] = useState(0);
  // 获取医院和医生和用户和患者以及医院下的医生
  const [hospitalCounts, setHospitalCounts] = useState<Hospital[]>([]);
  const [doctorCounts, setDoctorCounts] = useState<Doctor[]>([]);
  const [userCounts, setUserCounts] = useState<Doctor[]>([]);
  const [patientCounts, setPatientCounts] = useState<Doctor[]>([]);
  const [layoutData, setLayoutData] = useState<any>([]);
  // 新增订单
  const handleClick = () => {
    setOpen(open + 1);
  };
  // 批量删除
  const handleDelete = () => {
    setDeleteNum(deleteNum + 1);
  };
  // 获取订单列表数据
  const getData = async () => {
    const data = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      id: filterData?.id,
      hospitalId: filterData?.hospitalId,
      paymentStatus: filterData?.paymentStatus,
    };
    const res = await getOrderList(data);
    setData(res.data.records);
  };
  // 分页变更处理函数
  const handleTableChange = (pagination: any) => {
    setPagination({
      page: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
    });
  };
  // 筛选条件变更处理函数
  const handleFilterChange = (filterData: filterType) => {
    setFilterData(filterData);
  };
  useEffect(() => {
    getData();
  }, [pagination.page, pagination.pageSize, filterData]);
  // 使用 useCallback 缓存 fetchData 函数的引用
  const refresh = useCallback(() => {
    getData();
  }, [pagination.page, pagination.pageSize, filterData]);
  const assignDoctorsToHospitals = (
    doctorCounts: Doctor[],
    hospitalCounts: any[]
  ): void => {
    const hospitalMap = new Map<string, Hospital>();
    hospitalCounts.forEach((hospital) => {
      if (!hospital.children) {
        hospital.children = [];
      }
      hospitalMap.set(hospital.value, hospital);
    });
    doctorCounts.forEach((doctor) => {
      const hospital = hospitalMap.get(doctor.hospitalId);
      if (hospital) {
        // 将医生添加到医院的 `children` 数组中
        hospital.children?.push(doctor);
      }
    });
  };
  // 获取列表信息
  const getOrderInfo = async () => {
    const res = await getLayoutAPI();
    if (res.code === 200) {
      // 获取成功
      console.log(res.data.patientCounts);
      setUserCounts(res.data.userCounts);
      setPatientCounts(res.data.patientCounts);
      setHospitalCounts(res.data.hospitalCounts);
      setDoctorCounts(res.data.doctorCounts);
      const hospitalOptions = res.data.hospitalCounts.map(
        (hospital: Hospital) => ({
          value: hospital.id,
          label: hospital.name,
          children: hospital.children?.map((doctor: Doctor) => ({
            value: doctor.id,
            label: doctor.name,
          })),
        })
      );
      const doctorOptions = res.data.doctorCounts.map((doctor: Doctor) => ({
        value: doctor.id,
        label: `${doctor.name}医生`,
        hospitalId: doctor.hospitalId,
      }));
      assignDoctorsToHospitals(doctorOptions, hospitalOptions);
      setLayoutData(hospitalOptions);
    } else {
      message.error('获取失败');
    }
  };
  useEffect(() => {
    getOrderInfo();
  }, []);
  return (
    <>
      <AdOrder open={open} refresh={refresh} userCounts={userCounts} patientCounts={patientCounts} layoutData={layoutData}/>
      <Card title="筛选订单">
        <Search onFilterChange={handleFilterChange} hospitalCounts={hospitalCounts} />
      </Card>
      <Card
        title="订单列表"
        extra={
          <Space>
            <Button
              type="primary"
              size="small"
              style={{ fontSize: '14px' }}
              onClick={handleClick}
            >
              新增订单
            </Button>
            <Button
              danger
              size="small"
              style={{ fontSize: '14px' }}
              onClick={handleDelete}
            >
              批量删除
            </Button>
          </Space>
        }
        style={{ width: '100%', marginTop: '20px' }}
      >
        <Table
          data={data}
          pagination={pagination}
          onTableChange={handleTableChange}
          deleteNum={deleteNum}
          refresh={refresh}
          userCounts={userCounts}
          patientCounts={patientCounts}
          hospitalCounts={hospitalCounts}
          doctorCounts={doctorCounts}
        />
      </Card>
    </>
  );
};
export default Order;
