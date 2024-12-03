import { useEffect, useState } from 'react';
import './index.scss';
import {
  Form,
  Input,
  message,
  Modal,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { addDepartment, updateDepartment } from '../../../../apis/department';
import { AppDispatch } from '../../../../type/login';
import { useDispatch } from 'react-redux';
import { getHospitalData } from '../../../../store/module/storge';
const FormDataSource = (props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm(); // 修正为 Form.useForm() 返回的 form 实例
  const [loading, setLoading] = useState(false); // 用于控制提交按钮的加载状态
  const [title, setTitle] = useState('添加科室信息');
  useEffect(() => {
    if (props.info && Object.keys(props.info).length > 0) {
      setTitle('编辑科室信息');
      form.setFieldsValue(props.info);
    } else {
      setTitle('添加科室信息');
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
        values.id = props.info.id;
        const res = await updateDepartment(values);
        if (res.code === 200) {
          // 修改成功
          message.success('修改成功');
          form.resetFields(); // 提交成功后重置表单
          await props.refresh(); // 刷新科室列表
        }
      } else {
        const res = await addDepartment(values);
        if (res.code === 200) {
          // 添加成功
          message.success('添加成功');
          form.resetFields(); // 提交成功后重置表单
          await props.refresh(); // 刷新科室列表
        }
      }
      await dispatch(getHospitalData());
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
          <Form.Item
            label="科室名称"
            name="name"
            rules={[{ required: true, message: '请输入科室名称' }]}
          >
            <Input placeholder="请输入科室名称" />
          </Form.Item>
          <Form.Item
            label="科室简介"
            name="description"
            rules={[{ required: true, message: '请输入科室简介' }]}
          >
            <TextArea rows={6} placeholder="请输入科室简介"  />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default FormDataSource;
