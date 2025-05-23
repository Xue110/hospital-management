import React, { useEffect } from 'react';
import './index.scss';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Form,
  Input,
  Typography,
  Space,
} from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchLogin } from '../../store/module/user';
import { AppDispatch, LoginAction } from '../../type/login';

const { Link } = Typography;

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [form] = Form.useForm<LoginAction>();
  useEffect(() => {
    const userForm = JSON.parse(localStorage.getItem('userForm') || '{}');
    if (userForm.username && userForm.password) {
      form.setFieldsValue(
        {
          username: userForm.username,
          password: userForm.password,
          remember: userForm.remember,
        },
      );
    }
  },[form]);
  const onFinish = async (values: LoginAction) => {
    console.log('登录表单为： ', values);
    if (values.remember) {
      const userForm:LoginAction = {
        username: values.username,
        password: values.password,
        remember: values.remember,
      };
      localStorage.setItem('userForm', JSON.stringify(userForm)); // 存储为 JSON 字符串
    }else {
      localStorage.removeItem('userForm'); // 如果没有勾选“记住我”，移除 localStorage 中的数据
    }
    await dispatch(fetchLogin(values));
    //1.跳转到首页
    navigate('/home');
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h1>
          <svg
            className="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2892"
            width="25"
            height="25"
          >
            <path
              d="M902.30669 410.926715c56.68109 56.649121 56.68109 148.528113 0 205.177234l-289.735319 289.767288c-56.68109 56.649121-148.528113 56.649121-205.209203 0l-289.735319-289.767288c-56.68109-56.649121-56.68109-148.528113 0-205.177234l289.735319-289.767288c56.68109-56.68109 148.528113-56.68109 205.209203 0l289.735319 289.767288z m-154.090724 184.812962v-151.661078h-160.292717v-160.292717h-151.661078v160.292717h-160.260747v151.661078h160.260747v160.260748h151.661078v-160.260748h160.292717z"
              fill="#42BC90"
              p-id="2893"
            ></path>
            <path
              d="M748.215966 444.078599v151.661078h-160.292717v160.260748h-151.661078v-160.260748h-160.260747v-151.661078h160.260747v-160.292717h151.661078v160.292717z"
              fill="#FF4893"
              p-id="2894"
            ></path>
            <path
              d="M509.96677 970.736399c-44.72787 0-86.783129-17.416728-118.422878-49.040492l-289.741713-289.773682c-31.636552-31.620568-49.06287-73.67263-49.06287-118.41009s17.426318-86.789523 49.069264-118.416484l289.728925-289.760894c31.639749-31.639749 73.701402-49.066067 118.429272-49.066067 44.731067 0 86.789523 17.426318 118.426074 49.066067l289.738516 289.770485c31.636552 31.617371 49.066067 73.67263 49.066067 118.41009s-17.426318 86.789523-49.072461 118.416484l-289.728925 289.760894c-31.646143 31.626961-73.701402 49.043689-118.429271 49.043689z m0-869.70787c-32.77465 0-63.592794 12.768431-86.779932 35.955568l-289.732122 289.767288c-23.190334 23.177547-35.958765 53.989298-35.958765 86.767144s12.768431 63.589598 35.952371 86.76075l289.741713 289.773682c23.180744 23.167956 54.002085 35.93319 86.779932 35.93319s63.595991-12.765234 86.786325-35.939584l289.728925-289.760894c23.190334-23.177547 35.958765-53.989298 35.958765-86.767144s-12.768431-63.589598-35.952371-86.760751l-289.741712-289.773681c-23.190334-23.187137-54.008479-35.955568-86.783129-35.955568z"
              fill="#4F46A3"
              p-id="2895"
            ></path>
            <path
              d="M587.923249 778.378746h-151.661078a22.378321 22.378321 0 0 1-22.378321-22.378321v-137.882427h-137.882426a22.378321 22.378321 0 0 1-22.378321-22.378321v-151.661078a22.378321 22.378321 0 0 1 22.378321-22.378321h137.882426v-137.914396a22.378321 22.378321 0 0 1 22.378321-22.378321h151.661078a22.378321 22.378321 0 0 1 22.378321 22.378321v137.914396h137.914396a22.378321 22.378321 0 0 1 22.378321 22.378321v151.661078a22.378321 22.378321 0 0 1-22.378321 22.378321h-137.914396v137.882427a22.378321 22.378321 0 0 1-22.378321 22.378321z m-129.282757-44.756642h106.904436v-137.882427a22.378321 22.378321 0 0 1 22.378321-22.378321h137.914396v-106.904436h-137.914396a22.378321 22.378321 0 0 1-22.378321-22.378321v-137.914396h-106.904436v137.914396a22.378321 22.378321 0 0 1-22.378321 22.378321h-137.882426v106.904436h137.882426a22.378321 22.378321 0 0 1 22.378321 22.378321v137.882427z"
              fill="#4F46A3"
              p-id="2896"
            ></path>
          </svg>{' '}
          医心共振 济世安民
        </h1>
        <Form
          name="login"
          form={form}
          initialValues={{ remember: true }}
          style={{ maxWidth: 360, width: '100%' }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入您的用户名!' }]}
          >
            <Input
              size="large"
              prefix={<UserOutlined />}
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input
              size="large"
              prefix={<LockOutlined />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <Link className="link" href="/forget">
                忘记密码
              </Link>
            </Space>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default App;
