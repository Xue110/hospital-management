import { useEffect, useState } from 'react';
import './index.scss';
import {
  Form,
  Input,
  message,
  Modal,
} from 'antd';
import { addMedication, updateMedication } from '../../../../apis/hospital';
import TextArea from 'antd/es/input/TextArea';
const FormDoctor = (props: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm(); // 修正为 Form.useForm() 返回的 form 实例
  const [loading, setLoading] = useState(false); // 用于控制提交按钮的加载状态
  const [title, setTitle] = useState('添加药品');
  useEffect(() => {
    if (props.info && Object.keys(props.info).length > 0) {
      setTitle('编辑药品');
      form.setFieldsValue(props.info);
    } else {
      setTitle('添加药品');
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
      console.log(values);
      setLoading(true); // 开始请求时禁用按钮，显示加载状态
      setIsModalOpen(false); // 关闭弹窗
      if (props.info && Object.keys(props.info).length > 0) {
        const updateValues = {
          id: props.info.id,
          name: values.name,
          price: values.price,
          description: values.description,
          stock: values.stock,
          supplier: values.supplier,
        };
        const res = await updateMedication(updateValues);
        if (res.code === 200) {
          // 修改成功
          message.success('修改成功');
          form.resetFields(); // 提交成功后重置表单
          await props.refresh(); // 刷新用户列表
        } else {
          message.error('修改失败');
        }
      } else {
        const res = await addMedication(values);
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
                label="药品名"
                name="name"
                rules={[{ required: true, message: '请输入药品名' }]}
              >
                <Input placeholder="请输入药品名" />
              </Form.Item>
              <Form.Item
                label="药品数量"
                name="stock"
                rules={[{ required: true, message: '请输入药品数量' }]}
              >
                <Input placeholder="请输入药品数量" />
              </Form.Item>
              <Form.Item
                label="药品价格"
                name="price"
                rules={[{ required: true, message: '请输入药品价格' }]}
              >
                <Input placeholder="请输入药品价格" />
              </Form.Item>
              <Form.Item
                label="药品描述"
                name="description"
                rules={[{ required: true, message: '请输入药品描述' }]}
              >
                <TextArea rows={4} placeholder="请输入药品描述" />
              </Form.Item>
              <Form.Item label="药品供货商" name="supplier">
                <Input placeholder="请输入药品供货商" />
              </Form.Item>
            </>
          )}
          {props.info && Object.keys(props.info).length > 0 && (
            <>
              <Form.Item
                label="药品名"
                name="name"
                initialValue={props.info.name}
                rules={[{ required: true, message: '请输入药品名' }]}
              >
                <Input placeholder="请输入药品名" />
              </Form.Item>
              <Form.Item
                label="药品数量"
                name="stock"
                rules={[{ required: true, message: '请输入药品数量' }]}
              >
                <Input placeholder="请输入药品数量" />
              </Form.Item>
              <Form.Item
                label="药品价格"
                name="price"
                rules={[{ required: true, message: '请输入药品价格' }]}
              >
                <Input placeholder="请输入药品价格" />
              </Form.Item>
              <Form.Item
                label="药品描述"
                name="description"
                rules={[{ required: true, message: '请输入药品描述' }]}
              >
                <TextArea rows={4} placeholder="请输入药品描述" />
              </Form.Item>
              <Form.Item label="药品供货商" name="supplier">
                <Input placeholder="请输入药品供货商" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </>
  );
};
export default FormDoctor;
