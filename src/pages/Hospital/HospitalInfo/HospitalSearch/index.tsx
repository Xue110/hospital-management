import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import './index.scss';
import { Button, Col, Form, Input, Row, Select } from 'antd';
const Search = (props: any) => {
  const [form] = Form.useForm();
  // 重置表单
  const handleReset = () => {
    form.resetFields();
    props.onFilterChange({});
  };
  // 搜索
  const handleSearch = () => {
    form.validateFields().then((values) => {
      console.log(values)
      props.onFilterChange(values);
    });
  };
  return (
    <div>
      <Form form={form} layout="inline">
        <Row justify="space-between" style={{ width: '100%' }}>
          {/* 医院ID输入框 */}
          <Col span={7}>
            <Form.Item name="id" label="医院ID">
              <Input placeholder="请输入医院ID" />
            </Form.Item>
          </Col>

          {/* 医院名输入框 */}
          <Col span={7}>
            <Form.Item name="name" label="医院名">
              <Input placeholder="请输入医院名" />
            </Form.Item>
          </Col>

          {/* 省份选择框 */}
          <Col span={7}>
            <Form.Item name="citiesId" label="城市">
              <Select placeholder="请选择城市">
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
