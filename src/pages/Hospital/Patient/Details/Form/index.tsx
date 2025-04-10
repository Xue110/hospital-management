import { useEffect, useState } from 'react';
import './index.scss';
import {
  Cascader,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../../type/login';
import { getHospitalData } from '../../../../../store/module/storge';
import { optionsData } from '../../../../../utils/data';
import { addPatient, updatePatient } from '../../../../../apis/patient';
import dayjs from 'dayjs';
const FormDoctor = (props: any) => {
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const dispatch = useDispatch<AppDispatch>();
  const hospitalData = useSelector((state: any) => state.hospital.hospitalList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm(); // 修正为 Form.useForm() 返回的 form 实例
  const [loading, setLoading] = useState(false); // 用于控制提交按钮的加载状态
  const [title, setTitle] = useState('添加患者信息');
  useEffect(() => {
    if (props.info && Object.keys(props.info).length > 0) {
      setTitle('编辑患者信息');
      form.setFieldsValue(props.info);
      form.setFieldsValue({
        birth: dayjs(props.info.birth),
        doctorId: [props.info.hospitalId, props.info.doctorId],
      });
    } else {
      setTitle('添加患者信息');
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
      setIsModalOpen(false);
      if (props.info && Object.keys(props.info).length > 0) {
        values.id = props.info.id;
        const res = await updatePatient(values);
        if (res.code === 200) {
          // 修改成功
          message.success('修改成功');
          form.resetFields(); // 提交成功后重置表单
          await props.refresh(); // 刷新用户列表
        }
      } else {
        if (userInfo.roleId === 1) {
          values.hospitalId = values.doctorId[0];
          values.doctorId = values.doctorId[1];
        } else if (userInfo.roleId === 2) {
          values.hospitalId = userInfo.id;
        } else if (userInfo.roleId === 3) {
          values.hospitalId = userInfo.hospitalId;
          values.doctorId = userInfo.id;
        }
        values.birth = values.birth.format('YYYY-MM-DD');
        const res = await addPatient(values);
        if (res.code === 200) {
          // 添加成功
          message.success('添加成功');
          form.resetFields(); // 提交成功后重置表单
          await props.refresh(); // 刷新用户列表
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
            label="患者名"
            name="name"
            rules={[{ required: true, message: '请输入患者名' }]}
          >
            <Input placeholder="请输入患者名" />
          </Form.Item>
          {userInfo.roleId !== 3 && (
            <Form.Item
              label="主治医师"
              name="doctorId"
              rules={[{ required: true, message: '请选择此患者的主治医生' }]}
            >
              {userInfo.roleId === 1 && (
                <Cascader options={optionsData} placeholder="请选择主治医师" />
              )}
              {userInfo.roleId === 2 && (
                <Select placeholder="请选择主治医师">
                  {hospitalData.doctorCounts.map((doctor: any) => (
                    <Select.Option key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          )}
          {/* 性别 */}
          <Form.Item
            label="性别"
            name="gender"
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Select placeholder="请选择性别">
              <Select.Option value={0}>男</Select.Option>
              <Select.Option value={1}>女</Select.Option>
            </Select>
          </Form.Item>
          {/* 出生日期 */}
          <Form.Item
            label="出生日期"
            name="birth"
            rules={[{ required: true, message: '请选择出生日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          {/* 疾病史 */}
          <Form.Item
            label="疾病史"
            name="medicalHistory"
            rules={[{ required: true, message: '请输入疾病史' }]}
          >
            <Input.TextArea placeholder="请输入疾病史" />
          </Form.Item>
          {/* 过敏史 */}
          <Form.Item
            label="过敏史"
            name="allergies"
            rules={[{ required: true, message: '请输入过敏史' }]}
          >
            <Input.TextArea placeholder="请输入过敏史" />
          </Form.Item>
          {/* 紧急联系人 */}
          <Form.Item
            label="紧急联系人"
            name="contact"
            rules={[{ required: true, message: '请输入紧急联系人' }]}
          >
            <Input placeholder="请输入紧急联系人" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default FormDoctor;
