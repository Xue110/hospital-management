import { Button, Card, Space } from 'antd';
import './index.scss';
import { useCallback, useEffect, useState } from 'react';
import FormDoctor from './Form';
import TableComponent from './Table';
import { getWardList } from '../../../apis/hospital';
const Ward = () => {
  const [data, setData] = useState<any[]>([
    {
      id:1,
      number: '301', //病房号
      departmentId: 1, // 科室id
      departmentName: '内科', // 科室名称
      fee: 1000, // 住院费用
      totalBeds: 10, // 总床位数
      availableBeds: 5, // 可用床位数
      beds:[
        {
          id:1, //病床id
          roomsId:1, //病房id
          bedNumber: '301-1', //病床号
          status: 1, // 状态 0：空床 1：已入住 2：维修中
          createTime: '2022-01-01 12:00:00', // 创建时间
        },
        {
          id:2, //病床id
          roomsId:1, //病房id
          bedNumber: '301-2', //病床号
          status: 1, // 状态 0：空床 1：已入住 2：维修中
          createTime: '2022-01-01 12:00:00', // 创建时间
        }
      ]
    },
    {
      id:2,
      number: '302', //病房号
      departmentId: 2, // 科室id
      departmentName: '外科', // 科室名称
      fee: 2000, // 住院费用
      totalBeds: 10, // 总床位数
      availableBeds: 5, // 可用床位数
      children:[
        {
          id:3, //病床id
          roomsId:2, //病房id
          bedNumber: '302-1', //病床号
          status: 1, // 状态 0：空床 1：已入住 2：维修中
          createTime: '2022-01-01 12:00:00', // 创建时间
        },
        {
          id:4, //病床id
          roomsId:2, //病房id
          bedNumber: '302-2', //病床号
          status: 1, // 状态 0：空床 1：已入住 2：维修中
          createTime: '2022-01-01 12:00:00', // 创建时间
        }
      ]
    }
  ]);
  const [open, setOpen] = useState<number>(0);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: data.length,
  });
  const [info, setInfo] = useState<any>();
  // 新增订单
  const handleClick = () => {
    setInfo({} as any);
    setOpen(open + 1);
  };
  // 获取住院列表数据
  const getData = async () => {
    const data = {
      page: pagination.page,
      pageSize: pagination.pageSize,
    };
    const res = await getWardList(data);
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
  useEffect(() => {
    getData();
  }, [pagination.page, pagination.pageSize]);
  // 使用 useCallback 缓存 fetchData 函数的引用
  const refresh = useCallback(() => {
    getData();
  }, [pagination.page, pagination.pageSize]);
  // 修改床位
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
      <Card
        title="病房列表"
        extra={
          <Space>
            <Button
              type="primary"
              size="small"
              style={{ fontSize: '14px' }}
              onClick={handleClick}
            >
              添加病房
            </Button>
          </Space>
        }
        style={{ width: '100%', marginTop: '20px' }}
      >
        <TableComponent
          data={data}
          pagination={pagination}
          onTableChange={handleTableChange}
          refresh={refresh}
          onEdit={onEdit}
          paginationCount={paginationCount}
        />
      </Card>
    </>
  );
};
export default Ward;
