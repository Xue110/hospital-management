import { useEffect, useState } from 'react';
import './index.scss';
import {
  Cascader,
  DatePicker,
  Form,
  InputNumber,
  message,
  Modal,
  Select,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../../type/login';
import { getHospitalData } from '../../../../../store/module/storge';
import { optionsData } from '../../../../../utils/data';
import { addReport } from '../../../../../apis/patient';
const FormDoctor = (props: any) => {
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const dispatch = useDispatch<AppDispatch>();
  const hospitalData = useSelector((state: any) => state.hospital.hospitalList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm(); // 修正为 Form.useForm() 返回的 form 实例
  const [loading, setLoading] = useState(false); // 用于控制提交按钮的加载状态
  const [title, setTitle] = useState('添加检查报告');
  useEffect(() => {
    setTitle('添加检查报告');
    form.resetFields();
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
      if (userInfo.roleId === 1) {
        values.hospitalId = values.doctorId[0];
        values.doctorId = values.doctorId[1];
      } else if (userInfo.roleId === 2) {
        values.hospitalId = userInfo.id;
      } else if (userInfo.roleId === 3) {
        values.hospitalId = userInfo.hospitalId;
        values.doctorId = userInfo.id;
      }
      values.testDate = values.testDate.format('YYYY-MM-DD HH:mm:ss');
      const res = await addReport(values);
      if (res.code === 200) {
        // 添加成功
        message.success('添加成功');
        form.resetFields(); // 提交成功后重置表单
        await props.refresh(); // 刷新用户列表
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
          {/* 检查项目 */}
          <Form.Item
            label="检查项目"
            name="reportInfoId"
            rules={[{ required: true, message: '请选择检查项目' }]}
          >
            <Select placeholder="请选择检查项目">
              {hospitalData.reportCounts.map((report: any) => (
                <Select.Option key={report.id} value={report.id}>
                  {report.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="检查时间"
            name="testDate"
            rules={[{ required: true, message: '请选择检查时间' }]}
          >
            <DatePicker showTime />
          </Form.Item>
          {/* 检查费用 */}
          <Form.Item
            label="检查费用"
            name="fee"
            rules={[{ required: true, message: '请输入检查费用' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              placeholder="请输入检查费用"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default FormDoctor;
