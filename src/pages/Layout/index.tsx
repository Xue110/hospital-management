import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import './index.scss';
import {
  AccountBookOutlined,
  BellOutlined,
  CalendarOutlined,
  ExperimentOutlined,
  FireOutlined,
  FormOutlined,
  HeartOutlined,
  HomeOutlined,
  InsertRowBelowOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  PayCircleOutlined,
  PhoneOutlined,
  PieChartOutlined,
  RobotOutlined,
  RocketOutlined,
  ScheduleOutlined,
  SmileOutlined,
  SolutionOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Menu, Layout, Breadcrumb, theme, Popconfirm } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserInfo, fetchUserInfo } from '../../store/module/user';
import CurrentTime from './Cite/currentTime';
import { AppDispatch } from '../../type/login';
import { getPathAPI } from '../../apis/layout';
import logo from '../../assets/image/logo.png'
const { Header, Content, Sider } = Layout;

// 扩展 Menu.Item 类型来支持 path 属性
type MenuItem = {
  key: React.Key;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: MenuItem[];
  id?: number; // 允许 MenuItem 有 path 属性
};

// 为菜单项创建一个工厂函数
function getItem(
  label: React.ReactNode,
  key: React.Key,
  id?: number, // 可选的 path 属性
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    label,
    id,
    icon,
    children,
  };
}
console.log(getItem);

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>('/home');
  const [breadcrumbItems, setBreadcrumbItems] = useState<string[]>(['首页']);
  const [items, setItems] = useState<MenuItem[]>([
    { key: 'home', label: '首页', icon: <HomeOutlined /> },
    { key: 'user', label: '用户管理', icon: <UsergroupAddOutlined /> },
    { key: 'order', label: '订单管理', icon: <AccountBookOutlined /> },
    { key: 'Reservation', label: '预约记录', icon: <BellOutlined /> },
    { key: 'Scheduling', label: '医生排班管理', icon: <CalendarOutlined /> },
    { key: 'Workforce', label: '医院排班管理', icon: <CalendarOutlined /> },
    {
      key: 'hospital',
      label: '医院管理',
      icon: <HeartOutlined />,
      children: [
        {
          key: 'hospital/hospitalInfo',
          label: '医院信息',
          icon: <FireOutlined />,
        },
        {
          key: 'hospital/department',
          label: '科室管理',
          icon: <InsertRowBelowOutlined />,
        },
        { key: 'hospital/doctor', label: '医生管理', icon: <RobotOutlined /> },
        {
          key: 'hospital/inhospital',
          label: '住院管理',
          icon: <RocketOutlined />,
        },
        { key: 'hospital/Register', label: '挂号记录', icon: <PhoneOutlined /> },
        { key: 'hospital/medical', label: '药品管理', icon: <ExperimentOutlined /> },
      ],
    },
    {
      key: 'patent',
      label: '患者管理',
      icon: <PieChartOutlined />,
      children: [
        {
          key: 'patent/medicine',
          label: '药品处方',
          icon: <MedicineBoxOutlined />,
        },
        { key: 'patent/charge', label: '收费记录', icon: <PayCircleOutlined /> },
        {
          key: 'patent/consultation',
          label: '就诊记录',
          icon: <SolutionOutlined />,
        },
        { key: 'patent/details', label: '患者信息', icon: <SmileOutlined /> },
        { key: 'patent/examination', label: '医疗检查', icon: <FormOutlined /> },
        {
          key: 'patent/HealthRecord',
          label: '健康档案',
          icon: <ScheduleOutlined />,
        },
      ],
    },
    {
      key: 'profile',
      label: '个人信息',
      icon: <UserOutlined />,
    },
  ]);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  // 从 localStorage 或 sessionStorage 恢复路由状态
  useEffect(() => {
    const savedPath = localStorage.getItem('currentPath');
    const savedBreadcrumb = localStorage.getItem('breadcrumbItems');

    if (savedPath) {
      setCurrentPath(savedPath);
    }

    if (savedBreadcrumb) {
      setBreadcrumbItems(JSON.parse(savedBreadcrumb));
    }
  }, []);
  // 更新面包屑
  const updateBreadcrumb = (path: string) => {
    const breadcrumb = generateBreadcrumb(path);
    setBreadcrumbItems(breadcrumb);
    localStorage.setItem('breadcrumbItems', JSON.stringify(breadcrumb)); // 保存到 localStorage
  };

  // 菜单点击事件
  const onMenuItemClick = (e: any) => {
    console.log(e);
    const path = e.key;
    setCurrentPath(e.key); // 更新当前选中的菜单项 key
    // 更新面包屑
    const breadcrumbList = generateBreadcrumb(path);
    localStorage.setItem('currentPath', e.key); // 保存当前路径到 localStorage
    setBreadcrumbItems(breadcrumbList);
    // 跳转到对应的路由
    navigate(`/${path}`);
    updateBreadcrumb(e.key); // 更新面包屑
  };

  // 根据菜单的path生成面包屑内容
  const generateBreadcrumb = (path: string): string[] => {
    const breadcrumbMap: Record<string, string[]> = {
      home: ['首页'],
      order: ['首页', '订单管理'],
      user: ['首页', '用户管理'],
      Reservation: ['首页', '预约管理'],
      Scheduling: ['首页', '医生排班管理'],
      Workforce: ['首页', '医院排班管理'],
      'hospital/department': ['首页', '医院管理', '科室管理'],
      'hospital/doctor': ['首页', '医院管理', '医生管理'],
      'hospital/hospitalInfo': ['首页', '医院管理', '医院信息'],
      'hospital/inhospital': ['首页', '医院管理', '住院管理'],
      'hospital/Register': ['首页', '医院管理', '挂号记录'],
      'hospital/medical': ['首页', '医院管理', '药品管理'],
      'patent/medicine': ['首页', '患者管理', '药品处方'],
      'patent/charge': ['首页', '患者管理', '收费记录'],
      'patent/consultation': ['首页', '患者管理', '就诊记录'],
      'patent/details': ['首页', '患者管理', '患者信息'],
      'patent/examination': ['首页', '患者管理', '医疗检查'],
      'patent/HealthRecord': ['首页', '患者管理', '健康档案'],
      profile: ['首页', '个人信息'],
    };
    return breadcrumbMap[path] || ['首页'];
  };
  // 触发个人用户信息action
  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);

  const userInfo = useSelector((state: any) => state.user.userInfo);
  // 获取菜单项
  useEffect(() => {
    const fetchPath = async () => {
      const res = await getPathAPI(userInfo.roleId);
      setItems(res.data)
    };
    fetchPath()
  }, [userInfo.roleId]);
  if (!items || items.length === 0 || !userInfo) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }
  const onConfirm = () => {
    dispatch(clearUserInfo());
    navigate('/login');
  };
  const name = userInfo.name || '未登录';
  return (
    <Layout style={{ minHeight: '100vh', minWidth: '100vw', overflow: 'auto' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo">
          <img
            src={logo}
            alt="Logo"
            style={{
              width: collapsed ? '40px' : '40px',
              margin: collapsed ? '0 0 0 10px' : '0 0 0 20px',
              height: 'auto', // 保持比例
            }}
          />
          {!collapsed && <h2>吉诊宝</h2>} {/* 当 Sider 未折叠时显示文字 */}
        </div>

        <Menu
          theme="dark"
          defaultSelectedKeys={['/home']}
          mode="inline"
          items={items}
          selectedKeys={[currentPath]}
          onClick={onMenuItemClick}
        />
      </Sider>
      <Layout className="layout-content">
        <Header className="header">
          <div className="welcome">
            <CurrentTime />
            <span className="welcome-text">欢迎您 {name}</span>
          </div>
          <div className="user-info">
            <span className="user-name">{name}</span>
            <span className="user-logout">
              <Popconfirm
                title="是否确认退出？"
                okText="退出"
                cancelText="取消"
                onConfirm={onConfirm}
                okButtonProps={{
                  style: {
                    fontSize: '14px',
                    padding: '6px 12px',
                    width: '60px',
                  },
                }}
                cancelButtonProps={{
                  style: { fontSize: '14px', padding: '6px 12px' },
                }}
              >
                <LogoutOutlined /> 退出
              </Popconfirm>
            </span>
          </div>
        </Header>
        <Content style={{ margin: '0 15px', overflowY: 'auto' }}>
          <Breadcrumb style={{ margin: '15px 0' }}>
            {breadcrumbItems.map((item, index) => (
              <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
          <div
            className="layout-content"
            style={{
              padding: 10,
              minHeight: 360,
              background: '#fff',
              borderRadius: borderRadiusLG,
            }}
          >
            {/* 二级路由的出口 */}
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
