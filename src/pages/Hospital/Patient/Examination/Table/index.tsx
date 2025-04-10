import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  message,
  Drawer,
  Card,
  Col,
  Row,
} from 'antd';
import './index.scss';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import { AppDispatch } from '../../../../../type/login';
import { useDispatch } from 'react-redux';
import { getHospitalData } from '../../../../../store/module/storge';
import { deleteReport, deleteReports } from '../../../../../apis/patient';

const TableComponent = (props: any) => {
  const dispatch = useDispatch<AppDispatch>();
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
      title: '检查报告ID',
      dataIndex: 'id',
      key: 'id',
      width: '8%',
    },
    {
      title: '患者',
      dataIndex: 'patientName',
      key: 'patientName',
      width: '8%',
    },
    {
      title: '主治医师',
      dataIndex: 'doctorName',
      key: 'doctorName',
      width: '8%',
    },
    {
      title: '检查项目',
      dataIndex: 'reportInfoName',
      key: 'reportInfoName',
      width: '10%',
    },
    {
      title: '费用',
      dataIndex: 'fee',
      key: 'fee',
      width: '8%',
      render: (text: any) => <span>￥{text}</span>,
    },
    {
      title: '医院',
      dataIndex: 'hospitalName',
      key: 'hospitalName',
      width: '12%',
    },
    {
      title: '检查报告时间',
      dataIndex: 'testDate',
      key: 'testDate',
      width: '12%',
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

  // 查看检查报告详情
  const viewDetails = (record: any) => {
    setDetailData(record);
    showDrawer();
  };

  // 删除检查报告
  const handleDelete = async (record: any) => {
    const res = await deleteReport(record.id);
    if (res.code === 200) {
      message.success('删除成功');
      if (dataSource.length === 1 && props.pagination.page > 1) {
        props.paginationCount();
      } else {
        props.refresh();
      }
      await dispatch(getHospitalData());
    } else {
      message.error('删除失败');
    }
  };
  // 批量删除
  const handleBatchDelete = async () => {
    const res = await deleteReports(selectedRowIds);
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
      await dispatch(getHospitalData());
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
      <Drawer title="检查报告详情" onClose={onClose} open={open} width={600}>
        <Card bordered={false}>
          <Row gutter={24}>
            {/* 检查报告ID */}
            <Col span={12}>
              <Title level={5}>检查报告ID</Title>
              <p>{detailData?.id}</p>
            </Col>
            {/* 患者 */}
            <Col span={12}>
              <Title level={5}>患者</Title>
              <p>{detailData?.patientName}</p>
            </Col>
            {/* 负责医生 */}
            <Col span={12}>
              <Title level={5}>负责医生</Title>
              <p>{detailData?.doctorName}医生</p>
            </Col>
            {/* 检查报告名称 */}
            <Col span={12}>
              <Title level={5}>检查报告名称</Title>
              <p>{detailData?.reportInfoName}</p>
            </Col>
            {/* 费用 */}
            <Col span={12}>
              <Title level={5}>费用</Title>
              <p>{detailData?.fee}</p>
            </Col>
            {/* 所在医院 */}
            <Col span={12}>
              <Title level={5}>医院</Title>
              <p>{detailData?.hospitalName}</p>
            </Col>
            {/* 检查报告时间 */}
            <Col span={24}>
              <Title level={5}>检查报告时间</Title>
              <p>{detailData?.testDate}</p>
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
