import { createHashRouter } from 'react-router-dom';
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
import Ward from '../pages/Hospital/Ward';

const router = createHashRouter([
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
        path: '/schedule',
        element: <AuthRoute><Reservation /></AuthRoute>
      },
      {
        path: '/schedules',
        element: <AuthRoute><Scheduling /></AuthRoute>
      },
      {
        path: '/user',
        element: <AuthRoute><User /></AuthRoute>
      },
      {
        path: '/registration',
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
        path: '/hospital/info',
        element: <AuthRoute><HospitalInfo /></AuthRoute>
      },
      {
        path: '/hospital/inpatient',
        element: <AuthRoute><Inhospital /></AuthRoute>
      },
      {
        path: '/hospital/registration',
        element: <AuthRoute><Register /></AuthRoute>
      },
      {
        path: '/hospital/medication',
        element: <AuthRoute><Medical /></AuthRoute>
      },
      {
        path: '/hospital/ward',
        element: <AuthRoute><Ward /></AuthRoute>
      },
      {
        path: '/patient/order',
        element: <AuthRoute><Charge /></AuthRoute>
      },
      {
        path: '/patient/registration',
        element: <AuthRoute><Consultation /></AuthRoute>
      },
      {
        path: '/patient/info',
        element: <AuthRoute><Details /></AuthRoute>
      },
      {
        path: '/patient/report',
        element: <AuthRoute><Examination /></AuthRoute>
      },
      {
        path: '/patient/medicalRecord',
        element: <AuthRoute><HealthRecords /></AuthRoute>
      },
      {
        path: '/patient/prescription',
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
