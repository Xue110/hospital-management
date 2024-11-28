import { Button, Card, Space } from 'antd';
import './index.scss';
import { useCallback, useEffect, useState } from 'react';
import { getHospitalList } from '../../../apis/hospital';
import Search from './HospitalSearch';
import TableComponent from './HospitalTable';
import { Hospital } from '../../../type/hospital';
import AdHospital from './HospitalAdd';
const HospitalInfo = () => {
  const [data, setData] = useState<Hospital[]>([
    {
      id: 1,
      name: '北京医院',
      address: '北京市',
      phone: '123456789',
      createTime: '2022-01-01',
      updateTime: '2022-01-01',
      image:
        'https://www.sztv.com.cn/ysz/upload/Image/mrtp/2022/06/09/b4d9d362ee6241dbb9eefae332b66741.jpg',
      website: 'https://www.baidu.com',
      description: '北京医院是北京市的一所大型综合性医院',
      citiesId: 2,
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
  const [info, setInfo] = useState<Hospital>();
  // 新增订单
  const handleClick = () => {
    setInfo({} as Hospital);
    setOpen(open + 1);
  };
  // 批量删除
  const handleDelete = () => {
    setDeleteNum(deleteNum + 1);
  };
  // 获取医院列表数据
  const getData = async () => {
    const data = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      id: filterData?.id,
      hospitalId: filterData?.hospitalId,
      paymentStatus: filterData?.paymentStatus,
    };
    const res = await getHospitalList(data);
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
  // 修改医院信息
  const onEdit = (record: Hospital) => {
    setInfo(record);
    setOpen(open + 1);
  };
  return (
    <>
      <AdHospital
        open={open}
        refresh={refresh}
        info={info ? info : undefined}
      />
      <Card title="筛选医院">
        <Search onFilterChange={handleFilterChange} />
      </Card>
      <Card
        title="医院列表"
        extra={
          <Space>
            <Button
              type="primary"
              size="small"
              style={{ fontSize: '14px' }}
              onClick={handleClick}
            >
              新增医院
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
        />
      </Card>
    </>
  );
};
export default HospitalInfo;
