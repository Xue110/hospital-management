import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import './index.scss';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useSelector } from 'react-redux';
const Search = (props: any) => {
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const hospitalData = useSelector((state: any) => state.hospital.hospitalList);
  const [form] = Form.useForm();
  // 重置表单
  const handleReset = () => {
    form.resetFields();
    props.onFilterChange({});
  };
  // 搜索
  const handleSearch = () => {
    form.validateFields().then((values) => {
      if (userInfo.roleId === 2) {
        values.hospitalId = userInfo.hospitalId;
      }
      props.onFilterChange(values);
    });
  };
  return (
    <div>
      <Form form={form} layout="inline">
        <Row justify="space-between" style={{ width: '100%' }}>
          {/* 医生名输入框 */}
          <Col span={7}>
            <Form.Item name="name" label="医生名">
              <Input placeholder="请输入医生名" />
            </Form.Item>
          </Col>

          {/* 科室名选择框 */}
          <Col span={7}>
            <Form.Item name="departmentId" label="科室">
              <Select placeholder="请选择科室">
                {hospitalData.departmentCounts.map((department: any) => (
                  <Select.Option key={department.id} value={department.id}>
                    {department.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* 医院名选择框 */}
          {userInfo.roleId === 1 && (
            <Col span={7}>
              <Form.Item name="hospitalId" label="医院">
                <Select placeholder="请选择医院">
                  {hospitalData.hospitalCounts.map((hospital: any) => (
                    <Select.Option key={hospital.id} value={hospital.id}>
                      {hospital.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>

      {/* 按钮部分 */}
      <Row justify="end" style={{ marginTop: '16px' }}>
        <Col>
          <Button
            size="small"
            type="primary"
            style={{ marginRight: '8px' }}
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            查询
          </Button>
        </Col>
        <Col>
          <Button
            type="primary"
            danger
            style={{ marginLeft: '8px', border: '0' }}
            icon={<SyncOutlined />}
            size="small"
            onClick={handleReset}
          >
            重置
          </Button>
        </Col>
      </Row>
    </div>
  );
};
export default Search;
