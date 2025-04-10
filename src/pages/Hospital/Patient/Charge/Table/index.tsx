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
import { deleteCharge, deleteCharges } from '../../../../../apis/patient';

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
      title: '记录ID',
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
      title: '医院',
      dataIndex: 'hospitalName',
      key: 'hospitalName',
      width: '10%',
    },
    {
      title: '收费金额',
      dataIndex: 'total',
      key: 'total',
      width: '8%',
    },
    {
      title: '收费时间',
      dataIndex: 'date',
      key: 'time',
      width: '8%',
    },
    {
      title: '状态',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: '8%',
      render: (text: any) => {
        return <Tag color='green'>{text === 2 ? '已支付' : '未支付'}</Tag>;
      }
    },
    {
      title: '消费类型',
      dataIndex: 'type',
      key: 'type',
      width: '8%',
      render: (text: any) => {
        return <Tag color='purple'>{text === 1 ? '挂号' : text === 2 ? '住院' : '其他'}</Tag>;
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

  // 查看收费详情
  const viewDetails = (record: any) => {
    setDetailData(record);
    showDrawer();
  };

  // 删除收费
  const handleDelete = async (record: any) => {
    const res = await deleteCharge(record.id);
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
    const res = await deleteCharges(selectedRowIds);
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
      <Drawer title="收费详情" onClose={onClose} open={open} width={600}>
        <Card bordered={false}>
          <Row gutter={24}>
            {/* 收费ID */}
            <Col span={12}>
              <Title level={5}>收费ID</Title>
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
            {/* 所在医院 */}
            <Col span={12}>
              <Title level={5}>医院</Title>
              <p>{detailData?.hospitalName}</p>
            </Col>
            {/* 消费状态 */}
            <Col span={12}>
              <Title level={5}>消费状态</Title>
              <p>已支付</p>
            </Col>
            {/* 消费总金额 */}
            <Col span={12}>
              <Title level={5}>消费总金额</Title>
              <p>{detailData?.total}</p>
            </Col>
            {/* 收费时间 */}
            <Col span={12}>
              <Title level={5}>收费时间</Title>
              <p>{detailData?.date}</p>
            </Col>
            {/* 付款方式 */}
            <Col span={12}>
              <Title level={5}>付款方式</Title>
              <p>{detailData?.paymentMethod === '1' ? '支付宝' : detailData?.paymentMethod === '2' ? '微信' : '余额支付'}</p>
            </Col>
            {/* 消费类型 */}
            <Col span={12}>
              <Title level={5}>消费类型</Title>
              <p>{detailData?.type === 1 ? '挂号' : detailData?.type === 2 ? '住院' : '其他'}</p>
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
