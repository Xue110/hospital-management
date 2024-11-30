import { useEffect, useState } from 'react';
import { Table, Button, message, Drawer, Card, Col, Row, Tooltip } from 'antd';
import './index.scss';
import { DeleteOutlined, EyeOutlined, FormOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import { deleteDepartment } from '../../../../apis/department';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../type/login';
import { getHospitalData } from '../../../../store/module/storge';

const TableComponent = (props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  // 表格数据
  const [dataSource, setDataSource] = useState<any[]>([]);
  // 详情数据
  const [detailData, setDetailData] = useState<any>();
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    setDataSource(props.data);
  }, [props.data]);
  // 表格列
  const columns = [
    {
      title: '科室ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
    },
    {
      title: '科室名称',
      dataIndex: 'name',
      key: 'name',
      width: '10%',
    },
    {
      title: '科室简介',
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: false,
      },
      render: (description: any) => (
        <Tooltip placement="topLeft" title={description}>
          {description}
        </Tooltip>
      ),
      width: '30%',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: '15%',
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
            style={{ width: '40px' }}
            onClick={() => handleEdit(record)}
            color="primary"
            variant="outlined"
            shape="circle"
            icon={<FormOutlined />}
          />
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

  // 查看科室详情
  const viewDetails = (record: any) => {
    setDetailData(record);
    showDrawer();
  };

  // 删除科室
  const handleDelete = async (record: any) => {
    const res = await deleteDepartment(record.id);
    if (res.code === 200) {
      message.success('删除成功');
      if (dataSource.length === 1 && props.pagination.page > 1) {
        props.paginationCount();
      } else {
        props.refresh();
      }
      await dispatch(getHospitalData());
    } else {
      message.error('删除失败,请删除当前科室下的相关医生、患者等信息后重试');
    }
  };
  // 编辑科室信息
  const handleEdit = (record: any) => {
    props.onEdit(record);
  };

  return (
    <div className="order-table">
      <Drawer title="科室详情" onClose={onClose} open={open} width={600}>
        <Card bordered={false}>
          <Row gutter={24}>
            {/* 科室ID */}
            <Col span={12}>
              <Title level={5}>科室ID</Title>
              <p>{detailData?.id}</p>
            </Col>
            {/* 科室名称 */}
            <Col span={12}>
              <Title level={5}>科室名称</Title>
              <p>{detailData?.name}</p>
            </Col>
            {/* 科室简介 */}
            <Col span={24}>
              <Title level={5}>科室简介</Title>
              <p>{detailData?.description}</p>
            </Col>
          </Row>
        </Card>
      </Drawer>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={{
          current: props.pagination.page,
          pageSize: props.pagination.pageSize,
          total: props.pagination.total,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '30', '40'],
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条数据`,
        }}
        onChange={handleChange} // 监听分页变更
      />
    </div>
  );
};

export default TableComponent;
