import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login/index';
import Layout from '../pages/Layout/index';
import AuthRoute from '../components/AuthRoute';
import Forget from '../pages/Forget/index';
import Home from '../pages/Home';
import Order from '../pages/Order';
import Profile from '../pages/Profile';
import Reservation from '../pages/Reservation';
import Scheduling from '../pages/Scheduling';
import User from '../pages/User';
import Workforce from '../pages/Workforce';
import Department from '../pages/Hospital/Department';
import Doctor from '../pages/Hospital/Doctor';
import Inhospital from '../pages/Hospital/Inhospital';
import Register from '../pages/Hospital/Register';
import Charge from '../pages/Hospital/Patient/Charge';
import Consultation from '../pages/Hospital/Patient/Consultation';
import Details from '../pages/Hospital/Patient/Details';
import Examination from '../pages/Hospital/Patient/Examination';
import HealthRecords from '../pages/Hospital/Patient/HealthRecords';
import Medicine from '../pages/Hospital/Patient/Medicine';
import HospitalInfo from '../pages/Hospital/HospitalInfo';
import Medical from '../pages/Hospital/medical';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthRoute><Layout /></AuthRoute>,
    children:[
      {
        path: '/*',
        element: <div>跳转页面错误，404</div>
      },
      {
        path: '/home',
        element: <AuthRoute><Home /></AuthRoute>
      },
      {
        path:'/order',
        element: <AuthRoute><Order /></AuthRoute>
      },
      {
        path:'/profile',
        element: <AuthRoute><Profile /></AuthRoute>
      },
      {
        path: '/Reservation',
        element: <AuthRoute><Reservation /></AuthRoute>
      },
      {
        path: '/Scheduling',
        element: <AuthRoute><Scheduling /></AuthRoute>
      },
      {
        path: '/user',
        element: <AuthRoute><User /></AuthRoute>
      },
      {
        path: 'Workforce',
        element: <AuthRoute><Workforce /></AuthRoute>
      },
      {
        path: '/hospital/department',
        element: <AuthRoute><Department /></AuthRoute>
      },
      {
        path: '/hospital/doctor',
        element: <AuthRoute><Doctor /></AuthRoute>
      },
      {
        path: '/hospital/hospitalInfo',
        element: <AuthRoute><HospitalInfo /></AuthRoute>
      },
      {
        path: '/hospital/inhospital',
        element: <AuthRoute><Inhospital /></AuthRoute>
      },
      {
        path: '/hospital/Register',
        element: <AuthRoute><Register /></AuthRoute>
      },
      {
        path: '/hospital/medical',
        element: <AuthRoute><Medical /></AuthRoute>
      },
      {
        path: '/patent/charge',
        element: <AuthRoute><Charge /></AuthRoute>
      },
      {
        path: '/patent/consultation',
        element: <AuthRoute><Consultation /></AuthRoute>
      },
      {
        path: '/patent/details',
        element: <AuthRoute><Details /></AuthRoute>
      },
      {
        path: '/patent/examination',
        element: <AuthRoute><Examination /></AuthRoute>
      },
      {
        path: '/patent/HealthRecord',
        element: <AuthRoute><HealthRecords /></AuthRoute>
      },
      {
        path: '/patent/medicine',
        element: <AuthRoute><Medicine /></AuthRoute>
      }
    ]
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/forget',
    element: <Forget />,
  }
]);

export default router;
