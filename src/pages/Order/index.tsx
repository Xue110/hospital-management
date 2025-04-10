import { Button, Card, Space } from 'antd';
import './index.scss';
import Search from './c-cpns/search';
import Table from './c-cpns/table';
import { useCallback, useEffect, useState } from 'react';
import { DataType, filterType } from '../../type/order';
import { getOrderList } from '../../apis/order';
import AdOrder from './c-cpns/AdOrder';
import { useSelector } from 'react-redux';
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
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const [open, setOpen] = useState<number>(0);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: data.length,
  });
  const [filterData, setFilterData] = useState<filterType>();
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
  // 获取订单列表数据
  const getData = async () => {
    const data = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      id: filterData?.id,
      hospitalId:
        userInfo.roleId === 1 ? filterData?.hospitalId : userInfo.id,
      paymentStatus: filterData?.paymentStatus,
    };
    const res = await getOrderList(data);
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
      <AdOrder open={open} refresh={refresh} />
      <Card title="筛选订单">
        <Search onFilterChange={handleFilterChange} />
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
          paginationCount={paginationCount}
        />
      </Card>
    </>
  );
};
export default Order;
