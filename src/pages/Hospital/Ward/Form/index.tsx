import { useEffect, useState } from 'react';
import './index.scss';
import { Form, Input, InputNumber, message, Modal, Select } from 'antd';
import {
  addWard,
  updateWard,
} from '../../../../apis/hospital';
import { useSelector } from 'react-redux';
const FormDoctor = (props: any) => {
  const hospitalData = useSelector((state: any) => state.hospital.hospitalList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm(); // 修正为 Form.useForm() 返回的 form 实例
  const [loading, setLoading] = useState(false); // 用于控制提交按钮的加载状态
  const [title, setTitle] = useState('添加病房');
  useEffect(() => {
    if (props.info && Object.keys(props.info).length > 0) {
      setTitle('修改床位信息');
      form.setFieldsValue(props.info);
    } else {
      setTitle('添加病房');
      form.resetFields();
    }
    if (props.open) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [props.info, props.open]);
  // 提交表单数据
  const handleOk = async () => {
    try {
      // 表单验证通过后
      const values = await form.validateFields();
      setLoading(true); // 开始请求时禁用按钮，显示加载状态
      setIsModalOpen(false); // 关闭弹窗
      if (props.info && Object.keys(props.info).length > 0) {
        const updateValues = {
          id: props.info.roomsId,
          bedId: values.id,
          status: values.status,
        };
        const res = await updateWard(updateValues);
        if (res.code === 200) {
          // 修改成功
          message.success('修改成功');
          form.resetFields(); // 提交成功后重置表单
          await props.refresh(); // 刷新用户列表
        } else {
          message.error('修改失败');
        }
      } else {
        console.log(values)
        const res = await addWard(values);
        if (res.code === 200) {
          // 添加成功
          message.success('添加成功');
          form.resetFields(); // 提交成功后重置表单
          await props.refresh(); // 刷新用户列表
        }
      }
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
        title={title}
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
          {(!props.info || Object.keys(props.info).length === 0) && (
            <>
              <Form.Item
                label="病房号"
                name="number"
                rules={[
                  { required: true, message: '请填写病房号' },
                  {
                    pattern: /^Rooms\d+$/,
                    message: '病房号应以 "Rooms" 开头，后跟数字',
                  },
                ]}
              >
                <Input placeholder="请填写病房号,如：Rooms666" />
              </Form.Item>
              <Form.Item
                label="入住费用"
                name="fee"
                rules={[{ required: true, message: '请输入入住费用' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入入住费用" />
              </Form.Item>
              <Form.Item
                label="科室"
                name="departmentId"
                rules={[{ required: true, message: '请选择科室' }]}
              >
                <Select placeholder="请选择科室">
                  {hospitalData.departmentCounts.map((item: any) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}
          {props.info && Object.keys(props.info).length > 0 && (
            <>
              <Form.Item
                label="床位ID"
                name="id"
                rules={[{ required: true, message: '请填写床位ID' }]}
              >
                <Input placeholder="请填写床位ID" disabled />
              </Form.Item>
              <Form.Item
                label="床位状态"
                name="status"
                rules={[{ required: true, message: '请选择病房状态' }]}
              >
                <Select placeholder="请选择病房状态">
                  <Select.Option value={1}>空闲</Select.Option>
                  <Select.Option value={2}>已入住</Select.Option>
                  <Select.Option value={3}>维修中</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </>
  );
};
export default FormDoctor;
