import { Button, Card, Space } from 'antd';
import './index.scss';
import { useCallback, useEffect, useState } from 'react';
import FormDoctor from './Form';
import Search from './Search';
import TableComponent from './Table';
import { useSelector } from 'react-redux';
import { getScheduleList } from '../../apis/hospital';
const Reservation = () => {
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const [data, setData] = useState<any[]>([
    {
      id:1,
      doctorName: '张三',
      hospitalName: '北京医院',
      departmentName: '内科',
      hosptalId: 1,
      doctorId: 1,
      departmentId:1,
      date: '2022-01-01',
      startTime: '08:00:00',
      endTime: '12:00:00',
      maxAppointments: 10,
      availableAppointments: 5,
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
  // 获取医院排班列表数据
  const getData = async () => {
    const data = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      hospitalId: userInfo.roleId === 1 ? filterData?.hospitalId : userInfo.id,
      doctorId:filterData?.doctorId,
      date: filterData?.date,
    };
    const res = await getScheduleList(data);
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
  // 修改医院排班信息
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
      <Card title="筛选医院排班记录">
        <Search onFilterChange={handleFilterChange} />
      </Card>
      <Card
        title="医院排班记录列表"
        extra={
          <Space>
            <Button
              type="primary"
              size="small"
              style={{ fontSize: '14px' }}
              onClick={handleClick}
            >
              添加医院排班记录
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
export default Reservation;
