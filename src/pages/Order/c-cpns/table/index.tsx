import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  message,
  Drawer,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Card,
  Col,
  Row,
} from 'antd';
import './index.scss';
import { DeleteOutlined, EyeOutlined, FormOutlined } from '@ant-design/icons';
import { DataType, TableProps } from '../../../../type/order';
import {
  batchDeleteOrder,
  deleteOrder,
  updateOrder,
} from '../../../../apis/order';
import Title from 'antd/es/typography/Title';

const TableComponent: React.FC<TableProps> = (props) => {
  // 表格数据
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  // 详情数据
  const [detailData, setDetailData] = useState<DataType>();
  // 选中行ID
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    form.validateFields().then(async (values) => {
      const res = await updateOrder({ ...values, id: detailData?.id });
      if (res.code === 200) {
        message.success('修改成功');
        form.resetFields();
        props.refresh();
      } else {
        message.error('修改失败');
      }
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  useEffect(() => {
    setDataSource(props.data);
  }, [props.data]);
  const type = {
    1: <Tag color="magenta">挂号</Tag>,
    2: <Tag color="green">治疗</Tag>,
    3: <Tag color="blue">其他</Tag>,
  };
  const method = {
    1: <Tag color="volcano">支付宝支付</Tag>,
    2: <Tag color="purple">微信支付</Tag>,
    3: <Tag color="red">余额支付</Tag>,
  };
  const status = {
    1: <Tag color="#87d068">待支付</Tag>,
    2: <Tag color="#108ee9">已支付</Tag>,
    3: <Tag color="#2db7f5">已取消</Tag>,
    4: <Tag color="gold">已超时</Tag>,
  };
  const hospital = {
    1: '吉林省人民医院',
    2: '长春市第一医院',
    3: '吉林大学第一医院',
    4: '吉林省中医院',
    5: '长春市第二医院',
    6: '吉林省肿瘤医院',
    7: '长春市儿童医院',
    8: '长春市妇产医院',
    9: '吉林省心血管病医院',
    10: '松原市人民医院',
  };
  const renderHosptial = (text: any) => {
    // 类型断言
    return hospital[text as keyof typeof hospital];
  };
  const renderType = (text: any) => {
    // 类型断言
    return type[text as keyof typeof type];
  };
  const renderMethod = (text: any) => {
    // 类型断言
    return method[text as keyof typeof method];
  };
  const renderStatus = (text: any) => {
    // 类型断言
    return status[text as keyof typeof status];
  };
  // 表格列
  const columns = [
    {
      title: '订单号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '订单金额',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: '订单日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '订单类型',
      dataIndex: 'type',
      key: 'type',
      render: renderType,
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: renderStatus,
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: renderMethod,
    },
    {
      title: '医院名称',
      dataIndex: 'hospitalId',
      key: 'hospitalId',
      render: renderHosptial,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: DataType) => (
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

  // 查看订单详情
  const viewDetails = (record: DataType) => {
    setDetailData(record);
    showDrawer();
  };

  // 删除订单
  const handleDelete = async (record: DataType) => {
    const res = await deleteOrder(record.id);
    if (res.code === 200) {
      message.success('删除成功');
      if(dataSource.length === 1 && props.pagination.page > 1) {
        props.paginationCount()
      }else{
        props.refresh();
      }
    } else {
      message.error('删除失败');
    }
  };
  // 编辑订单
  const handleEdit = (record: DataType) => {
    showModal();
    setDetailData(record);
  };
  // 批量删除
  const handleBatchDelete = async () => {
    const res = await batchDeleteOrder(selectedRowIds);
    if (res.code === 200) {
      message.success('删除成功');
      if(dataSource.length === selectedRowIds.length && props.pagination.page > 1) {
        props.paginationCount()
      }else{
        props.refresh();
      }
    } else {
      message.error('删除失败');
    }
  };
  useEffect(() => {
    if (props.deleteNum) {
      handleBatchDelete();
    }
  }, [props.deleteNum]);
  // 行选择
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`);
      setSelectedRowIds(
        selectedRows.filter((item) => item.id).map((item) => item.id)
      );
    },
  };
  return (
    <div className="order-table">
      <Modal
        title="修改订单状态"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          style: {
            fontSize: '15px',
            padding: '6px 12px',
            height: '40px',
            width: '80px',
            lineHeight: '35px',
          },
        }}
        cancelButtonProps={{
          style: {
            fontSize: '15px',
            padding: '6px 15px',
            height: '40px',
            width: '80px',
            lineHeight: '35px',
          },
        }}
      >
        <Form form={form}>
          <Form.Item label="订单号">
            <Input value={detailData?.id} disabled />
          </Form.Item>
          <Form.Item
            label="订单状态"
            name={'paymentStatus'}
            initialValue={detailData?.paymentStatus}
          >
            <Select placeholder="请选择订单状态">
              <Select.Option value={1}>未支付</Select.Option>
              <Select.Option value={2}>已支付</Select.Option>
              <Select.Option value={3}>已取消</Select.Option>
              <Select.Option value={4}>已超时</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Drawer title="订单详情" onClose={onClose} open={open} width={600}>
      <Card bordered={false}>
        <Row gutter={24}>
          {/* 订单编号 */}
          <Col span={12}>
            <Title level={5}>订单编号</Title>
            <p>{detailData?.id}</p>
          </Col>

          {/* 订单日期 */}
          <Col span={12}>
            <Title level={5}>订单日期</Title>
            <p>{detailData?.date}</p>
          </Col>

          {/* 支付状态 */}
          <Col span={12}>
            <Title level={5}>支付状态</Title>
            <p>
              {detailData?.paymentStatus === 1
                ? '未支付'
                : detailData?.paymentStatus === 2
                ? '已支付'
                : detailData?.paymentStatus === 3
                ? '已取消'
                : '已超时'}
            </p>
          </Col>

          {/* 医生 */}
          <Col span={12}>
            <Title level={5}>负责医生</Title>
            <p>
              {
                props.doctorCounts.find(
                  (item) => Number(item.id) === detailData?.doctorId
                )?.name
              }
            </p>
          </Col>

          {/* 医院 */}
          <Col span={12}>
            <Title level={5}>医院</Title>
            <p>
              {
                props.hospitalCounts.find(
                  (item) => Number(item.id) === detailData?.hospitalId
                )?.name
              }
            </p>
          </Col>

          {/* 患者 */}
          <Col span={12}>
            <Title level={5}>患者姓名</Title>
            <p>
              {
                props.patientCounts.find(
                  (item) => Number(item.id) === detailData?.patientId
                )?.name
              }
            </p>
          </Col>

          {/* 支付方式 */}
          <Col span={12}>
            <Title level={5}>支付方式</Title>
            <p>
              {detailData?.paymentMethod === 1
                ? '支付宝'
                : detailData?.paymentMethod === 2
                ? '微信'
                : '余额支付'}
            </p>
          </Col>

          {/* 订单类型 */}
          <Col span={12}>
            <Title level={5}>订单类型</Title>
            <p>
              {detailData?.type === 1
                ? '挂号'
                : detailData?.type === 2
                ? '住院'
                : '其他'}
            </p>
          </Col>

          {/* 总金额 */}
          <Col span={12}>
            <Title level={5}>总金额</Title>
            <p>{detailData?.total}</p>
          </Col>

          {/* 创建时间 */}
          <Col span={12}>
            <Title level={5}>创建时间</Title>
            <p>{detailData?.createTime}</p>
          </Col>
        </Row>
      </Card>
    </Drawer>
      <Table
        rowSelection={rowSelection}
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
