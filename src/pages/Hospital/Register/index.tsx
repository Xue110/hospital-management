import { Button, Card, Space } from 'antd';
import './index.scss';
import { useCallback, useEffect, useState } from 'react';
import FormDoctor from './Form';
import Search from './Search';
import TableComponent from './Table';
import { getRegisterList } from '../../../apis/hospital';
import { useSelector } from 'react-redux';
const Register = () => {
  const [data, setData] = useState<any[]>([
    {
      id:1,
      patientId: 1,
      doctorId:1, // 医生id
      departmentId:1, // 科室id
      hospitalId:1, // 医院id
      status:1, // 1.待确认 2.已确认 3.已就诊 4.已取消
      paymentStatus:1, // 1.未支付 2.已支付 3.已退款
      paymentAmount:100, // 支付金额
      createTime:'2023-01-01', // 创建时间
      updateTime:'2023-01-01', // 更新时间
      patientName:'张三', // 患者姓名
      doctorName:'李四', // 医生姓名
      departmentName:'内科', // 科室名称
      hospitalName:'北京医院', // 医院名称
      date: '2023-01-01', // 挂号日期
      startTime: '2023-02-02 08:00:00', // 开始挂号时间
      endTime: '2023-02-02 08:30:00' // 结束挂号时间
    },
  ]);
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const [open, setOpen] = useState<number>(0);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: data.length,
  });
  const [filterData, setFilterData] = useState<any>();
  //删除次数
  const [deleteNum, setDeleteNum] = useState(0);
  const [info, setInfo] = useState<any>();
  // 新增订单
  const handleClick = () => {
    setInfo({} as any);
    setOpen(open + 1);
  };
  // 批量删除
  const handleDelete = () => {
    setDeleteNum(deleteNum + 1);
  };
  // 获取挂号列表数据
  const getData = async () => {
    const data = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      patientId: filterData?.patientId,
      doctorId: filterData?.doctorId,
      departmentId: filterData?.departmentId,
      hospitalId: userInfo.roleId === 2 ? userInfo.id : filterData?.hospitalId,
      startTime: filterData?.startTime,
      endTime: filterData?.endTime,
    };
    const res = await getRegisterList(data);
    setData(res.data.records);
    setPagination({
      page: pagination.page,
      pageSize: pagination.pageSize,
      total: res.data.total,
    });
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
  const handleFilterChange = (filterData: any) => {
    setFilterData(filterData);
  };
  useEffect(() => {
    getData();
  }, [pagination.page, pagination.pageSize, filterData]);
  // 使用 useCallback 缓存 fetchData 函数的引用
  const refresh = useCallback(() => {
    getData();
  }, [pagination.page, pagination.pageSize, filterData]);
  // 修改挂号信息
  const onEdit = (record: any) => {
    setInfo(record);
    setOpen(open + 1);
  };
  //修改分页器数据
  const paginationCount = (() => {
    setPagination({
      page: pagination.page-1,
      pageSize: pagination.pageSize,
      total: data.length,
    });
  })
  return (
    <>
      <FormDoctor
        open={open}
        refresh={refresh}
        info={info ? info : undefined}
      />
      <Card title="筛选挂号记录">
        <Search onFilterChange={handleFilterChange} />
      </Card>
      <Card
        title="挂号记录列表"
        extra={
          <Space>
            <Button
              type="primary"
              size="small"
              style={{ fontSize: '14px' }}
              onClick={handleClick}
            >
              添加挂号记录
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
        <TableComponent
          data={data}
          pagination={pagination}
          onTableChange={handleTableChange}
          deleteNum={deleteNum}
          refresh={refresh}
          onEdit={onEdit}
          paginationCount={paginationCount}
        />
      </Card>
    </>
  );
};
export default Register;
