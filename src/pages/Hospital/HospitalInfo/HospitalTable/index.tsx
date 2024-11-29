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
import {
  deleteHospital,
  deleteHospitalBatch,
} from '../../../../apis/hospital';

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
  // render渲染
  const city = {
    1: '长春市',
    2: '吉林市',
    3: '四平市',
    4: '辽源市',
    5: '通化市',
    6: '白山市',
    7: '松原市',
    8: '白城市',
    9: '延边朝鲜族自治州',
  };
  const renderCity = (citiesId: any) => {
    return <Tag color="#2db7f5">{city[citiesId as keyof typeof city]}</Tag>;
  };
  // 表格列
  const columns = [
    {
      title: '医院ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '医院名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '医院图片',
      dataIndex: 'image',
      key: 'image',
      render: (image: any) => (
        <img src={image} alt="" style={{ width: '100%', height: '100px' }} />
      ),
    },
    {
      title: '医院地址',
      dataIndex: 'address',
      key: 'address',
      width: '170px',
    },
    {
      title: '医院电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '医院官网',
      dataIndex: 'website',
      key: 'website',
    },
    {
      title: '所在城市',
      dataIndex: 'citiesId',
      key: 'citiesId',
      render: (citiesId: any) => renderCity(citiesId),
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
    const res = await deleteHospital(record.id);
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
  const handleEdit = (record: any) => {
    props.onEdit(record);
  };
  // 批量删除
  const handleBatchDelete = async () => {
    const res = await deleteHospitalBatch(selectedRowIds);
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
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`);
      setSelectedRowIds(
        selectedRows.filter((item) => item.id).map((item) => item.id)
      );
    },
  };
  return (
    <div className="order-table">
      <Drawer title="医院详情" onClose={onClose} open={open} width={600}>
        <Card bordered={false}>
          <Row gutter={24}>
            {/* 医院ID */}
            <Col span={12}>
              <Title level={5}>医院ID</Title>
              <p>{detailData?.id}</p>
            </Col>
            {/* 医院名称 */}
            <Col span={12}>
              <Title level={5}>医院名称</Title>
              <p>{detailData?.name}</p>
            </Col>
            {/* 所在城市 */}
            <Col span={12}>
              <Title level={5}>所在城市</Title>
              <p>{renderCity(detailData?.citiesId)}</p>
            </Col>
            {/* 医院官网 */}
            <Col span={12}>
              <Title level={5}>医院官网</Title>
              <p>{detailData?.website}</p>
            </Col>
            {/* 医院地址 */}
            <Col span={12}>
              <Title level={5}>医院地址</Title>
              <p>{detailData?.address}</p>
            </Col>
            {/* 医院电话 */}
            <Col span={12}>
              <Title level={5}>医院电话</Title>
              <p>{detailData?.phone}</p>
            </Col>
            {/* 医院图片 */}
            <Col span={24}>
              <Title level={5}>医院图片</Title>
              <img src={detailData?.image} alt="" style={{ width: '100%' }} />
            </Col>
            {/* 医院简介 */}
            <Col span={24}>
              <Title level={5}>医院简介</Title>
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
