import { useEffect, useState } from 'react';
import './UserInfo.scss';
import { Form, Input, message, Modal, Select } from 'antd';
import { addUser } from '../../../apis/user';

const UserInfo = (props: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm(); // 修正为 Form.useForm() 返回的 form 实例
  const [loading, setLoading] = useState(false); // 用于控制提交按钮的加载状态

  useEffect(() => {
    if (props.open) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [props.open]);

  // 提交表单数据
  const handleOk = async () => {
    try {
      // 表单验证通过后
      const values = await form.validateFields();
      setLoading(true); // 开始请求时禁用按钮，显示加载状态

      const res = await addUser(values);
      if (res.code === 200) {
        // 添加成功
        message.success('添加成功');
        form.resetFields(); // 提交成功后重置表单
        setIsModalOpen(false); // 关闭弹窗
        await props.refresh(); // 刷新用户列表
      } else {
        message.error('添加失败');
      }
    } catch (error) {
      // 如果表单验证失败
      message.error('请检查表单输入');
    } finally {
      setLoading(false); // 请求完成后恢复按钮状态
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields(); // 取消时重置表单
  };

  return (
    <>
      <Modal
        title="添加用户"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          style: {
            fontSize: '15px',
            padding: '6px 12px',
            height: '40px',
            width: '80px',
            lineHeight: '35px',
          },
          loading, // 如果处于加载状态，按钮会禁用
        }}
        cancelButtonProps={{
          style: {
            fontSize: '15px',
            padding: '6px 15px',
            height: '40px',
            width: '80px',
            lineHeight: '35px',
          },
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="身份证号"
            name="identityCard"
            rules={[{ required: true, message: '请输入身份证号' }]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="手机号"
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              {
                pattern: /^[0-9]{11}$/,
                message: '请输入有效的手机号',
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              {
                type: 'email',
                message: '请输入有效的邮箱地址',
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="地址"
            name="address"
            rules={[{ required: true, message: '请输入地址' }]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="角色"
            name="roleId"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select>
              <Select.Option value="1">管理员</Select.Option>
              <Select.Option value="2">医院</Select.Option>
              <Select.Option value="3">医生</Select.Option>
              <Select.Option value="4">普通用户</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserInfo;
