import { useEffect, useState } from 'react';
import DoctorNum from './c-cpns/DoctorNum';
import HospitalNum from './c-cpns/HospitalNum';
import PatientsNum from './c-cpns/PatientsNum';
import RegisterNum from './c-cpns/RegisterNum';
import './index.scss';
import RegisterSenven from './c-cpns/RegisterSenven';
import HospitalCard from './c-cpns/HospitalCard';
import DoctorCount from './c-cpns/DoctorCount';
import DepartmentCount from './c-cpns/DepartmentCount';
import RegisterCount from './c-cpns/RegisterCount';
import BedCount from './c-cpns/BedCount';
import PatientTraffic from './c-cpns/PatientTraffic';
import PatientCount from './c-cpns/PatientCount';
import ZhuYuan from './c-cpns/zhuyuan';
import GuaHao from './c-cpns/GuaHao';
import { getProfileAPI } from '../../apis/login';
import { getHospitalCount } from '../../apis/home';
import PatientTrafficByDoctor from './c-cpns/PatientTrafficByDoctor';
const Home = () => {
  const [showEcharts, setShowEcharts] = useState(1);
  const [roleId, setRoleId] = useState(1);
  const [id, setId] = useState(1);
  const [information, setInformation] = useState({
    hospitalNum: 8,
    doctorNum: 77,
    departmentNum: 18,
    registerNum: 1666,
    bedNum: 888,
    hospitalNumByArea: [],
    doctorNumByHospital: [],
    patientNumByHospital: [],
    registerNumByHospital: [],
    registerNumByHospital7: [],
  });
  const [hospitalData, setHospitalData] = useState({
    doctorNum: 77,
    departmentNum: 18,
    registerNum: 1666,
    bedNum: 888,
    registerNumByHospital7: [],
  })
  const [doctorData, setDoctorData] = useState({
    patientNum: 77,
    registerNum: 18,
    inpatientNum: 0,
    patientNumByDoctor7	: [],
    registerNumByDoctor:[]
  })
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const res = await getProfileAPI();
      setShowEcharts(res.data.roleId);
      setRoleId(res.data.roleId);
      setId(res.data.userId);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchInformation = async () => {
      const res = await getHospitalCount(roleId,id);
      if (roleId == 1) {
        setInformation(res.data);
      } else if (roleId == 2) {
        setHospitalData(res.data);
      } else if (roleId == 3) {
        setDoctorData(res.data);
      }
      setIsLoading(false);
    };
    fetchInformation();
  },[roleId,id]);
  const roleNames = {
    1: '管理员',
    2: '医院',
    3: '医生',
  };
  const roleName = roleNames[roleId as 1 | 2 | 3];
  if (isLoading) {
    return <div>Loading...</div>; // 显示加载状态
  }
  return (
    <div className="home">
      <h1>吉诊宝-综合医疗服务平台-{roleName}后台管理系统</h1>
      {/* 管理员端 */}
      {showEcharts == 1 && (
        <div className="content">
          {/* 医院总数量 */}
          <HospitalCard hospitalNum={information.hospitalNum} />
          <DepartmentCount departmentNum={information.departmentNum} />
          <DoctorCount doctorNum={information.doctorNum} />
          <RegisterCount registerNum={information.registerNum} />
          {/* 医院数量 */}
          <HospitalNum number={information.hospitalNumByArea} />
          {/* 医生数量 */}
          <DoctorNum number={information.doctorNumByHospital} />
          {/* 患者数量 */}
          <PatientsNum number={information.patientNumByHospital} />
          {/* 今日挂号人数 */}
          <RegisterNum number={information.registerNumByHospital} />
          {/* 七天内挂号人数 */}
          <RegisterSenven number={information.registerNumByHospital7} />
        </div>
      )}
      {showEcharts == 2 && (
        <div className="content">
          <DepartmentCount departmentNum={hospitalData.departmentNum} />
          <DoctorCount doctorNum={hospitalData.doctorNum} />
          {/* 患者数量 */}
          <RegisterCount registerNum={hospitalData.registerNum} />
          {/* 剩余床位数 */}
          <BedCount bedNum={hospitalData.bedNum} />
          {/* 患者流量趋势 */}
          <PatientTraffic number={hospitalData.registerNumByHospital7} />
        </div>
      )}
      {showEcharts == 3 && (
        <div className="content">
          {/* 今日挂号人数 */}
          <RegisterCount registerNum={doctorData.registerNum} />
          {/* 患者人数 */}
          <PatientCount number={doctorData.patientNum} />
          {/* 住院人数 */}
          <ZhuYuan number={doctorData.inpatientNum} />
          {/* 患者流量趋势 */}
          <PatientTrafficByDoctor number={doctorData.patientNumByDoctor7} />
          {/* 当前医生今日挂号情况 */}
          <GuaHao number={doctorData.registerNumByDoctor} />
        </div>
      )}
    </div>
  );
};
export default Home;
