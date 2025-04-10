import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  message,
  Drawer,
  Tag,
  Card,
  Col,
  Row,
  Badge,
} from 'antd';
import './index.scss';
import { DeleteOutlined, EyeOutlined, FormOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import { deleteWard } from '../../../../apis/hospital';
import { useSelector } from 'react-redux';

const TableComponent = (props: any) => {
  const hospitalData = useSelector((state: any) => state.hospital.hospitalList);
  // 表格数据
  const [dataSource, setDataSource] = useState<any[]>([]);
  // 详情数据
  const [detailData, setDetailData] = useState<any>();
  console.log(detailData)
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const data = props.data.map((item: any) => {
      return {
        ...item,
        key: item.id,
      };
    });
    setDataSource(data);
  }, [props.data]);
  // 表格列
  const columns = [
    {
      title: '病房ID',
      dataIndex: 'id',
      key: 'id',
      width: '8%',
    },
    {
      title: '病房号',
      dataIndex: 'number',
      key: 'number',
      width: '8%',
    },
    {
      title: '科室',
      dataIndex: 'departmentId',
      key: 'departmentId',
      render: (departmentId: any) => {
        return hospitalData.departmentCounts.find((item: any) => item.id === departmentId).name;
      },
      width: '8%',
    },
    {
      title: '费用',
      dataIndex: 'fee',
      key: 'fee',
      width: '8%',
      render: (fee: any) => {
        return <Tag color={'purple'}>{fee}元</Tag>;
      },
    },
    {
      title: '总床位数',
      dataIndex: 'totalBeds',
      key: 'totalBeds',
      width: '8%',
    },
    {
      title: '可用床位',
      dataIndex: 'availableBeds',
      key: 'availableBeds',
      width: '8%',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <>
          <Button
            style={{ width: '120px', fontSize: '14px' }}
            type="primary"
            onClick={() => viewDetails(record)}
            shape="round"
            icon={<EyeOutlined />}
          >
            查看详情
          </Button>
          <Button
            style={{ width: '40px', border: '0px' }}
            onClick={() => handleDelete(record)}
            type="primary"
            danger
            shape="circle"
            icon={<DeleteOutlined />}
          />
        </>
      ),
    },
  ];

  // 分页变更处理
  const handleChange = (pagination: any) => {
    // 当分页发生变化时调用父组件传递的回调函数
    props.onTableChange(pagination);
  };

  // 查看病房详情
  const viewDetails = (record: any) => {
    setDetailData(record);
    showDrawer();
  };

  // 删除病房
  const handleDelete = async (record: any) => {
    const res = await deleteWard(record.id);
    if (res.code === 200) {
      message.success('删除成功');
      if (dataSource.length === 1 && props.pagination.page > 1) {
        props.paginationCount();
      } else {
        props.refresh();
      }
    } else {
      message.error('删除失败');
    }
  };
  // 编辑病房
  const handleEdit = (record: any) => {
    props.onEdit(record);
  };
  const expandColumns = [
    { title: '床位ID', dataIndex: 'id', key: 'id' },
    { title: '病床号', dataIndex: 'bedNumber', key: 'bedNumber' },
    {
      title: '当前病房状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: any) =>
        status === 1 ? (
          <Badge status="default" text="未入住" />
        ) : status === 2 ? (
          <Badge status="success" text="已入住" />
        ) : (
          <Badge status="error" text="维修中" />
        ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Button
          style={{ width: '40px' }}
          onClick={() => handleEdit(record)}
          color="primary"
          variant="outlined"
          shape="circle"
          icon={<FormOutlined />}
        />
      ),
    },
  ];
  return (
    <div className="order-table">
      <Table
        rowKey="id"
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (
            <Table
              columns={expandColumns}
              dataSource={record.beds}
              pagination={false}
            />
          ),
          defaultExpandedRowKeys: [1],
        }}
        dataSource={dataSource}
        pagination={{
          current: props.pagination.page,
          pageSize: props.pagination.pageSize,
          total: props.pagination.total,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '30', '40'],
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条数据`,
        }}
        size="middle"
        onChange={handleChange}
      />
      <Drawer title="病房详情" onClose={onClose} open={open} width={600}>
        <Card bordered={false}>
          <Row gutter={24}>
            {/* 病房ID */}
            <Col span={12}>
              <Title level={5}>病房ID</Title>
              <p>{detailData?.id}</p>
            </Col>
            {/* 病房号 */}
            <Col span={12}>
              <Title level={5}>病房号</Title>
              <p>{detailData?.number}</p>
            </Col>
            {/* 科室 */}
            <Col span={12}>
              <Title level={5}>科室</Title>
              <p>{hospitalData.departmentCounts.find((item: any) => item.id === detailData?.departmentId)?.name}</p>
            </Col>
            {/* 床位数量 */}
            <Col span={12}>
              <Title level={5}>床位数量</Title>
              <p>{detailData?.totalBeds}</p>
            </Col>
            {/* 住院费用 */}
            <Col span={12}>
              <Title level={5}>住院费用</Title>
              <p>{detailData?.fee}元</p>
            </Col>
            {/* 可用床位数 */}
            <Col span={12}>
              <Title level={5}>可用床位数</Title>
              <p>{detailData?.availableBeds}</p>
            </Col>
          </Row>
        </Card>
        <Card title={'床位信息'} bordered={false}>
          <Row gutter={24}>
            {detailData?.beds.map((bed: any) => (
              <Col span={8} key={bed.id}>
                <Card bordered={false} style={{ marginBottom: 16 }}>
                  <p>
                    <strong>病床号：</strong>
                    {bed.bedNumber}
                  </p>
                  <p>
                    <strong>状态：</strong>
                    {bed.status === 1
                      ? '空闲'
                      : bed.status === 2
                      ? '已入住'
                      : '维修中'}
                  </p>
                  <p>
                    <strong>创建时间：</strong>
                    {bed.createTime}
                  </p>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </Drawer>
    </div>
  );
};

export default TableComponent;
