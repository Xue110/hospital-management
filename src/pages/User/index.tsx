import './index.scss';
import React, { useState } from 'react';
import { Button, Popconfirm, Space, Table, Tag } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
type TableRowSelection<T extends object = object> =
  TableProps<T>['rowSelection'];

interface DataType {
  key: React.Key;
  username: string;
  password: string;
  roleId: number;
  identityCard: string;
  phone: string;
  email: string;
  address: string;
  creatdTime: string;
  updateTime: string;
}
const role = {
  1: <Tag color="black">管理员</Tag>,
  2: <Tag color="green">医院</Tag>,
  3: <Tag color="blue">医生</Tag>,
  4: <Tag color="red">用户</Tag>,
};
const renderRole = (text: any) => {
  // 类型断言
  return role[text as keyof typeof role];
};
const columns: TableColumnsType<DataType> = [
  {
    title: '用户名',
    dataIndex: 'username',
  },
  {
    title: '密码',
    dataIndex: 'password',
  },
  {
    title: '角色',
    dataIndex: 'roleId',
    render: renderRole,
  },
  {
    title: '身份证号',
    dataIndex: 'identityCard',
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
  },
  {
    title: '创建时间',
    dataIndex: 'creatdTime',
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
          <Button
            style={{ width: '40px' }}
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => console.log(data)}
          />
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
              style={{ width: '40px' }}
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

const dataSource = Array.from({ length: 46 }).map<DataType>((_, i) => ({
  key: i,
  username: `Edward King ${i}`,
  password: '3222222',
  roleId: 3,
  identityCard: '440000000000000000',
  phone: '1234567890',
  email: '1234567890@qq.com',
  address: '1234567890',
  creatdTime: '2022-12-12',
  updateTime: '2022-12-12',
}));

const User: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      // 自定义选择项
      {
        key: 'all-data',
        text: '全选',
        onSelect: (changeableRowKeys) => setSelectedRowKeys(changeableRowKeys),
      },
      {
        key: 'none-data',
        text: '取消全选',
        onSelect: () => setSelectedRowKeys([]),
      },
      {
        key: 'invert',
        text: '此页反选',
        onSelect: (changeableRowKeys) => {
          const selectedKeys = new Set(selectedRowKeys);
          changeableRowKeys.forEach((key) => {
            if (selectedKeys.has(key)) {
              selectedKeys.delete(key);
            } else {
              selectedKeys.add(key);
            }
          });
          setSelectedRowKeys(Array.from(selectedKeys));
        },
      },
      {
        key: 'odd',
        text: '选择单数项',
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
        text: '选择双数项',
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

  return (
    <Table<DataType>
      rowSelection={rowSelection}
      columns={columns}
      dataSource={dataSource}
    />
  );
};

export default User;
