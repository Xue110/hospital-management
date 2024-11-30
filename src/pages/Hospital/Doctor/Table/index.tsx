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
import { deleteDoctor, deleteDoctorBatch } from '../../../../apis/doctor';
import { AppDispatch } from '../../../../type/login';
import { useDispatch } from 'react-redux';
import { getHospitalData } from '../../../../store/module/storge';

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
      title: '医生ID',
      dataIndex: 'id',
      key: 'id',
      width: '8%',
    },
    {
      title: '医生名',
      dataIndex: 'name',
      key: 'name',
      width: '8%',
    },
    {
      title: '费用',
      dataIndex: 'fee',
      key: 'fee',
      render: (fee: any) => {
        return <Tag color={'green'}>{fee}元</Tag>;
      },
      width: '8%',
    },
    {
      title: '职称',
      dataIndex: 'qualification',
      key: 'qualification',
      render: (qualification: any) => {
        return <Tag color={'blue'}>{qualification}</Tag>;
      },
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
      width: '10%',
      render: (hospitalName: any) => {
        return <Tag color={'purple'}>{hospitalName}</Tag>;
      },
    },
    {
      title: '简介',
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
      width: '25%',
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
    const res = await deleteDoctor(record.id);
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
  // 编辑订单
  const handleEdit = (record: any) => {
    props.onEdit(record);
  };
  // 批量删除
  const handleBatchDelete = async () => {
    const res = await deleteDoctorBatch(selectedRowIds);
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
      <Drawer title="医生详情" onClose={onClose} open={open} width={600}>
        <Card bordered={false}>
          <Row gutter={24}>
            {/* 医生ID */}
            <Col span={8}>
              <Title level={5}>医生ID</Title>
              <p>{detailData?.id}</p>
            </Col>
            {/* 此医生的用户ID */}
            <Col span={8}>
              <Title level={5}>用户ID</Title>
              <p>{detailData?.userId}</p>
            </Col>
            {/* 医生名称 */}
            <Col span={8}>
              <Title level={5}>医生名称</Title>
              <p>{detailData?.name}</p>
            </Col>
            {/* 医生职称 */}
            <Col span={12}>
              <Title level={5}>医生职称</Title>
              <p>{detailData?.qualification}</p>
            </Col>
            {/* 医生科室 */}
            <Col span={12}>
              <Title level={5}>所在科室</Title>
              <p>{detailData?.departmentName}</p>
            </Col>
            {/* 所在医院 */}
            <Col span={12}>
              <Title level={5}>所在医院</Title>
              <p>{detailData?.hospitalName}</p>
            </Col>
            {/* 医生电话 */}
            <Col span={12}>
              <Title level={5}>医生电话</Title>
              <p>{detailData?.phone}</p>
            </Col>
            {/* 医生邮箱 */}
            <Col span={12}>
              <Title level={5}>医生邮箱</Title>
              <p>{detailData?.email}</p>
            </Col>
            {/* 医生费用 */}
            <Col span={12}>
              <Title level={5}>医生费用</Title>
              <p>{detailData?.fee}元</p>
            </Col>
            {/* 医生图片 */}
            <Col span={12}>
              <Title level={5}>医生图片</Title>
              <img src={detailData?.image} alt="" style={{ width: '80%' }} />
            </Col>

            {/* 医生简介 */}
            <Col span={24}>
              <Title level={5}>医生简介</Title>
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
