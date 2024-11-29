import { Button, Card, Space } from 'antd';
import './index.scss';
import { useCallback, useEffect, useState } from 'react';
import FormDataSource from './Form';
import Search from './Search';
import TableComponent from './Table';
import { getDepartmentList } from '../../../apis/department';
const Department = () => {
  const [data, setData] = useState<any[]>([
    {
      id: 1,
      name: '内科',
      description:'内科是科室中最重要的科室之一，主要负责治疗各种内科疾病，如心血管疾病、呼吸系统疾病、消化系统疾病、泌尿系统疾病等。内科医生需要具备丰富的医学知识和临床经验，能够对患者的病情进行准确的诊断和治疗。内科疾病的治疗通常需要长期观察和药物治疗，因此内科医生需要具备良好的沟通能力和医患关系。',
      createTime:'2023-01-01',
      updateTime:'2023-01-01'
    },
    {
      id: 2,
      name: '外科',
      description:'外科是科室中最重要的科室之一，主要负责治疗各种外科疾病，如骨折、肿瘤、心脏手术、肝脏手术等。外科医生需要具备丰富的医学知识和临床经验，能够对患者的病情进行准确的诊断和治疗。外科疾病的治疗通常需要手术，因此外科医生需要具备良好的手术技术和医患关系。',
      createTime:'2023-01-01',
      updateTime:'2023-01-01'
    }
  ]);
  const [open, setOpen] = useState<number>(0);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: data.length,
  });
  const [filterData, setFilterData] = useState<any>();
  const [info, setInfo] = useState<any>();
  // 新增订单
  const handleClick = () => {
    setInfo({} as any);
    setOpen(open + 1);
  };
  // 获取科室列表数据
  const getData = async () => {
    const data = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      id: filterData?.id,
      name: filterData?.name,
    };
    const res = await getDepartmentList(data);
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
  // 修改科室信息
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
      <FormDataSource
        open={open}
        refresh={refresh}
        info={info ? info : undefined}
      />
      <Card title="筛选科室">
        <Search onFilterChange={handleFilterChange} />
      </Card>
      <Card
        title="科室列表"
        extra={
          <Space>
            <Button
              type="primary"
              size="small"
              style={{ fontSize: '14px' }}
              onClick={handleClick}
            >
              新增科室
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
export default Department;
