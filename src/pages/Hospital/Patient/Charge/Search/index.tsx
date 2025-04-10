import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import './index.scss';
import { Button, Col, Form, Row, Select } from 'antd';
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
      props.onFilterChange(values);
    });
  };
  return (
    <div>
      <Form form={form} layout="inline">
        <Row justify="space-between" style={{ width: '100%' }}>
          {/* 患者名输入框 */}
          <Col span={6}>
            <Form.Item name="patientId" label="患者">
              <Select placeholder="请选择患者">
                {hospitalData.patientCounts.map((patient: any) => (
                  <Select.Option key={patient.id} value={patient.id}>
                    {patient.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* 医生名选择框 */}
          {userInfo.roleId !== 3 && (
            <Col span={6}>
              <Form.Item name="doctorId" label="医生">
                <Select placeholder="请选择医生">
                  {hospitalData.doctorCounts.map((doctor: any) => (
                    <Select.Option key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}

          {/* 医院名选择框 */}
          {userInfo.roleId === 1 && (
            <Col span={6}>
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
          {/* 类型选择框 */}
          <Col span={6}>
            <Form.Item name="type" label="类型">
              <Select placeholder="请选择类型">
                <Select.Option value={1}>挂号</Select.Option>
                <Select.Option value={2}>住院</Select.Option>
                <Select.Option value={3}>其他</Select.Option>
              </Select>
            </Form.Item>
          </Col>
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
