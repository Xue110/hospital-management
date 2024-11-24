import './index.scss';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import {
  DeleteOutlined,
  SearchOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { deleteUser, deleteUserById, getUserList } from '../../apis/user';
import UserInfo from './c-cpns/UserInfo';
type TableRowSelection<T extends object = object> =
  TableProps<T>['rowSelection'];

interface DataType {
  id: number;
  key: React.Key;
  username: string;
  roleId: number;
  identityCard: string;
  phone: string;
  email: string;
  address: string;
  createTime: string;
  updateTime: string;
}
const role = {
  1: <Tag color="black">管理员</Tag>,
  2: <Tag color="green">医院</Tag>,
  3: <Tag color="blue">医生</Tag>,
  4: <Tag color="red">普通用户</Tag>,
};

const User: React.FC = () => {
  const renderRole = (text: any) => {
    // 类型断言
    return role[text as keyof typeof role];
  };
  const columns: TableColumnsType<DataType> = [
    {
      title: '用户ID',
      dataIndex: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '角色',
      dataIndex: 'roleId',
      render: renderRole,
    },
    {
      title: '身份证号',
      dataIndex: 'identityCard',
      render: (text) => (text ? text : '未填写'), // 如果为空显示 "未填写"
    },
    {
      title: '电话',
      dataIndex: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '地址',
      dataIndex: 'address',
      render: (text) => (text ? text : '未填写'), // 如果为空显示 "未填写"
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
    },
    {
      title: '操作',
      render: (data) => {
        return (
          <Space size="middle">
            <Popconfirm
              title="删除用户"
              description="确认要删除此用户?"
              onConfirm={() => confirm(data)}
              okText="是"
              cancelText="否"
              okButtonProps={{
                style: {
                  fontSize: '13px',
                  padding: '6px 12px',
                  height: '26px',
                  width: '35px',
                  lineHeight: '35px',
                },
              }}
              cancelButtonProps={{
                style: {
                  fontSize: '13px',
                  padding: '6px 15px',
                  height: '26px',
                  width: '35px',
                  lineHeight: '35px',
                },
              }}
            >
              <Button
                style={{ width: '40px', border: 'none' }}
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  const confirm = async (data: DataType) => {
    console.log(data);
    const res = await deleteUserById(data.id);
    if (res.code === 200) {
      message.success('删除成功');
      await fetchData(pagination.current, pagination.pageSize);
    } else {
      message.error('删除失败');
    }
  };
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  // 表单控件数据
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<DataType[]>(
    Array.from({ length: 1 }).map<DataType>((_, i) => ({
      key: i,
      id: i + 1,
      username: `Edward King ${i}`,
      roleId: 3,
      identityCard: '440000000000000000',
      phone: '1234567890',
      email: '1234567890@qq.com',
      address: '1234567890',
      createTime: '2022-12-12',
      updateTime: '2022-12-12',
    }))
  );
  const [total, setTotal] = useState(dataSource.length);
  const [openStatus, setOpenStatus] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };
  const fetchData = async (
    current: number,
    pageSize: number,
    filters: any = {}
  ) => {
    console.log(filters)
    const res = await getUserList(current, pageSize, filters);
    setDataSource(res.data.records); // 更新数据源
    setTotal(res.data.total); // 更新数据总数
  };
  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, []);
  // 处理分页变更
  const handleTableChange = async (pagination: any) => {
    const { current, pageSize } = pagination;
    // 更新分页状态
    setPagination({
      current,
      pageSize,
    });
    await fetchData(pagination.current, pagination.pageSize);
  };
  // 查询按钮点击
  const handleSearch = () => {
    form.validateFields().then((values) => {
      const { userId, username, roleId } = values;
      const filters = {
        userId: userId || undefined,
        username: username || undefined,
        roleId: roleId || undefined,
      };
      fetchData(1, pagination.pageSize, filters);
    });
  };

  // 重置按钮点击
  const handleReset = () => {
    form.resetFields(); // 重置表单内容
    fetchData(1, pagination.pageSize);
  };
  const handleClick = () => {
    setOpenStatus(openStatus + 1);
  };
  // 批量删除
  const handleDelete = async () => {
    if (selectedRowKeys.length > 0) {
      // 获取需要删除的行
      const selectedRows = dataSource.filter((row) =>
        selectedRowKeys.includes(row.id)
      );
      // 提取出需要删除的 ID
      const idsToDelete = selectedRows.map((row) => row.id);
      const res = await deleteUser(idsToDelete);
      if (res.code === 200) {
        message.success('删除成功');
        // 删除成功后，根据当前分页重新获取数据
        await fetchData(pagination.current, pagination.pageSize);
        // 清空选中的行
        setSelectedRowKeys([]);
      } else {
        message.error('删除失败');
      }
    }
  };
  // 使用 useCallback 缓存 fetchData 函数的引用
  const refresh = useCallback(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);
  return (
    <div>
      <UserInfo open={openStatus} refresh={refresh} />
      <Card style={{ width: '100%' }}>
        <Form form={form} layout="inline">
          <Row justify="space-between" style={{ width: '100%' }}>
            {/* 用户ID输入框 */}
            <Col span={7}>
              <Form.Item name="userId" label="用户ID">
                <Input placeholder="请输入用户ID" />
              </Form.Item>
            </Col>

            {/* 用户名输入框 */}
            <Col span={7}>
              <Form.Item name="username" label="用户名">
                <Input placeholder="请输入用户名" />
              </Form.Item>
            </Col>

            {/* 角色选择框 */}
            <Col span={7}>
              <Form.Item name="roleId" label="角色">
                <Select placeholder="请选择角色">
                  <Select.Option value={1}>管理员</Select.Option>
                  <Select.Option value={2}>医院</Select.Option>
                  <Select.Option value={3}>医生</Select.Option>
                  <Select.Option value={4}>普通用户</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {/* 按钮部分 */}
        <Row justify="end" style={{ marginTop: '16px' }}>
          <Col>
            <Button
              size="small"
              type="primary"
              style={{ marginRight: '8px' }}
              icon={<SearchOutlined />}
              onClick={handleSearch}
            >
              查询
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              danger
              style={{ marginLeft: '8px', border: '0' }}
              icon={<SyncOutlined />}
              size="small"
              onClick={handleReset}
            >
              重置
            </Button>
          </Col>
        </Row>
      </Card>
      <Card
        title="用户列表"
        extra={
          <Space>
            <Button
              type="primary"
              size="small"
              style={{ fontSize: '14px' }}
              onClick={handleClick}
            >
              新增用户
            </Button>
            <Button
              danger
              size="small"
              style={{ fontSize: '14px' }}
              onClick={handleDelete}
            >
              批量删除
            </Button>
          </Space>
        }
        style={{ width: '100%', marginTop: '20px' }}
      >
        <Table<DataType>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: total,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '30', '40'],
            showQuickJumper: true,
            showTotal: (total) => `共${total}条数据`,
          }}
          onChange={handleTableChange} // 监听分页变更
        />
      </Card>
    </div>
  );
};

export default User;
