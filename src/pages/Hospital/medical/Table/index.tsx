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
import { deleteMedication, deleteMedicationBatch } from '../../../../apis/hospital';

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
      title: '药品ID',
      dataIndex: 'id',
      key: 'id',
      width: '8%',
    },
    {
      title: '药品名称',
      dataIndex: 'name',
      key: 'name',
      width: '10%',
    },
    {
      title: '药品描述',
      dataIndex: 'description',
      key: 'description',
      width: '15%',
      ellipsis: {
        showTitle: false,
      },
      render: (description: any) => (
        <Tooltip placement="topLeft" title={description}>
          {description}
        </Tooltip>
      ),
    },
    {
      title: '药品价格',
      dataIndex: 'price',
      key: 'price',
      width: '10%',
      render: (price: any) => <Tag color="green">{price}元</Tag>,
    },
    {
      title: '药品库存',
      dataIndex: 'stock',
      key: 'stock',
      width: '10%',
      render: (stock: any) => <Tag color="orange">{stock}</Tag>,
    },
    {
      title: '药品供应商',
      dataIndex: 'supplier',
      key: 'supplier',
      width: '10%',
      render: (supplier: any) => <Tag color="blue">{supplier}</Tag>,
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

  // 查看药品详情
  const viewDetails = (record: any) => {
    setDetailData(record);
    showDrawer();
  };

  // 删除药品
  const handleDelete = async (record: any) => {
    const res = await deleteMedication(record.id);
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
  // 编辑药品
  const handleEdit = (record: any) => {
    props.onEdit(record);
  };
  // 批量删除
  const handleBatchDelete = async () => {
    const res = await deleteMedicationBatch(selectedRowIds);
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
      <Drawer title="药品详情" onClose={onClose} open={open} width={600}>
        <Card bordered={false}>
          <Row gutter={24}>
            {/* 药品ID */}
            <Col span={12}>
              <Title level={5}>药品ID</Title>
              <p>{detailData?.id}</p>
            </Col>
            {/* 药品名称 */}
            <Col span={12}>
              <Title level={5}>药品名</Title>
              <p>{detailData?.name}</p>
            </Col>
            {/* 药品价格 */}
            <Col span={12}>
              <Title level={5}>药品价格</Title>
              <p>{detailData?.price}</p>
            </Col>
            {/* 药品库存 */}
            <Col span={12}>
              <Title level={5}>药品库存</Title>
              <p>{detailData?.stock}</p>
            </Col>
            {/* 药品供应商 */}
            <Col span={12}>
              <Title level={5}>药品供应商</Title>
              <p>{detailData?.supplier}</p>
            </Col>
            {/* 药品描述 */}
            <Col span={24}>
              <Title level={5}>药品描述</Title>
              <p>{detailData?.description}</p>
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
