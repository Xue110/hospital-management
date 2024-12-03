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
  ShopOutlined,
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
import logo from '../../assets/image/logo.png';
import { getPathAPI } from '../../apis/layout';
import { getHospitalData } from '../../store/module/storge';
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
// 图标映射表
const iconMap: { [key: string]: React.ReactNode } = {
  home: <HomeOutlined />,
  user: <UsergroupAddOutlined />,
  order: <AccountBookOutlined />,
  reservation: <BellOutlined />,
  scheduling: <CalendarOutlined />,
  workforce: <CalendarOutlined />,
  hospital: <HeartOutlined />,
  fire: <FireOutlined />,
  department: <InsertRowBelowOutlined />,
  doctor: <RobotOutlined />,
  inhospital: <RocketOutlined />,
  register: <PhoneOutlined />,
  medical: <ExperimentOutlined />,
  patent: <PieChartOutlined />,
  medicine: <MedicineBoxOutlined />,
  charge: <PayCircleOutlined />,
  consultation: <SolutionOutlined />,
  details: <SmileOutlined />,
  examination: <FormOutlined />,
  xxx: <ScheduleOutlined />,
  profile: <UserOutlined />,
  yyyy:<ShopOutlined />,
};
// 递归映射菜单项

const mapIcons = (items: MenuItem[]): MenuItem[] => {
  return items.map((item) => {
    const { icon, children, ...rest } = item;
    let mappedIcon = icon;

    // 如果icon是字符串类型才进行处理
    if (typeof icon === 'string') {
      mappedIcon = iconMap[icon.toLowerCase()] || icon; // 根据icon映射表获取图标
    }

    return {
      ...rest,
      icon: mappedIcon,
      children: children ? mapIcons(children) : undefined, // 递归处理子菜单
    };
  });
};

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>('/home');
  const [breadcrumbItems, setBreadcrumbItems] = useState<string[]>(['首页']);
  const [items, setItems] = useState<MenuItem[]>([]);
  // 遍历数组，并移除 children 为空的属性
  items.forEach((item) => {
    if (item.children?.length === 0) {
      delete item.children; // 删除 children 属性
    } else if (item.children) {
      item.children.forEach((child) => {
        if (child.children?.length === 0) delete child.children;
      });
    }
  });
  // 映射图标
  const mappedItems = mapIcons(items);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getHospitalData());
    };
    fetchData();
  }, []);
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
    const path = e.key;
    setCurrentPath(e.key); // 更新当前选中的菜单项 key
    // 更新面包屑
    const breadcrumbList = generateBreadcrumb(path);
    localStorage.setItem('currentPath', e.key); // 保存当前路径到 localStorage
    setBreadcrumbItems(breadcrumbList);
    // 跳转到对应的路由
    console.log(path);
    navigate(`/${path}`);
    updateBreadcrumb(e.key); // 更新面包屑
  };
  // 根据菜单的path生成面包屑内容
  const generateBreadcrumb = (path: string): string[] => {
    const breadcrumbMap: Record<string, string[]> = {
      'admin/home': ['首页'],
      '/admin/order': ['首页', '订单管理'],
      '/admin/user': ['首页', '用户管理'],
      '/admin/Reservation': ['首页', '预约管理'],
      '/admin/Scheduling': ['首页', '医生排班管理'],
      '/admin/Workforce': ['首页', '医院排班管理'],
      '/admin/hospital/department': ['首页', '医院管理', '科室管理'],
      '/admin/hospital/doctor': ['首页', '医院管理', '医生管理'],
      '/admin/hospital/info': ['首页', '医院管理', '医院信息'],
      '/admin/hospital/inpatient': ['首页', '医院管理', '住院管理'],
      '/admin/hospital/registration': ['首页', '医院管理', '挂号记录'],
      '/admin/hospital/medication': ['首页', '医院管理', '药品管理'],
      '/admin/hospital/ward': ['首页', '医院管理', '病房管理'],
      '/admin/patient/prescription': ['首页', '患者管理', '药品处方'],
      '/admin/patient/order': ['首页', '患者管理', '收费记录'],
      '/admin/patient/registration': ['首页', '患者管理', '就诊记录'],
      '/admin/patient/info': ['首页', '患者管理', '患者信息'],
      '/admin/patient/report': ['首页', '患者管理', '医疗检查'],
      '/admin/patient/medicalRecord': ['首页', '患者管理', '健康档案'],
      '/admin/profile': ['首页', '个人信息'],
    };
    return breadcrumbMap[path] || ['首页'];
  };
  // 触发个人用户信息action
  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);

  const userInfo = useSelector((state: any) => state.user.userInfo);

  // 获取菜单项，确保只有在获取到 userInfo 后才执行
  useEffect(() => {
    if (userInfo && userInfo.roleId) {
      const fetchPath = async () => {
        const res = await getPathAPI(userInfo.roleId);
        console.log(res.data);
        setItems(res.data);
      };
      fetchPath();
    }
  }, [userInfo]);
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
  const name = userInfo.username || '未登录';
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
          items={mappedItems}
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
