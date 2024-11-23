import { useEffect, useState } from 'react';
import { getProfileAPI } from '../../apis/login';
import { updateUser } from '../../apis/user';
import './index.scss';
import { Button, Form, Input, message, Spin } from 'antd';

const Profile = () => {
  const [userInfo, setUserInfo] = useState<any>({
    username: '',
    password: '',
    email: '',
    phone: '',
    address:'',
    identityCard:'',
    roleId: 1,
  });
  const [loading, setLoading] = useState(false);

  // 获取个人信息
  const getUserInfo = async () => {
    setLoading(true);
    const res = await getProfileAPI();
    setLoading(false);
    if (res.code === 200) {
      setUserInfo(res.data);
    } else {
      message.error('获取用户信息失败');
    }
  };

  // 修改个人信息
  const changeUserInfo = async (values: any) => {
    setLoading(true);
    const res = await updateUser(values);
    setLoading(false);
    if (res.code === 200) {
      message.success('修改成功');
      getUserInfo();
    } else {
      message.error(res.msg || '修改失败');
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  // 表单初始化
  const [form] = Form.useForm();

  useEffect(() => {
    if (userInfo) {
      form.setFieldsValue(userInfo); // 将获取到的用户信息填充到表单中
    }
  }, [userInfo, form]);

  // 表单布局配置
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  // 表单字段规则配置
  const rules = {
    required: true,
    message: '此项为必填项',
  };
  // 角色映射
  const roleMap: Record<number, string> = {
    1: '管理员',
    2: '医院',
    3: '医生',
    4: '用户',
  };

  // 将 roleId 映射为角色名称
  const roleName = roleMap[userInfo.roleId] || '未知角色';
  return (
    <div className="profile">
      <Spin spinning={loading}>
        <Form
          form={form}
          onFinish={changeUserInfo} // 提交表单时触发修改
          onFinishFailed={() => message.error('提交失败，请检查填写的内容')}
          {...formLayout}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ ...rules }, { max: 20, message: '用户名最多20个字符' }]}
          >
            <Input type="text" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ ...rules, min: 6, message: '密码至少6个字符' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="手机号"
            name="phone"
            rules={[
              { ...rules },
              { pattern: /^[0-9]{11}$/, message: '请输入有效的手机号' },
            ]}
          >
            <Input type="text" />
          </Form.Item>

          <Form.Item
            label="身份证号"
            name="identityCard"
            initialValue={userInfo?.identityCard}
          >
            <Input type="text" disabled />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { ...rules },
              { type: 'email', message: '请输入有效的邮箱' },
            ]}
          >
            <Input type="text" />
          </Form.Item>

          <Form.Item label="地址" name="address" rules={[{ ...rules }]}>
            <Input type="text" />
          </Form.Item>

          <Form.Item label="角色" name="role" initialValue={roleName}>
            <Input type="text" disabled />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Button type="primary" htmlType="submit" block>
              修改
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default Profile;
