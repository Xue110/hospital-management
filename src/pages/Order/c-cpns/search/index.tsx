import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import './index.scss';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useSelector } from 'react-redux';
const Search = (props: any) => {
  const hospitalData = useSelector((state: any) => state.hospital.hospitalList);
  const [form] = Form.useForm();
  const userInfo = useSelector((state: any) => state.user.userInfo);
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
          {/* 订单ID输入框 */}
          <Col span={7}>
            <Form.Item name="id" label="订单ID">
              <Input placeholder="请输入订单ID" />
            </Form.Item>
          </Col>

          {/* 医院名输入框 */}
          {userInfo.roleId === 1 && (
            <Col span={7}>
              <Form.Item name="hospitalId" label="医院">
                <Select placeholder="请选择医院">
                  {hospitalData.hospitalCounts.map((item: any) => {
                    return (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          )}

          {/* 订单状态选择框 */}
          <Col span={7}>
            <Form.Item name="paymentStatus" label="订单状态">
              <Select placeholder="请选择订单状态">
                <Select.Option value={1}>未支付</Select.Option>
                <Select.Option value={2}>已支付</Select.Option>
                <Select.Option value={3}>已取消</Select.Option>
                <Select.Option value={4}>已超时</Select.Option>
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
