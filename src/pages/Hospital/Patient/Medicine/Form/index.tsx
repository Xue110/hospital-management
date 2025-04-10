import { useEffect, useState } from 'react';
import './index.scss';
import { Cascader, Form, Input, message, Modal, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../../type/login';
import { getHospitalData } from '../../../../../store/module/storge';
import {
  addPrescription,
  updatePrescription,
} from '../../../../../apis/patient';
import { optionsData } from '../../../../../utils/data';
const FormDoctor = (props: any) => {
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const dispatch = useDispatch<AppDispatch>();
  const hospitalData = useSelector((state: any) => state.hospital.hospitalList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm(); // 修正为 Form.useForm() 返回的 form 实例
  const [loading, setLoading] = useState(false); // 用于控制提交按钮的加载状态
  const [title, setTitle] = useState('添加处方信息');
  useEffect(() => {
    if (props.info && Object.keys(props.info).length > 0) {
      setTitle('编辑处方信息');
      form.setFieldsValue(props.info);
      form.setFieldsValue({
        doctorId: [props.info.hospitalId, props.info.doctorId],
      });
    } else {
      setTitle('添加处方信息');
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
        const res = await updatePrescription(values);
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
        const res = await addPrescription(values);
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
            label="药品"
            name="medicationId"
            rules={[{ required: true, message: '请选择药品' }]}
          >
            <Select placeholder="请选择药品">
              {hospitalData.medicationCounts.map((medication: any) => (
                <Select.Option key={medication.id} value={medication.id}>
                  {medication.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="患者"
            name="patientId"
            rules={[{ required: true, message: '请选择患者' }]}
          >
            <Select placeholder="请选择患者">
              {hospitalData.patientCounts.map((patient: any) => (
                <Select.Option key={patient.id} value={patient.id}>
                  {patient.name}
                </Select.Option>
              ))}
            </Select>
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
          <Form.Item
            label="药品剂量"
            name="dosage"
            rules={[{ required: true, message: '请输入药品剂量' }]}
          >
            <Input placeholder="请输入药品剂量" />
          </Form.Item>
          <Form.Item
            label="用药次数"
            name="frequency"
            rules={[{ required: true, message: '请输入用药次数' }]}
          >
            <Input placeholder="请输入用药次数" />
          </Form.Item>
          <Form.Item
            label="服药周期"
            name="duration"
            rules={[{ required: true, message: '请输入服药周期' }]}
          >
            <Input placeholder="请输入服药周期" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default FormDoctor;
