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
} from 'antd';
import './index.scss';
import { DeleteOutlined, EyeOutlined, FormOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import { deleteHospitalManage, deleteHospitalManageBatch } from '../../../../apis/hospital';

const TableComponent = (props: any) => {
  // 表格数据
  const [dataSource, setDataSource] = useState<any[]>([]);
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
      title: '住院记录ID',
      dataIndex: 'id',
      key: 'id',
      width: '8%',
    },
    {
      title: '患者名',
      dataIndex: 'patientName',
      key: 'patientName',
      width: '8%',
    },
    {
      title: '床位号',
      dataIndex: 'number',
      key: 'numbaer',
      render: (number: any) => {
        return <Tag color={'blue'}>{number}床</Tag>;
      },
      width: '8%',
    },
    {
      title: '负责医生',
      dataIndex: 'doctorName',
      key: 'doctorName',
      width: '8%',
    },
    {
      title: '科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: '8%',
      render: (departmentName: any) => {
        return <Tag color={'orange'}>{departmentName}</Tag>;
      },
    },
    {
      title: '所在医院',
      dataIndex: 'hospitalName',
      key: 'hospitalName',
      width: '8%',
      render: (hospitalName: any) => {
        return <Tag color={'purple'}>{hospitalName}</Tag>;
      },
    },
    {
      title: '紧急联系人',
      dataIndex: 'patientContact',
      key: 'patientContact',
      width: '12%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '8%',
      render: (status: any) => {
        return status === 1 ? <Tag color={'green'}>住院中</Tag> : status === 2 ? <Tag color={'red'}>已出院</Tag> : <Tag color={'orange'}>已转院</Tag>;
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
    const res = await deleteHospitalManage(record.id);
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
    const res = await deleteHospitalManageBatch(selectedRowIds);
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
      <Drawer title="住院详情" onClose={onClose} open={open} width={600}>
        <Card bordered={false}>
          <Row gutter={24}>
            {/* 住院ID */}
            <Col span={12}>
              <Title level={5}>住院记录ID</Title>
              <p>{detailData?.id}</p>
            </Col>
            {/* 住院名称 */}
            <Col span={12}>
              <Title level={5}>患者名</Title>
              <p>{detailData?.patientName}</p>
            </Col>
            {/* 住院时间 */}
            <Col span={12}>
              <Title level={5}>住院时间</Title>
              <p>{detailData?.admissionDate}</p>
            </Col>
            {/* 出院时间 */}
            <Col span={12}>
              <Title level={5}>出院时间</Title>
              <p>{detailData?.dischargeDate}</p>
            </Col>
            {/* 住院状态 */}
            <Col span={12}>
              <Title level={5}>住院状态</Title>
              <p>{detailData?.status === 1 ? '住院中' : detailData?.status === 2 ? '已出院' : '已转院'}</p>
            </Col>
            {/* 病床号 */}
            <Col span={12}>
              <Title level={5}>病床号</Title>
              <p>{detailData?.number}</p>
            </Col>
            {/* 负责医生 */}
            <Col span={12}>
              <Title level={5}>负责医生</Title>
              <p>{detailData?.doctorName}医生</p>
            </Col>
            {/* 住院科室 */}
            <Col span={12}>
              <Title level={5}>所在科室</Title>
              <p>{detailData?.departmentName}</p>
            </Col>
            {/* 所在医院 */}
            <Col span={12}>
              <Title level={5}>所在医院</Title>
              <p>{detailData?.hospitalName}</p>
            </Col>
            {/* 紧急联系人电话 */}
            <Col span={12}>
              <Title level={5}>紧急联系人电话</Title>
              <p>{detailData?.patientContact}</p>
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
