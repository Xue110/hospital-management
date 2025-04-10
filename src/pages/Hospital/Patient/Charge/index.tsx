import { Button, Card, Space } from 'antd';
import './index.scss';
import { useCallback, useEffect, useState } from 'react';
import FormDoctor from './Form';
import Search from './Search';
import TableComponent from './Table';
import { getChargeList } from '../../../../apis/patient';
import { useSelector } from 'react-redux';
const Charge = () => {
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const [data, setData] = useState<any[]>([
    {
      id: 1,
      patientName: '张三',
      doctorName: '李四',
      hospitalName: '北京医院',
      total: 100,
      date: '2022-01-01',
      paymentStatus: 2,
      paymentMethod: 1,
      type: 3,
      patientId: 1,
      doctorId: 2,
      hospitalId: 3,
      userId: 4,
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
  // 获取收费记录列表数据
  const getData = async () => {
    const data = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      doctorId: userInfo.roleId === 3 ? userInfo.id : filterData?.doctorId,
      patientId: filterData?.patientId,
      hospitalId: userInfo.roleId === 1 ? filterData?.hospitalId : userInfo.id,
      type: filterData?.type,
    };
    const res = await getChargeList(data);
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
  const paginationCount = () => {
    setPagination({
      page: pagination.page - 1,
      pageSize: pagination.pageSize,
      total: data.length,
    });
  };
  return (
    <>
      <FormDoctor open={open} refresh={refresh} />
      <Card title="筛选收费记录">
        <Search onFilterChange={handleFilterChange} />
      </Card>
      <Card
        title="收费记录列表"
        extra={
          <Space>
            <Button
              type="primary"
              size="small"
              style={{ fontSize: '14px' }}
              onClick={handleClick}
            >
              添加收费记录
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
export default Charge;
