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
import { DeleteOutlined, EyeOutlined, FormOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import { AppDispatch } from '../../../../../type/login';
import { useDispatch } from 'react-redux';
import { getHospitalData } from '../../../../../store/module/storge';
import { deletePrescription, deletePrescriptions } from '../../../../../apis/patient';

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
      title: '药品ID',
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
      title: '药品名称',
      dataIndex: 'medicationName',
      key: 'medicationName',
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
      width: '8%',
    },
    {
      title: '药品剂量',
      dataIndex: 'dosage',
      key: 'dosage',
      width: '8%',
    },
    {
      title: '用药频率',
      dataIndex: 'frequency',
      key: 'frequency',
      width: '8%',
    },
    {
      title:'服药周期',
      dataIndex: 'duration',
      key: 'duration',
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

  // 查看处方详情
  const viewDetails = (record: any) => {
    setDetailData(record);
    showDrawer();
  };

  // 删除处方
  const handleDelete = async (record: any) => {
    const res = await deletePrescription(record.id);
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
  // 编辑处方
  const handleEdit = (record: any) => {
    props.onEdit(record);
  };
  // 批量删除
  const handleBatchDelete = async () => {
    const res = await deletePrescriptions(selectedRowIds);
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
      <Drawer title="处方详情" onClose={onClose} open={open} width={600}>
        <Card bordered={false}>
          <Row gutter={24}>
            {/* 处方ID */}
            <Col span={12}>
              <Title level={5}>处方ID</Title>
              <p>{detailData?.id}</p>
            </Col>
            {/* 患者 */}
            <Col span={12}>
              <Title level={5}>患者</Title>
              <p>{detailData?.patientName}</p>
            </Col>
            {/* 药品 */}
            <Col span={12}>
              <Title level={5}>药品</Title>
              <p>{detailData?.medicationName}</p>
            </Col>
            {/* 负责医生 */}
            <Col span={12}>
              <Title level={5}>负责医生</Title>
              <p>{detailData?.doctorName}医生</p>
            </Col>
            {/* 所在医院 */}
            <Col span={12}>
              <Title level={5}>开方医院</Title>
              <p>{detailData?.hospitalName}</p>
            </Col>
            {/* 药品剂量 */}
            <Col span={12}>
              <Title level={5}>药品剂量</Title>
              <p>{detailData?.dosage}</p>
            </Col>
            {/* 服用频次 */}
            <Col span={12}>
              <Title level={5}>服用频次</Title>
              <p>{detailData?.frequency}</p>
            </Col>
            {/* 用药周期 */}
            <Col span={12}>
              <Title level={5}>用药周期</Title>
              <p>{detailData?.duration}</p>
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
