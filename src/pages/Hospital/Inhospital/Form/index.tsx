import { useEffect, useState } from 'react';
import './index.scss';
import {
  Cascader,
  CascaderProps,
  DatePicker,
  Form,
  message,
  Modal,
  Select,
} from 'antd';
import {
  addHospitalManage,
  updateHospitalManage,
} from '../../../../apis/hospital';
import { useSelector } from 'react-redux';
import { optionsData, roomOptions } from '../../../../utils/data';
const FormDoctor = (props: any) => {
  const hospitalData = useSelector((state: any) => state.hospital.hospitalList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm(); // 修正为 Form.useForm() 返回的 form 实例
  const [loading, setLoading] = useState(false); // 用于控制提交按钮的加载状态
  const [title, setTitle] = useState('添加住院信息');
  const userInfo = useSelector((state: any) => state.user.userInfo);
  useEffect(() => {
    if (props.info && Object.keys(props.info).length > 0) {
      setTitle('编辑住院信息');
      form.setFieldsValue(props.info);
    } else {
      setTitle('添加住院信息');
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
          patientId: values.patientId,
          status: values.status,
          dischargeDate: '',
          roomsId: props.info.roomsId,
          bedId: props.info.bedId,
        };
        const res = await updateHospitalManage(updateValues);
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
          values.hospitalId = userInfo.hospitalId;
        }
        values.roomsId = values.room[0];
        values.bedId = values.room[1];
        values.admissionDate = values.admissionDate.format('YYYY-MM-DD');
        const res = await addHospitalManage(values);
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
  const options = hospitalData.patientCounts.map(
    (patient: { id: number; name: string }) => ({
      value: patient.id,
      label: patient.name,
    })
  );
  const onChange: CascaderProps<any>['onChange'] = (value) => {
    console.log(value);
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
                label="患者"
                name="patientId"
                rules={[{ required: true, message: '请选择患者' }]}
              >
                <Select
                  showSearch
                  placeholder="请输入患者名"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) => {
                    const labelA =
                      typeof optionA.label === 'string'
                        ? optionA.label.toLowerCase()
                        : '';
                    const labelB =
                      typeof optionB.label === 'string'
                        ? optionB.label.toLowerCase()
                        : '';
                    return labelA.localeCompare(labelB);
                  }}
                  options={options}
                />
              </Form.Item>
              <Form.Item
                label="主治医师"
                name="doctorId"
                rules={[{ required: true, message: '请选择此患者的主治医生' }]}
              >
                {userInfo.roleId === 1 && (
                  <Cascader
                    options={optionsData}
                    onChange={onChange}
                    placeholder="请选择主治医师"
                  />
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
              <Form.Item
                label="所在科室"
                name="departmentId"
                rules={[{ required: true, message: '请输入住院科室' }]}
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
                label="病房"
                name="room"
                rules={[{ required: true, message: '请选择入住病房' }]}
              >
                <Cascader
                  options={roomOptions}
                  onChange={onChange}
                  placeholder="请选择入住病房"
                />
              </Form.Item>
              <Form.Item
                label="入院日期"
                name="admissionDate"
                rules={[{ required: true, message: '请选择入院日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                label="住院状态"
                name="status"
                rules={[{ required: true, message: '请选择住院状态' }]}
              >
                <Select placeholder="请选择住院状态">
                  <Select.Option value={1}>住院中</Select.Option>
                  <Select.Option value={2}>已出院</Select.Option>
                  <Select.Option value={3}>已转院</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}
          {props.info && Object.keys(props.info).length > 0 && (
            <>
              <Form.Item
                label="患者"
                name="patientId"
                rules={[{ required: true, message: '请选择患者' }]}
              >
                <Select
                  disabled
                  showSearch
                  placeholder="请输入患者名"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) => {
                    const labelA =
                      typeof optionA.label === 'string'
                        ? optionA.label.toLowerCase()
                        : '';
                    const labelB =
                      typeof optionB.label === 'string'
                        ? optionB.label.toLowerCase()
                        : '';
                    return labelA.localeCompare(labelB);
                  }}
                  options={options}
                />
              </Form.Item>
              <Form.Item
                label="住院状态"
                name="status"
                rules={[{ required: true, message: '请选择住院状态' }]}
              >
                <Select placeholder="请选择住院状态">
                  <Select.Option value={1} disabled>
                    住院中
                  </Select.Option>
                  <Select.Option value={2}>已出院</Select.Option>
                  <Select.Option value={3}>已转院</Select.Option>
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
