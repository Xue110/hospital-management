import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import './index.scss';
import { Button, Col, Form, Input, Row } from 'antd';
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
      console.log(values);
      props.onFilterChange(values);
    });
  };
  return (
    <div>
      <Form form={form} layout="inline">
        <Row justify="space-around" style={{ width: '100%' }}>
          {/* 科室ID输入框 */}
          <Col span={8}>
            <Form.Item name="id" label="科室ID">
              <Input placeholder="请输入科室ID" />
            </Form.Item>
          </Col>

          {/* 科室名输入框 */}
          <Col span={8}>
            <Form.Item name="name" label="科室名">
              <Input placeholder="请输入科室名" />
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
