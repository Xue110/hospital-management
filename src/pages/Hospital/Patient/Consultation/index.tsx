import { Button, Card, Space } from 'antd';
import './index.scss';
import { useCallback, useEffect, useState } from 'react';
import FormDoctor from './Form';
import Search from './Search';
import TableComponent from './Table';
import { getVisitList } from '../../../../apis/patient';
import { useSelector } from 'react-redux';
const Consultation = () => {
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const [data, setData] = useState<any[]>([
    {
      id: 1,
      patientName: '张三',
      doctorName: '李四',
      hospitalName: '北京医院',
      departmentName: '内科',
      date: '2022-01-01', //挂号日期
      status: 1, //挂号状态 1：待确认 2.已确认 3：已就诊 4：已取消
      paymentStatus: 1, //支付状态 1：未支付 2：已支付 3.已取消
      paymentAmount: 100, //支付金额
      startTime: '2022-01-01 09:00:00', //就诊开始时间
      endTime: '2022-01-01 10:00:00', //就诊结束时间
      userId: 1,
      doctorId: 1,
      hospitalId: 1,
      departmentId: 1,
      patientId: 1,
    },
  ]);
  const [open, setOpen] = useState<number>(0);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: data.length,
  });
  const [filterData, setFilterData] = useState<any>();
  //删除次数
  const [deleteNum, setDeleteNum] = useState(0);
  // 新增订单
  const handleClick = () => {
    setOpen(open + 1);
  };
  // 批量删除
  const handleDelete = () => {
    setDeleteNum(deleteNum + 1);
  };
  // 获取就诊记录列表数据
  const getData = async () => {
    const data = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      doctorId: userInfo.roleId === 3 ? userInfo.id : filterData?.doctorId,
      patientId: filterData?.patientId,
      hospitalId: userInfo.roleId ===2 ? userInfo.id : filterData?.hospitalId,
      departmentId: filterData?.departmentId,
    };
    const res = await getVisitList(data);
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
      />
      <Card title="筛选就诊记录">
        <Search onFilterChange={handleFilterChange} />
      </Card>
      <Card
        title="就诊记录列表"
        extra={
          <Space>
            <Button
              type="primary"
              size="small"
              style={{ fontSize: '14px' }}
              onClick={handleClick}
            >
              添加就诊记录
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
          paginationCount={paginationCount}
        />
      </Card>
    </>
  );
};
export default Consultation;
