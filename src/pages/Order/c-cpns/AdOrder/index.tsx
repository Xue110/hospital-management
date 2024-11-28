import { useEffect, useState } from 'react';
import './index.scss';
import {
  Cascader,
  CascaderProps,
  Form,
  Input,
  message,
  Modal,
  Select,
} from 'antd';
import { addOrder } from '../../../../apis/order';
const AdOrder= (props: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm(); // 修正为 Form.useForm() 返回的 form 实例
  const [loading, setLoading] = useState(false); // 用于控制提交按钮的加载状态
  const [userList, setUserList] = useState<any[]>([]);
  const [patientList, setPatientList] = useState<any[]>([]);
  const [options, setOption] = useState<any[]>([]);
  useEffect(() => {
    if (props.open) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [props.open]);
  useEffect(() => {
    setUserList(props.userCounts);
    setPatientList(props.patientCounts);
    setOption(props.layoutData);
  },[props.layoutData,props.patientCounts,props.userCounts]);
  // 提交表单数据
  const handleOk = async () => {
    try {
      // 表单验证通过后
      const values = await form.validateFields();
      values.hospitalId = values.doctorId[0];
      values.doctorId = values.doctorId[1];
      values.total = Number(values.total);
      console.log(values)
      setLoading(true); // 开始请求时禁用按钮，显示加载状态
      const res = await addOrder(values);
      if (res.code === 200) {
        // 添加成功
        message.success('添加成功');
        form.resetFields(); // 提交成功后重置表单
        setIsModalOpen(false); // 关闭弹窗
        await props.refresh(); // 刷新用户列表
      } else {
        message.error('添加失败');
      }
    } finally {
      setLoading(false); // 请求完成后恢复按钮状态
    }
  };
  const onChange: CascaderProps<any>['onChange'] = (value) => {
    console.log(value);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields(); // 取消时重置表单
  };
  // 将医生分配到对应的医院

  return (
    <>
      <Modal
        title="创建订单"
        open={isModalOpen}
        onOk={handleOk}
        style={{ marginTop: '-50px' }}
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
          {/* 用户选择 */}
          <Form.Item
            label="用户"
            name="userId"
            rules={[{ required: true, message: '请选择用户' }]}
          >
            <Select
              showSearch
              placeholder="请选择用户"
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={userList.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
            />
          </Form.Item>

          {/* 患者选择 */}
          <Form.Item
            label="患者"
            name="patientId"
            rules={[{ required: true, message: '请选择患者' }]}
          >
            <Select
              showSearch
              placeholder="请选择患者"
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={patientList.map((item) => ({
                value: item.id,
                label: `${item.name}患者`,
              }))}
            />
          </Form.Item>

          {/* 医生选择 */}
          <Form.Item
            label="医生"
            name="doctorId"
            rules={[{ required: true, message: '请选择医生' }]}
          >
            <Cascader
              options={options}
              onChange={onChange}
              placeholder="请选择医生"
            />
          </Form.Item>

          {/* 总金额 */}
          <Form.Item
            label="总金额"
            name="total"
            rules={[
              { required: true, message: '请输入总金额' },
            ]}
          >
            <Input type="number" placeholder='请输入金额' />
          </Form.Item>

          {/* 日期 */}
          <Form.Item
            label="日期"
            name="date"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <Input type="date" />
          </Form.Item>

          {/* 支付状态 */}
          <Form.Item
            label="支付状态"
            name="paymentStatus"
            rules={[{ required: true, message: '请选择支付状态' }]}
          >
            <Select placeholder="请选择订单状态">
              <Select.Option value={1}>未支付</Select.Option>
              <Select.Option value={2}>已支付</Select.Option>
              <Select.Option value={3}>已取消</Select.Option>
              <Select.Option value={4}>已超时</Select.Option>
            </Select>
          </Form.Item>

          {/* 支付方式 */}
          <Form.Item
            label="支付方式"
            name="paymentMethod"
            rules={[{ required: true, message: '请选择支付方式' }]}
          >
            <Select placeholder="请选择支付方式">
              <Select.Option value={1}>支付宝</Select.Option>
              <Select.Option value={2}>微信支付</Select.Option>
              <Select.Option value={3}>余额支付</Select.Option>
            </Select>
          </Form.Item>
          {/* 订单类型 */}
          <Form.Item
            label="订单类型"
            name="type"
            rules={[{ required: true, message: '请选择订单类型' }]}
          >
            <Select placeholder="请选择订单类型">
              <Select.Option value={1}>挂号</Select.Option>
              <Select.Option value={2}>住院</Select.Option>
              <Select.Option value={3}>其他</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default AdOrder;
