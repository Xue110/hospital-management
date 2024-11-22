import { useEffect, useState } from 'react';
import DoctorNum from './c-cpns/DoctorNum';
import HospitalNum from './c-cpns/HospitalNum';
import PatientsNum from './c-cpns/PatientsNum';
import RegisterNum from './c-cpns/RegisterNum';
import './index.scss';
// import { getHospitalCount, getPermission } from '../../apis/home';
import RegisterSenven from './c-cpns/RegisterSenven';
import HospitalCard from './c-cpns/HospitalCard';
import DoctorCount from './c-cpns/DoctorCount';
import DepartmentCount from './c-cpns/DepartmentCount';
import RegisterCount from './c-cpns/RegisterCount';
import BedCount from './c-cpns/BedCount';
import PatientTraffic from './c-cpns/PatientTraffic';
import DoctorVisit from './c-cpns/DoctorVisit';
import PatientCount from './c-cpns/PatientCount';
import ZhuYuan from './c-cpns/zhuyuan';
import GuaHao from './c-cpns/GuaHao';
import { getHospitalCount, getPermission } from '../../apis/home';
const Home = () => {
  const [showEcharts, setShowEcharts] = useState(1);
  const [information, setInformation] = useState({
    hospitalNum: 8,
    doctorNum: 77,
    departmentNum: 18,
    registerNum: 1666,
    bedNum: 888,
  });
  useEffect(() => {
    const fetchData = async() =>{
      const res = await getPermission()
      setShowEcharts(res.data.roleId);
    }
    const fetchInformation = async()=>{
      const res = await getHospitalCount()
      setInformation(res.data)
    }
    fetchData()
    fetchInformation()
  },[]);
  const roleId = 1; // 1:管理员 2:医院 3:医生
  const roleNames = {
    1: '管理员',
    2: '医院',
    3: '医生',
  };
  const roleName = roleNames[roleId];
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
          <HospitalNum />
          {/* 医生数量 */}
          <DoctorNum />
          {/* 患者数量 */}
          <PatientsNum />
          {/* 今日挂号人数 */}
          <RegisterNum />
          {/* 七天内挂号人数 */}
          <RegisterSenven />
        </div>
      )}
      {showEcharts == 2 && (
        <div className="content">
          <DepartmentCount departmentNum={information.departmentNum} />
          <DoctorCount doctorNum={information.doctorNum} />
          {/* 患者数量 */}
          <RegisterCount registerNum={information.registerNum} />
          {/* 剩余床位数 */}
          <BedCount bedNum={information.bedNum} />
          {/* 患者流量趋势 */}
          <PatientTraffic />
          {/* 当前医生出诊情况 */}
          <DoctorVisit />
        </div>
      )}
      {showEcharts == 3 && (
        <div className="content">
          {/* 今日挂号人数 */}
          <RegisterCount registerNum={information.registerNum} />
          {/* 患者人数 */}
          <PatientCount/>
          {/* 住院人数 */}
          <ZhuYuan />
          {/* 患者流量趋势 */}
          <PatientTraffic />
          {/* 当前医生今日挂号情况 */}
          <GuaHao />
        </div>
      )}
    </div>
  );
};
export default Home;
