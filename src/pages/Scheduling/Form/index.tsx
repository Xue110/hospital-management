import { useEffect, useState } from 'react';
import './index.scss';
import {
  DatePicker,
  Form,
  message,
  Modal,
  TimePicker,
} from 'antd';
import { useSelector } from 'react-redux';
import { addSchedule, updateSchedule } from '../../../apis/hospital';
import { SmileOutlined } from '@ant-design/icons';
import moment from 'moment';
const FormDoctor = (props: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm(); // 修正为 Form.useForm() 返回的 form 实例
  const [loading, setLoading] = useState(false); // 用于控制提交按钮的加载状态
  const [title, setTitle] = useState('添加排班信息');
  const userInfo = useSelector((state: any) => state.user.userInfo);
  useEffect(() => {
    if (props.info && Object.keys(props.info).length > 0) {
      setTitle('编辑排班信息');
      form.setFieldsValue({
        departmentId: props.info.departmentId,
        date: props.info.date ? moment(props.info.date) : null,  // 需要使用 moment 转换日期
        time: props.info.time ? [moment(props.info.startTime, 'HH:mm:ss'), moment(props.info.endTime, 'HH:mm:ss')] : null, // 处理时间段
      });
    } else {
      setTitle('添加排班信息');
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
      values.date = values.date.format('YYYY-MM-DD');
      const [startTime, endTime] = values.time;
      values.startTime = startTime.format('HH:mm:ss');
      values.endTime = endTime.format('HH:mm:ss');
      setLoading(true); // 开始请求时禁用按钮，显示加载状态
      setIsModalOpen(false); // 关闭弹窗
      if (props.info && Object.keys(props.info).length > 0) {
        values.id = props.info.id;
        const res = await updateSchedule(values);
        if (res.code === 200) {
          // 修改成功
          message.success('修改成功');
          form.resetFields(); // 提交成功后重置表单
          await props.refresh(); // 刷新用户列表
        } else {
          message.error('修改失败');
        }
      } else {
        if (userInfo.roleId === 1) {
          values.hospitalId = values.doctorId[0];
          values.doctorId = values.doctorId[1];
        } else {
          values.hospitalId = userInfo.id;
        }
        values.userId = localStorage.getItem('id');
        const res = await addSchedule(values);
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
          <>
            {/* 排班日期 */}
            <Form.Item
              label="排班日期"
              name="date"
              rules={[{ required: true, message: '请选择排班日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            {/* 排班时间段 */}
            <Form.Item name="time" label="预约时间段">
              <TimePicker.RangePicker prefix={<SmileOutlined />} />
            </Form.Item>
          </>
        </Form>
      </Modal>
    </>
  );
};
export default FormDoctor;
