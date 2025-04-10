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
import { deleteSchedule, deleteScheduleAll } from '../../../apis/hospital';

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
  const processedDataSource = dataSource.map(item => ({
    ...item,  // 保留原始字段
    time: `${item.startTime} - ${item.endTime}`  // 合并 startTime 和 endTime 为 time
  }));
  const onClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    setDataSource(props.data);
  }, [props.data]);
  // 表格列
  const columns = [
    {
      title: '排版记录ID',
      dataIndex: 'id',
      key: 'id',
      width: '8%',
    },
    {
      title: '医生',
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
      width: '11%',
      render: (hospitalName: any) => {
        return <Tag color={'purple'}>{hospitalName}</Tag>;
      },
    },
    {
      title: '排班日期',
      dataIndex: 'date',
      key: 'date',
      width: '8%',
    },
    {
      title: '排班时段',
      dataIndex: 'time',
      key: 'time',
      width: '15%',
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
      title:'最大挂号数',
      dataIndex: 'maxAppointments',
      key: 'maxAppointments',
      width: '8%',
    },
    {
      title: '剩余挂号数',
      dataIndex: 'availableAppointments',
      key: 'availableAppointments',
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
    const res = await deleteSchedule(record.id);
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
    const res = await deleteScheduleAll(selectedRowIds);
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
      <Drawer title="排班详情" onClose={onClose} open={open} width={600}>
        <Card bordered={false}>
          <Row gutter={24}>
            {/* 排版ID */}
            <Col span={12}>
              <Title level={5}>排班记录ID</Title>
              <p>{detailData?.id}</p>
            </Col>
            {/* 负责医生 */}
            <Col span={12}>
              <Title level={5}>医生</Title>
              <p>{detailData?.doctorName}医生</p>
            </Col>
            {/* 排版科室 */}
            <Col span={12}>
              <Title level={5}>所在科室</Title>
              <p>{detailData?.departmentName}</p>
            </Col>
            {/* 所在医院 */}
            <Col span={12}>
              <Title level={5}>所在医院</Title>
              <p>{detailData?.hospitalName}</p>
            </Col>
            {/* 排班时间 */}
            <Col span={12}>
              <Title level={5}>排班时间</Title>
              <p>{detailData?.date}</p>
            </Col>
            {/* 排班时间段 */}
            <Col span={12}>
              <Title level={5}>排班时间段</Title>
              <p>{detailData?.time}</p>
            </Col>
            {/* 最大挂号数 */}
            <Col span={12}>
              <Title level={5}>最大挂号数</Title>
              <p>{detailData?.maxAppointments}</p>
            </Col>
            {/* 可用挂号数 */}
            <Col span={12}>
              <Title level={5}>可用挂号数</Title>
              <p>{detailData?.availableAppointments}</p>
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
