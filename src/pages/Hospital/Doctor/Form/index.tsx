import { useEffect, useState } from 'react';
import './index.scss';
import {
  Form,
  GetProp,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { addDoctor, updateDoctor } from '../../../../apis/doctor';
import TextArea from 'antd/es/input/TextArea';
import { qualificationList } from '../../../../utils/data';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../type/login';
import { getHospitalData } from '../../../../store/module/storge';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const FormDoctor = (props: any) => {
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const dispatch = useDispatch<AppDispatch>();
  const hospitalData = useSelector((state: any) => state.hospital.hospitalList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm(); // 修正为 Form.useForm() 返回的 form 实例
  const [loading, setLoading] = useState(false); // 用于控制提交按钮的加载状态
  const [title, setTitle] = useState('添加医生信息');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };
  const handleChange = (info: any) => {
    console.log('正在上传中', info);
    // 更新文件列表，处理上传结果
    const updatedFileList = info.fileList.map((file: any) => {
      if (file.status === 'done') {
        file.thumbUrl = file.response.data; // 服务器返回的 URL
      }
      return file;
    });
    setFileList(updatedFileList);
    // 上传完成后，弹出提示
    if (info.file.status === 'done') {
      message.success('上传成功');
    } else if (info.file.status === 'error') {
      message.error('上传失败');
    }
    console.log(updatedFileList); // 注意：这里的 updatedFileList 是最新的状态
  };
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  useEffect(() => {
    if (props.info && Object.keys(props.info).length > 0) {
      setTitle('编辑医生信息');
      form.setFieldsValue(props.info);
      if (fileList.length === 0) {
        fileList.push({
          uid: '-1',
          name: props.info.name,
          status: 'done',
          url: props.info.image,
        });
      }
    } else {
      fileList.length = 0;
      setTitle('添加医生信息');
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
      values.image = fileList[0].thumbUrl;
      setLoading(true); // 开始请求时禁用按钮，显示加载状态
      if (props.info && Object.keys(props.info).length > 0) {
        values.id = props.info.id;
        values.userId = props.info.userId;
        const res = await updateDoctor(values);
        if (res.code === 200) {
          // 修改成功
          message.success('修改成功');
          form.resetFields(); // 提交成功后重置表单
          setIsModalOpen(false); // 关闭弹窗
          await props.refresh(); // 刷新用户列表
        } else {
          message.error('修改失败');
        }
      } else {
        if(userInfo.roleId !== 1){
          values.hospitalId = userInfo.hospitalId;
        }
        const res = await addDoctor(values);
        if (res.code === 200) {
          // 添加成功
          message.success('添加成功');
          form.resetFields(); // 提交成功后重置表单
          setIsModalOpen(false); // 关闭弹窗
          await props.refresh(); // 刷新用户列表
        } else {
          message.error('添加失败');
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
  const token = localStorage.getItem('token');
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
            label="医生名称"
            name="name"
            rules={[{ required: true, message: '请输入医生名称' }]}
          >
            <Input placeholder="请输入医生名称" />
          </Form.Item>
          <Form.Item label="医生照片" name="image">
            <div>
              <Upload
                name="image"
                action="http://localhost:8077/admin/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                headers={{
                  token: token!,
                }}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
              {previewImage && (
                <Image
                  wrapperStyle={{ display: 'none' }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(''),
                  }}
                  src={previewImage}
                />
              )}
            </div>
          </Form.Item>
          <Form.Item
            label="医生职称"
            name="qualification"
            rules={[{ required: true, message: '请输入医生职称' }]}
          >
            <Select placeholder="请选择职称">
              {qualificationList.map((qualification) => (
                <Select.Option
                  key={qualification.name}
                  value={qualification.name}
                >
                  {qualification.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="所在科室"
            name="departmentId"
            rules={[{ required: true, message: '请输入医生科室' }]}
          >
            <Select placeholder="请选择科室">
              {hospitalData.departmentCounts.map((department: any) => (
                <Select.Option key={department.id} value={department.id}>
                  {department.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {(!props.info || Object.keys(props.info).length === 0) &&
          userInfo.roleId === 1 ? (
            <Form.Item
              label="所属医院"
              name="hospitalId"
              rules={[{ required: true, message: '请选择所属医院' }]}
            >
              <Select placeholder="请选择所属医院">
                {hospitalData.hospitalCounts.map((hospital: any) => (
                  <Select.Option key={hospital.id} value={hospital.id}>
                    {hospital.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          ) : null}
          <Form.Item
            label="医生电话"
            name="phone"
            rules={[{ required: true, message: '请输入医生电话' }]}
          >
            <Input placeholder="请输入医生电话" />
          </Form.Item>
          <Form.Item
            label="医生邮箱"
            name="email"
            rules={[{ required: true, message: '请输入医生邮箱' }]}
          >
            <Input placeholder="请输入医生邮箱" />
          </Form.Item>
          <Form.Item
            label="收费金额"
            name="fee"
            rules={[{ required: true, message: '请输入收费金额' }]}
          >
            <InputNumber addonAfter="￥" defaultValue={59} />
          </Form.Item>
          <Form.Item
            label="医生简介"
            name="description"
            rules={[{ required: true, message: '请输入医生简介' }]}
          >
            <TextArea rows={6} placeholder="请输入医生简介" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default FormDoctor;
