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
import { addVisit } from '../../../../../apis/patient';
import { optionsData } from '../../../../../utils/data';
const FormDoctor = (props: any) => {
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const dispatch = useDispatch<AppDispatch>();
  const hospitalData = useSelector((state: any) => state.hospital.hospitalList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm(); // 修正为 Form.useForm() 返回的 form 实例
  const [loading, setLoading] = useState(false); // 用于控制提交按钮的加载状态
  const [title, setTitle] = useState('添加就诊记录');
  const { RangePicker } = DatePicker;
  let matchingObjects = hospitalData.userCounts.filter((user: any) =>
    hospitalData.patientCounts.some(
      (patient: any) => patient.name === user.name
    )
  );
  useEffect(() => {
    setTitle('添加就诊记录');
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
      if (values.time && values.time.length > 0) {
        const [startTime, endTime] = values.time;
        values.startTime = startTime.format('YYYY-MM-DD HH:mm:ss');
        values.endTime = endTime.format('YYYY-MM-DD HH:mm:ss');
      }
      values.date = values.date.format('YYYY-MM-DD');
      const res = await addVisit(values);
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
            label="用户"
            name="userId"
            rules={[{ required: true, message: '请选择用户' }]}
          >
            <Select placeholder="请选择用户">
              {matchingObjects.map((user: any) => (
                <Select.Option key={user.id} value={user.id}>
                  {user.name}
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
            label="科室"
            name="departmentId"
            rules={[{ required: true, message: '请选择科室' }]}
          >
            <Select placeholder="请选择科室">
              {hospitalData.departmentCounts.map((department: any) => (
                <Select.Option key={department.id} value={department.id}>
                  {department.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="支付时间"
            name="date"
            rules={[{ required: true, message: '请选择支付时间' }]}
          >
            <DatePicker />
          </Form.Item>
          {/* 挂号状态 1：待确认 2.已确认 3：已就诊 4：已取消 */}
          <Form.Item
            label="挂号状态"
            name="status"
            rules={[{ required: true, message: '请选择挂号状态' }]}
          >
            <Select placeholder="请选择挂号状态">
              <Select.Option value={1}>待确认</Select.Option>
              <Select.Option value={2}>已确认</Select.Option>
              <Select.Option value={3}>已就诊</Select.Option>
              <Select.Option value={4}>已取消</Select.Option>
            </Select>
          </Form.Item>
          {/* 支付状态 1：未支付 2：已支付 3.已取消 */}
          <Form.Item
            label="支付状态"
            name="paymentStatus"
            rules={[{ required: true, message: '请选择支付状态' }]}
          >
            <Select placeholder="请选择支付状态">
              <Select.Option value={1}>未支付</Select.Option>
              <Select.Option value={2}>已支付</Select.Option>
              <Select.Option value={3}>已取消</Select.Option>
            </Select>
          </Form.Item>
          {/* 支付金额 */}
          <Form.Item
            label="支付金额"
            name="paymentAmount"
            rules={[{ required: true, message: '请输入支付金额' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              placeholder="请输入支付金额"
            />
          </Form.Item>
          {/* 就诊时间 */}
          <Form.Item name="time" label="预约时间段">
            <RangePicker
              showTime
              id={{
                start: 'startInput',
                end: 'endInput',
              }}
              onFocus={(_, info) => {
                console.log('Focus:', info.range);
              }}
              onBlur={(_, info) => {
                console.log('Blur:', info.range);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default FormDoctor;
