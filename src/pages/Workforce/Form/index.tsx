import { useEffect, useState } from 'react';
import './index.scss';
import {
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
} from 'antd';
import { useSelector } from 'react-redux';
import { addAppointment, updateAppointment } from '../../../apis/hospital';
const { RangePicker } = DatePicker;
const FormDoctor = (props: any) => {
  const hospitalData = useSelector((state: any) => state.hospital.hospitalList);
  const [isModalOpen, setIsModalOpen] = useState(false); // 用于控制弹窗的显示与隐藏
  const [modal, setModal] = useState<any>(false);
  const [form] = Form.useForm(); // 修正为 Form.useForm() 返回的 form 实例
  const [patientForm] = Form.useForm();
  const [loading, setLoading] = useState(false); // 用于控制提交按钮的加载状态
  const [title, setTitle] = useState('添加挂号信息');
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const [patientData, setPatientData] = useState<any>({});
  useEffect(() => {
    if (props.info && Object.keys(props.info).length > 0) {
      setTitle('编辑挂号信息');
      form.setFieldsValue({
        patientId: props.info.patientId,
        status: [
          props.info.paymentStatus === 1
            ? '未支付'
            : props.info.paymentStatus === 2
            ? '已支付'
            : '已取消',
          props.info.status === 1
            ? '待确认'
            : props.info.status === 2
            ? '已确认'
            : props.info.status === 3
            ? '已就诊'
            : '已取消',
        ],
      });
    } else {
      setTitle('添加挂号信息');
      form.resetFields();
    }
    if (props.open) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [props.info, props.open]);
  // 提交表单数据
  const handleAdd = () => {
    const values = patientForm.getFieldsValue();
    setPatientData(values);
    setModal(false);
  };
  const handleOk = async () => {
    try {
      // 表单验证通过后
      const values = await form.validateFields();
      setLoading(true); // 开始请求时禁用按钮，显示加载状态
      setIsModalOpen(false); // 关闭弹窗
      if (props.info && Object.keys(props.info).length > 0) {
        const updateValues = {
          id: props.info.id,
          patientId: values.patientId,
          paymentStatus: Number(values.status[0]),
          status: Number(values.status[1]),
        };
        console.log(updateValues);
        const res = await updateAppointment(updateValues);
        if (res.code === 200) {
          // 修改成功
          message.success('修改成功');
          form.resetFields(); // 提交成功后重置表单
          await props.refresh(); // 刷新用户列表
        } else {
          message.error('修改失败');
        }
      } else {
        values.hospitalId = userInfo.hospitalId;
        values.doctorId = userInfo.id;
        if (!values.userId) {
          values.name = patientData.name || ''; // 防止 patientData.name 为空
          values.gender = patientData.gender || ''; // 防止 patientData.gender 为空
          values.birth = patientData.birth
            ? patientData.birth.format('YYYY-MM-DD')
            : '';
        }
        const [startTime, endTime] = values.time || []; // 获取时间范围
        values.startTime = startTime.format('YYYY-MM-DD HH:mm:ss');
        values.endTime = endTime.format('YYYY-MM-DD HH:mm:ss');
        values.date = values.date.format('YYYY-MM-DD');
        const res = await addAppointment(values);
        if (res.code === 200) {
          // 添加成功
          message.success('添加成功');
          form.resetFields(); // 提交成功后重置表单
          await props.refresh(); // 刷新用户列表
          setPatientData({});
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
  const handleModal = () => {
    setModal(false);
    patientForm.resetFields();
  };
  const options = hospitalData.patientCounts.map(
    (patient: { id: number; name: string }) => ({
      value: patient.id,
      label: patient.name,
    })
  );
  interface Option {
    value: string;
    label: string;
    children?: Option[];
  }
  const statusOptions: Option[] = [
    {
      value: '2',
      label: '已支付',
      children: [
        {
          value: '2',
          label: '已确认',
        },
        {
          value: '3',
          label: '已就诊',
        },
      ],
    },
    {
      value: '3',
      label: '已退款',
      children: [
        {
          value: '4',
          label: '已取消',
        },
      ],
    },
  ];

  return (
    <>
      <Modal
        title="添加患者信息"
        open={modal}
        onOk={handleAdd}
        onCancel={handleModal}
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
        <Form form={patientForm} layout="vertical">
          <Form.Item
            label="患者姓名"
            name="name"
            rules={[{ required: true, message: '请输入患者姓名' }]}
          >
            <Input placeholder="请输入患者姓名" />
          </Form.Item>
          <Form.Item
            label="患者性别"
            name="gender"
            rules={[{ required: true, message: '请选择患者性别' }]}
          >
            <Select placeholder="请选择患者性别">
              <Select.Option value="男">男</Select.Option>
              <Select.Option value="女">女</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="患者出生日期"
            name="birth"
            rules={[{ required: true, message: '请选择患者出生日期' }]}
          >
            <DatePicker format={'YYYY-MM-DD'} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
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
              <Form.Item label="患者" name="userId">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Select
                    showSearch
                    style={{ width: '50%' }}
                    placeholder="请输入患者名"
                    optionFilterProp="label"
                    value={form.getFieldValue('userId')}
                    onChange={(value) => form.setFieldsValue({ userId: value })}
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
                  <Button
                    size="small"
                    style={{
                      width: 'auto',
                      marginLeft: '10px',
                      fontSize: '13px',
                    }}
                    type="primary"
                    onClick={() => setModal(true)}
                  >
                    {patientData && patientData.length > 0
                      ? patientData.name
                      : '未找到患者？添加患者'}
                  </Button>
                </div>
              </Form.Item>
              <Form.Item
                label="所在科室"
                name="departmentId"
                rules={[{ required: true, message: '请输入挂号科室' }]}
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
              <Form.Item
                label="挂号日期"
                name="date"
                rules={[{ required: true, message: '请选择挂号时间' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                  placeholder="请选择挂号日期"
                />
              </Form.Item>
              <Form.Item
                label="挂号费用"
                name="paymentAmount"
                rules={[{ required: true, message: '请输入挂号费用' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="请输入挂号费用"
                />
              </Form.Item>
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
              <Form.Item
                label="挂号时间"
                name="time"
                rules={[{ required: true, message: '请选择挂号时间' }]}
              >
                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
              </Form.Item>
            </>
          )}
          {props.info && Object.keys(props.info).length > 0 && (
            <>
              <Form.Item
                label="患者姓名"
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
                label="挂号状态"
                name="status"
                rules={[{ required: true, message: '请选择挂号状态' }]}
                initialValue={[props.info.status, props.info.paymentStatus]}
              >
                <Cascader
                  defaultValue={[
                    props.info.paymentStatus === 1
                      ? '未支付'
                      : props.info.paymentStatus === 2
                      ? '已支付'
                      : '已取消',
                    props.info.status === 1
                      ? '待确认'
                      : props.info.status === 2
                      ? '已确认'
                      : props.info.status === 3
                      ? '已就诊'
                      : '已取消',
                  ]}
                  options={statusOptions}
                  placeholder="请选择挂号状态"
                />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </>
  );
};
export default FormDoctor;
