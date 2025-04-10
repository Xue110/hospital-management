import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  message,
  Drawer,
  Tag,
  Card,
  Col,
  Row,
  Tooltip,
} from 'antd';
import './index.scss';
import { DeleteOutlined, EyeOutlined, FormOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import {  deleteRegister, deleteRegisterBatch } from '../../../../apis/hospital';

const TableComponent = (props: any) => {
  // 表格数据
  const [dataSource, setDataSource] = useState<any[]>([]);
  const processedDataSource = dataSource.map(item => ({
    ...item,  // 保留原始字段
    time: `${item.startTime} - ${item.endTime}`  // 合并 startTime 和 endTime 为 time
  }));
  // 详情数据
  const [detailData, setDetailData] = useState<any>();
  // 选中行ID
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
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
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '4%',
    },
    {
      title: '患者名',
      dataIndex: 'patientName',
      key: 'patientName',
      width: '8%',
    },
    {
      title: '指定医生',
      dataIndex: 'doctorName',
      key: 'doctorName',
      width: '8%',
    },
    {
      title: '科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: '5%',
      render: (departmentName: any) => {
        return <Tag color={'orange'}>{departmentName}</Tag>;
      },
    },
    {
      title: '所在医院',
      dataIndex: 'hospitalName',
      key: 'hospitalName',
      width: '10%',
      render: (hospitalName: any) => {
        return <Tag color={'purple'}>{hospitalName}</Tag>;
      },
    },
    {
      title:'金额',
      dataIndex: 'paymentAmount',
      key: 'paymentAmount',
      width: '6%',
      render: (paymentAmount: any) => {
        return <Tag color={'blue'}>{paymentAmount}元</Tag>;
      }
    },
    {
      title: '挂号日期',
      dataIndex: 'date',
      key: 'date',
      width: '8%',
    },
    {
      title: '预约时间',
      dataIndex: 'time',
      key: 'time',
      width: '8%',
      ellipsis: {
        showTitle: false,
      },
      render: (time: any) => (
        <Tooltip placement="topLeft" title={time}>
          {time}
        </Tooltip>
      ),
    },
    {
      title: '状态',// 1.待确认 2.已确认 3.已就诊 4.已取消
      dataIndex: 'status',
      key: 'status',
      width: '8%',
      render: (status: any) => {
        return status === 1 ? <Tag color={'green'}>待确认</Tag> : status === 2 ? <Tag color={'red'}>已确认</Tag> : status === 3 ? <Tag color={'blue'}>已就诊</Tag> : <Tag color={'orange'}>已取消</Tag>;
      }
    },
    {
      title: '支付状态',// 1.未支付 2.已支付 3.已退款
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: '8%',
      render: (paymentStatus: any) => {
        return paymentStatus === 1 ? <Tag color={'green'}>未支付</Tag> : paymentStatus === 2 ? <Tag color={'red'}>已支付</Tag> : <Tag color={'orange'}>已退款</Tag>;
      }
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

  // 查看订单详情
  const viewDetails = (record: any) => {
    setDetailData(record);
    showDrawer();
  };

  // 删除订单
  const handleDelete = async (record: any) => {
    const res = await deleteRegister(record.id);
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
  // 编辑订单
  const handleEdit = (record: any) => {
    props.onEdit(record);
  };
  // 批量删除
  const handleBatchDelete = async () => {
    const res = await deleteRegisterBatch(selectedRowIds);
    if (res.code === 200) {
      message.success('删除成功');
      if (
        dataSource.length === selectedRowIds.length &&
        props.pagination.page > 1
      ) {
        props.paginationCount();
      } else {
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
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`);
      setSelectedRowIds(
        selectedRows.filter((item) => item.id).map((item) => item.id)
      );
    },
  };
  return (
    <div className="order-table">
      <Drawer title="挂号详情" onClose={onClose} open={open} width={600}>
        <Card bordered={false}>
          <Row gutter={24}>
            {/* 挂号ID */}
            <Col span={12}>
              <Title level={5}>挂号记录ID</Title>
              <p>{detailData?.id}</p>
            </Col>
            {/* 挂号名称 */}
            <Col span={12}>
              <Title level={5}>患者名</Title>
              <p>{detailData?.patientName}</p>
            </Col>
            {/* 挂号时间 */}
            <Col span={12}>
              <Title level={5}>挂号时间</Title>
              <p>{detailData?.date}</p>
            </Col>
            {/* 预约 */}
            <Col span={12}>
              <Title level={5}>预约时间段</Title>
              <p>{detailData?.startTime}-{detailData?.endTime}</p>
            </Col>
            {/* 挂号状态： 1.待确认 2.已确认 3.已就诊 4.已取消 */}
            <Col span={12}>
              <Title level={5}>挂号状态</Title>
              <p>{detailData?.status === 1 ? '待确认' : detailData?.status === 2 ? '已确认' : detailData?.status === 3 ? '已就诊' : '已取消'}</p>
            </Col>
            {/* 挂号费用 */}
            <Col span={12}>
              <Title level={5}>挂号费用</Title>
              <p>{detailData?.paymentAmount}元</p>
            </Col>
            {/* 支付状态： 1.未支付 2.已支付 3.已退款 */}
            <Col span={12}>
              <Title level={5}>支付状态</Title>
              <p>{detailData?.paymentStatus === 1 ? '未支付' : detailData?.paymentStatus === 2 ? '已支付' : '已退款'}</p>
            </Col>
            {/* 负责医生 */}
            <Col span={12}>
              <Title level={5}>指定医生</Title>
              <p>{detailData?.doctorName}医生</p>
            </Col>
            {/* 挂号科室 */}
            <Col span={12}>
              <Title level={5}>所在科室</Title>
              <p>{detailData?.departmentName}</p>
            </Col>
            {/* 所在医院 */}
            <Col span={12}>
              <Title level={5}>所在医院</Title>
              <p>{detailData?.hospitalName}</p>
            </Col>
          </Row>
        </Card>
      </Drawer>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={processedDataSource}
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
