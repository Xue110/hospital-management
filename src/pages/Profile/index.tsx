import { useEffect, useState } from 'react';
import { getProfileAPI } from '../../apis/login';
import { updateUser } from '../../apis/user';
import './index.scss';
import {
  Button,
  Form,
  GetProp,
  Image,
  Input,
  message,
  Select,
  Spin,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { 
  cityList,
  qualificationList,
} from '../../utils/data';
import { useSelector } from 'react-redux';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const Profile = () => {
  const hospitalData = useSelector((state: any) => state.hospital.hospitalList);
  const [userInfo, setUserInfo] = useState<any>({
    username: '',
    password: '',
    email: '',
    phone: '',
    address: '',
    identityCard: '',
    roleId: 1,
  });
  const [loading, setLoading] = useState(false);

  // 获取个人信息
  const getUserInfo = async () => {
    setLoading(true);
    const res = await getProfileAPI();
    setLoading(false);
    if (res.code === 200) {
      setUserInfo(res.data);
    } else {
      message.error('获取用户信息失败');
    }
  };

  // 修改个人信息
  const changeUserInfo = async (values: any) => {
    setLoading(true);
    const res = await updateUser(values);
    setLoading(false);
    if (res.code === 200) {
      message.success('修改成功');
      getUserInfo();
    } else {
      message.error(res.msg || '修改失败');
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  // 表单初始化
  const [form] = Form.useForm();

  useEffect(() => {
    if (userInfo) {
      form.setFieldsValue(userInfo); // 将获取到的用户信息填充到表单中
      if (userInfo.image && fileList.length === 0) {
        setFileList([
          {
            uid: '-1',
            name: userInfo.name,
            url: userInfo.image,
          },
        ]);
      } else if (
        !userInfo.image ||
        userInfo.image === '' ||
        userInfo.image === null ||
        userInfo.image === undefined
      ) {
        setFileList([]);
      }
    }
  }, [userInfo, form]);

  // 表单布局配置
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  // 表单字段规则配置
  const rules = {
    required: true,
    message: '此项为必填项',
  };
  // 角色映射
  const roleMap: Record<number, string> = {
    1: '管理员',
    2: '医院',
    3: '医生',
    4: '用户',
  };
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
  // 将 roleId 映射为角色名称
  const roleName = roleMap[userInfo.roleId] || '未知角色';
  return (
    <div className="profile">
      <Spin spinning={loading}>
        {userInfo.roleId === 1 && (
          <Form form={form} {...formLayout}>
            <Form.Item label="用户ID" name="id">
              <Input type="text" disabled />
            </Form.Item>
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ ...rules }, { max: 20, message: '用户名最多20个字符' }]}
            >
              <Input type="text" />
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              rules={[{ ...rules }, { max: 20, message: '密码最多20个字符' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="手机号"
              name="phone"
              rules={[
                { ...rules },
                { pattern: /^[0-9]{11}$/, message: '请输入有效的手机号' },
              ]}
            >
              <Input type="text" />
            </Form.Item>

            <Form.Item
              label="身份证号"
              name="identityCard"
              initialValue={userInfo?.identityCard}
            >
              <Input type="text" disabled />
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                { ...rules },
                { type: 'email', message: '请输入有效的邮箱' },
              ]}
            >
              <Input type="text" />
            </Form.Item>

            <Form.Item label="地址" name="address" rules={[{ ...rules }]}>
              <Input type="text" />
            </Form.Item>

            <Form.Item label="角色" name="role" initialValue={roleName}>
              <Input type="text" disabled />
            </Form.Item>
          </Form>
        )}
        {userInfo.roleId === 2 && (
          <Form form={form} {...formLayout}>
            <Form.Item label="ID" name="id">
              <Input type="text" disabled />
            </Form.Item>
            <Form.Item
              label="名称"
              name="username"
              rules={[
                { ...rules },
                { max: 20, message: '医院名称最多20个字符' },
              ]}
            >
              <Input type="text" />
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              rules={[{ ...rules }, { max: 20, message: '密码最多20个字符' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item label="照片" name="image" rules={[{ ...rules }]}>
              <div>
                <Upload
                  name="image"
                  action="http://localhost:8077/admin/upload"
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  headers={{
                    token: localStorage.getItem('token')!,
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
              label="地址"
              name="address"
              rules={[
                { ...rules },
                { max: 50, message: '医院地址最多50个字符' },
              ]}
            >
              <Input type="text" />
            </Form.Item>
            <Form.Item label="电话" name="phone" rules={[{ ...rules }]}>
              <Input type="text" />
            </Form.Item>
            <Form.Item label="官网" name="website" rules={[{ ...rules }]}>
              <Input type="text" />
            </Form.Item>
            <Form.Item
              label="医院简介"
              name="description"
              rules={[{ ...rules }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item label="所在城市" name="citiesId">
              <Select placeholder="请选择城市">
              {cityList.map((city) => (
                  <Select.Option key={city.id} value={city.id}>
                    {city.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        )}
        {userInfo.roleId === 3 && (
          <Form form={form} {...formLayout}>
            <Form.Item label="ID" name="id">
              <Input type="text" disabled />
            </Form.Item>
            <Form.Item
              label="名称"
              name="name"
              rules={[
                { ...rules },
                { max: 20, message: '医生名称最多20个字符' },
              ]}
            >
              <Input type="text" />
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              rules={[{ ...rules }, { max: 20, message: '密码最多20个字符' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item label="医生照片" name="image">
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
              label="手机号"
              name="phone"
              rules={[
                { ...rules },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
              ]}
            >
              <Input type="text" />
            </Form.Item>
            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                { ...rules },
                { type: 'email', message: '请输入正确的邮箱' },
              ]}
            >
              <Input type="text" />
            </Form.Item>
            <Form.Item
              label="费用"
              name="fee"
              rules={[
                { ...rules },
                { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入正确的费用' },
              ]}
            >
              <Input prefix="￥" suffix="RMB" />
            </Form.Item>
            <Form.Item label="科室" name="departmentId" rules={[{ ...rules }]}>
              <Select placeholder="请选择科室">
                {hospitalData.departmentCounts.map((department:any) => (
                  <Select.Option key={department.id} value={department.id}>
                    {department.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="职称" name="qualification" rules={[{ ...rules }]}>
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
              label="所属医院"
              name="hospitalId"
              rules={[{ ...rules }]}
            >
              <Select placeholder="请选择所属医院">
                {hospitalData.hospitalConuts.map((hospital:any) => (
                  <Select.Option key={hospital.id} value={hospital.id}>
                    {hospital.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="简介" name="description" rules={[{ ...rules }]}>
              <Input.TextArea />
            </Form.Item>
          </Form>
        )}
        <Button onClick={changeUserInfo} type="primary" block>
          修改
        </Button>
      </Spin>
    </div>
  );
};

export default Profile;
