import './index.scss';
import { Button, Form, Input, message } from 'antd';
import { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetPasswordAPI } from '../../apis/login';
// import { ForgetPasswordAction } from '../../type/login';

interface FormValues {
  phone: string;
  code: string;
  newPassword: string;
}

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false); // 按钮加载状态
  const [countdown, setCountdown] = useState<number>(0); // 验证码倒计时
  const [form] = Form.useForm<FormValues>();
  const navigate = useNavigate();
  // 获取验证码按钮点击事件
  const handleGetVerificationCode = () => {
    const phoneNumber = form.getFieldValue('phone');
    if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
      message.error('请输入有效的手机号');
      return;
    }

    // 模拟获取验证码的请求
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCountdown(60); // 启动倒计时
      message.success('验证码已发送');
    }, 1000);
  };

  // 倒计时效果
  useEffect(() => {
    let timer: number | undefined;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer); // 组件卸载时清除定时器
  }, [countdown]);

  // 提交表单事件
  const handleSubmit = async(values: FormValues) => {
    const { phone, code, newPassword } = values;
    const formData = { phone, code, newPassword };
    setLoading(true);
    // 重置密码
    const res = await resetPasswordAPI(formData);
    if (res.code === 200) {
      setTimeout(() => {
        setLoading(false);
        setCountdown(0); // 重置验证码倒计时
        message.success('密码重置成功');
        navigate('/login');
      }, 1000);
    }
  };

  return (
    <div className="forget">
      <div className="forget__container">
        <div className="forget__container__title">
          <h1>忘记密码</h1>
        </div>
        <div className="forget__container__form">
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item
              label="手机号"
              name="phone"
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
              ]}
            >
              <Input type="text" placeholder="请输入手机号" />
            </Form.Item>
            <Form.Item
              label="验证码"
              name="code"
              rules={[{ required: true, message: '请输入验证码' }]}
            >
              <div className="forget__container__form__code">
                <Input type="text" placeholder="请输入验证码" />
                <Button
                  className="get-code-btn"
                  disabled={countdown > 0}
                  loading={loading}
                  onClick={handleGetVerificationCode}
                >
                  {countdown > 0 ? `${countdown}s` : '获取验证码'}
                </Button>
              </div>
            </Form.Item>
            <Form.Item
              label="新密码"
              name="newPassword"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 6, message: '密码长度不能小于6位' },
              ]}
            >
              <Input.Password placeholder="请输入新密码" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                提交
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default App;
