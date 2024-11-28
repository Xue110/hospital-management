import { useEffect, useState } from 'react';
import './index.scss';
import {
  Form,
  GetProp,
  Image,
  Input,
  message,
  Modal,
  Select,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import { addHospital, updateHospital } from '../../../../apis/hospital';
import { PlusOutlined } from '@ant-design/icons';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const AdHospital = (props: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm(); // 修正为 Form.useForm() 返回的 form 实例
  const [loading, setLoading] = useState(false); // 用于控制提交按钮的加载状态
  const [title, setTitle] = useState('添加医院信息');
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

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  useEffect(() => {
    if (props.info && Object.keys(props.info).length > 0) {
      setTitle('编辑医院信息');
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
      setFileList([]);
      setTitle('添加医院信息');
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
      if (props.info && Object.keys(props.info).length > 0) {
        const res = await updateHospital(values);
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
        const res = await addHospital(values);
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
            label="医院名称"
            name="name"
            rules={[{ required: true, message: '请输入医院名称' }]}
          >
            <Input placeholder="请输入医院名称" />
          </Form.Item>
          <Form.Item
            label="医院照片"
            name="image"
            rules={[{ required: true, message: '请添加医院照片' }]}
          >
            <div>
              <Upload
                action="https://localhost:8077/admin/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
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
            label="医院地址"
            name="address"
            rules={[{ required: true, message: '请输入医院地址' }]}
          >
            <Input placeholder="请输入医院地址" />
          </Form.Item>
          <Form.Item
            label="医院电话"
            name="phone"
            rules={[{ required: true, message: '请输入医院电话' }]}
          >
            <Input placeholder="请输入医院电话" />
          </Form.Item>
          <Form.Item
            label="医院官网"
            name="website"
            rules={[{ required: true, message: '请输入医院官网' }]}
          >
            <Input placeholder="请输入医院官网" />
          </Form.Item>
          <Form.Item
            name="citiesId"
            label="所在城市"
            rules={[{ required: true, message: '请选择所在城市' }]}
          >
            <Select placeholder="请选择所在城市">
              <Select.Option value={1}>长春市</Select.Option>
              <Select.Option value={2}>吉林市</Select.Option>
              <Select.Option value={3}>四平市</Select.Option>
              <Select.Option value={4}>辽源市</Select.Option>
              <Select.Option value={5}>通化市</Select.Option>
              <Select.Option value={6}>白山市</Select.Option>
              <Select.Option value={7}>松原市</Select.Option>
              <Select.Option value={8}>白城市</Select.Option>
              <Select.Option value={9}>延边朝鲜族自治州</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="医院简介"
            name="description"
            rules={[{ required: true, message: '请输入医院简介' }]}
          >
            <Input.TextArea placeholder="请输入医院简介" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default AdHospital;
