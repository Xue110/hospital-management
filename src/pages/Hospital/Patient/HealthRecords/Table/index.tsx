import React, { useEffect, useState } from 'react';
import { Table, Button, message, Drawer, Card, Col, Row, Tooltip } from 'antd';
import './index.scss';
import { DeleteOutlined, EyeOutlined, FormOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import { AppDispatch } from '../../../../../type/login';
import { useDispatch } from 'react-redux';
import { getHospitalData } from '../../../../../store/module/storge';
import { deleteHealth, deleteHealths } from '../../../../../apis/patient';

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
  console.log(dataSource);
  // 表格列
  const columns = [
    {
      title: '档案ID',
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
      title: '身高(cm)',
      dataIndex: 'height',
      key: 'height',
      width: '8%',
    },
    {
      title: '体重(kg)',
      dataIndex: 'weight',
      key: 'weight',
      width: '8%',
    },
    {
      title: '拥有疾病',
      dataIndex: 'diseaseName',
      key: 'diseaseName',
      width: '15%',
      ellipsis: {
        showTitle: false,
      },
      render: (diseaseName: any) => {
        const diseaseString = diseaseName.join(',');
        return (
          <Tooltip placement="topLeft" title={diseaseString}>
            {diseaseString}
          </Tooltip>
        );
      },
    },
    {
      title: '使用药物',
      dataIndex: 'medicationName',
      key: 'medicationName',
      width: '15%',
      ellipsis: {
        showTitle: false,
      },
      render: (medicationName: any) => {
        const medicationString = medicationName.join(',');
        return (
          <Tooltip placement="topLeft" title={medicationString}>
            {medicationString}
          </Tooltip>
        );
      },
    },
    {
      title: '过敏原',
      dataIndex: 'allergyInfo',
      key: 'allergyInfo',
      width: '10%',
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

  // 查看健康档案详情
  const viewDetails = (record: any) => {
    setDetailData(record);
    showDrawer();
  };

  // 删除健康档案
  const handleDelete = async (record: any) => {
    const res = await deleteHealth(record.id);
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
  // 编辑健康档案
  const handleEdit = (record: any) => {
    props.onEdit(record);
  };
  // 批量删除
  const handleBatchDelete = async () => {
    const res = await deleteHealths(selectedRowIds);
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
      <Drawer title="健康档案详情" onClose={onClose} open={open} width={600}>
        <Card bordered={false}>
          <Row gutter={24}>
            {/* 健康档案ID */}
            <Col span={12}>
              <Title level={5}>健康档案ID</Title>
              <p>{detailData?.id}</p>
            </Col>
            {/* 患者 */}
            <Col span={12}>
              <Title level={5}>患者</Title>
              <p>{detailData?.patientName}</p>
            </Col>
            {/* 患有疾病 */}
            <Col span={12}>
              <Title level={5}>患病疾病</Title>
              <p>{detailData?.diseaseName.join(' ')}</p>
            </Col>
            {/* 治疗药物 */}
            <Col span={12}>
              <Title level={5}>治疗药物</Title>
              <p>{detailData?.medicationName.join(' ')}</p>
            </Col>
            {/* 身高 */}
            <Col span={12}>
              <Title level={5}>身高</Title>
              <p>{detailData?.height}cm</p>
            </Col>
            {/* 体重 */}
            <Col span={12}>
              <Title level={5}>体重</Title>
              <p>{detailData?.weight}kg</p>
            </Col>
            {/* 血压 */}
            <Col span={12}>
              <Title level={5}>血压</Title>
              <p>{detailData?.bloodPressure}mmHg</p>
            </Col>
            {/* 血糖 */}
            <Col span={12}>
              <Title level={5}>血糖</Title>
              <p>{detailData?.bloodSugar}mmol/L</p>
            </Col>
            {/* 过敏原 */}
            <Col span={12}>
              <Title level={5}>过敏原</Title>
              <p>{detailData?.allergyInfo}</p>
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
