import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import './index.scss';
import { Button, Col, Form, Row, Select, DatePicker } from 'antd';
import { useSelector } from 'react-redux';

const { RangePicker } = DatePicker;
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
      const [startTime,endTime] = values.time;
      values.startTime = startTime.format('YYYY-MM-DD HH:mm:ss')
      values.endTime = endTime.format('YYYY-MM-DD HH:mm:ss')
      props.onFilterChange(values);
    });
  };
  const options = hospitalData.userCounts.map(
    (patient: { id: number; name: string }) => ({
      value: patient.id,
      label: patient.name,
    })
  );
  return (
    <div>
      <Form form={form} layout="inline">
        {userInfo.roleId === 1 && (
          <>
            <Row justify="space-between" style={{ width: '100%' }}>
              {/* 患者名输入框 */}
              <Col span={7}>
                <Form.Item name="userId" label="患者名">
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
              </Col>
              {/* 医生名选择框 */}
              <Col span={7}>
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
            </Row>
            <Row
              justify="space-between"
              style={{ width: '100%', marginTop: '16px' }}
            >
              <Col span={2}></Col>
              {/* 医院名选择框 */}
              <Col span={8}>
                <Form.Item name="hospitalId" label="医院">
                  <Select placeholder="请选择所属医院">
                    {hospitalData.hospitalCounts.map((hospital: any) => (
                      <Select.Option key={hospital.id} value={hospital.id}>
                        {hospital.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              {/* 预约时间段选择框 */}
              <Col span={8}>
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
              </Col>
              <Col span={2}></Col>
            </Row>
          </>
        )}
        {userInfo.roleId === 2 && (
          <>
            <Row justify="space-between" style={{ width: '100%' }}>
              <Col span={2}></Col>
              {/* 患者名输入框 */}
              <Col span={8}>
                <Form.Item name="patientId" label="患者名">
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
              </Col>
              {/* 医生名选择框 */}
              <Col span={8}>
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
              <Col span={2}></Col>
            </Row>
            <Row
              justify={'space-between'}
              style={{ width: '100%', marginTop: '20px' }}
            >
              <Col span={2}></Col>
              {/* 科室名选择框 */}
              <Col span={8}>
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
              {/* 预约时间段选择框 */}
              <Col span={8}>
                <Form.Item name="time" label="预约时间段">
                  <RangePicker
                    showTime
                  />
                </Form.Item>
              </Col>
              <Col span={2}></Col>
            </Row>
          </>
        )}
        {userInfo.roleId === 3 && (
          <>
            <Row justify={'space-between'} style={{ width: '100%' }}>
              <Col span={2}></Col>
              {/* 患者名输入框 */}
              <Col span={7}>
                <Form.Item name="patientId" label="患者名">
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
              </Col>
              {/* 预约时间段选择框 */}
              <Col span={7}>
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
              </Col>
              <Col span={2}></Col>
            </Row>
          </>
        )}
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
