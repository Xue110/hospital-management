import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  message,
  Drawer,
  Card,
  Col,
  Row,
  Tag,
} from 'antd';
import './index.scss';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import { AppDispatch } from '../../../../../type/login';
import { useDispatch } from 'react-redux';
import { getHospitalData } from '../../../../../store/module/storge';
import { deleteVisit, deleteVisits } from '../../../../../apis/patient';

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
      title: '就诊ID',
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
      title: '科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: '8%',
    },
    {
      title: '医院',
      dataIndex: 'hospitalName',
      key: 'hospitalName',
      width: '10%',
    },
    {
      title: '就诊时间',
      dataIndex: 'date',
      key: 'date',
      width: '8%',
    },
    {
      title: '就诊状态', //1：待确认 2.已确认 3：已就诊 4：已取消
      dataIndex: 'status',
      key: 'status',
      width: '8%',
      render: (text: any) => {
        return <Tag color='purple'>{text === 1 ? '待确认': text === 2 ? '已确认' : text === 3 ? '已就诊' : '已取消'}</Tag>;
      }
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: '8%',
      render: (text: any) => {
        return <Tag color='green'>{text === 1 ? '未支付' : text === 2 ? '已支付' : '已退款'}</Tag>;
      }
    },
    {
      title: '费用',
      dataIndex: 'paymentAmount',
      key: 'paymentAmount',
      width: '8%',
      render: (text: any) => {
        return <Tag color='blue'>{text}元</Tag>;
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

  // 查看就诊详情
  const viewDetails = (record: any) => {
    setDetailData(record);
    showDrawer();
  };

  // 删除就诊
  const handleDelete = async (record: any) => {
    const res = await deleteVisit(record.id);
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
    const res = await deleteVisits(selectedRowIds);
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
      <Drawer title="就诊详情" onClose={onClose} open={open} width={600}>
        <Card bordered={false}>
          <Row gutter={24}>
            {/* 就诊ID */}
            <Col span={12}>
              <Title level={5}>就诊ID</Title>
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
            {/* 科室 */}
            <Col span={12}>
              <Title level={5}>科室</Title>
              <p>{detailData?.departmentName}</p>
            </Col>
            {/* 所在医院 */}
            <Col span={12}>
              <Title level={5}>医院</Title>
              <p>{detailData?.hospitalName}</p>
            </Col>
            {/* 挂号日期 */}
            <Col span={12}>
              <Title level={5}>挂号日期</Title>
              <p>{detailData?.date}</p>
            </Col>
            {/* 挂号状态： 1：待确认 2.已确认 3：已就诊 4：已取消 */}
            <Col span={12}>
              <Title level={5}>挂号状态</Title>
              <p>{detailData?.status === 1 ? '待确认': detailData?.status === 2 ? '已确认' : detailData?.status === 3 ? '已就诊' : '已取消'}</p>
            </Col>
            {/* 支付状态： 1：未支付 2：已支付 3.已取消 */}
            <Col span={12}>
              <Title level={5}>支付状态</Title>
              <p>{detailData?.paymentStatus === 1 ? '未支付': detailData?.paymentStatus === 2 ? '已支付' : '已取消'}</p>
            </Col>
            {/* 挂号费用 */}
            <Col span={12}>
              <Title level={5}>挂号费用</Title>
              <p>{detailData?.paymentAmount}</p>
            </Col>
            {/* 就诊时间 */}
            <Col span={24}>
              <Title level={5}>就诊时间</Title>
              <p>{detailData?.startTime} - {detailData?.endTime}</p>
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
